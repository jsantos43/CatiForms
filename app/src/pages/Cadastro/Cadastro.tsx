import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { TextField } from '../../components/Field';
import { CheckIcon } from '../../components/icons';
import { AuthLayout } from '../../layouts/AuthLayout';
import styles from '../auth.module.css';

type Values = { username: string; email: string; password: string; confirm: string };
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const FIELD_IDS: Record<FieldName, string> = {
  username: 'cad-user',
  email: 'cad-email',
  password: 'cad-pass',
  confirm: 'cad-pass2',
};

const ORDER: FieldName[] = ['username', 'email', 'password', 'confirm'];

const MIN_PASSWORD = 8; // mesmo mínimo da API (api/src/schemas/User.ts)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (v: Values): Errors => {
  const errors: Errors = {};
  if (!v.username.trim()) errors.username = 'Escolha um username.';
  if (!v.email.trim()) errors.email = 'Informe seu e-mail.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Informe um e-mail válido.';
  if (v.password.length < MIN_PASSWORD)
    errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`;
  if (!v.confirm) errors.confirm = 'Repita a senha.';
  else if (v.confirm !== v.password) errors.confirm = 'As senhas não coincidem.';
  return errors;
};

// Converte o erro da API em mensagens por campo (409 = unique; 400 = validação do Zod).
const errorsFromApi = (err: ApiError): Errors => {
  const text = err.details.join(' ').toLowerCase();

  if (err.status === 409) {
    if (text.includes('email')) return { email: 'Este e-mail já está cadastrado.' };
    return { username: 'Este username já está em uso. Escolha outro.' };
  }

  if (err.status === 400) {
    const errors: Errors = {};
    if (text.includes('email')) errors.email = 'Informe um e-mail válido.';
    if (text.includes('password'))
      errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`;
    if (text.includes('username')) errors.username = 'Escolha um username.';
    return errors;
  }

  return {};
};

export default function Cadastro() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState<Values>({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const change = (name: FieldName) => (e: ChangeEvent<HTMLInputElement>) => {
    const next = { ...values, [name]: e.target.value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const focusFirst = (found: Errors) => {
    const first = ORDER.find((name) => found[name]);
    if (first) document.getElementById(FIELD_IDS[first])?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return focusFirst(found);

    const username = values.username.trim();
    setLoading(true);

    try {
      await signup({ username, email: values.email.trim(), password: values.password });
    } catch (err) {
      const apiErrors = err instanceof ApiError ? errorsFromApi(err) : {};

      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
        focusFirst(apiErrors);
      } else {
        setFormError('Não foi possível criar a conta agora. Tente novamente em instantes.');
      }
      setLoading(false);
      return;
    }

    // A API não abre sessão no cadastro: entra com os mesmos dados logo em seguida.
    try {
      await login({ username, password: values.password });
      navigate('/formularios', { replace: true });
    } catch {
      navigate('/login', {
        replace: true,
        state: { notice: 'Conta criada! Entre com seu username e senha.' },
      });
    }
  };

  return (
    <AuthLayout
      title="Com uma conta você pode"
      titleSize="md"
      aside={
        <ul className={styles.benefits}>
          <li>
            <CheckIcon />
            Criar formulários com perguntas discursivas, de múltipla escolha e de escolha única com
            justificativa
          </li>
          <li>
            <CheckIcon />
            Compartilhar um link que qualquer pessoa pode responder
          </li>
          <li>
            <CheckIcon />
            Ver as respostas e exportá-las em CSV ou PDF
          </li>
        </ul>
      }
    >
      <form className={`${styles.form} ${styles.formTight}`} onSubmit={handleSubmit} noValidate>
        <div>
          <h2 className={styles.title}>Criar conta</h2>
          <p className={styles.subtitle}>Escolha um username único na plataforma.</p>
        </div>

        <TextField
          id={FIELD_IDS.username}
          label="Username"
          type="text"
          placeholder="seu.username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={values.username}
          error={errors.username}
          onChange={change('username')}
        />

        <TextField
          id={FIELD_IDS.email}
          label="E-mail"
          type="email"
          placeholder="voce@exemplo.com"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={change('email')}
        />

        <TextField
          id={FIELD_IDS.password}
          label="Senha"
          type="password"
          placeholder={`Mínimo de ${MIN_PASSWORD} caracteres`}
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          onChange={change('password')}
        />

        <TextField
          id={FIELD_IDS.confirm}
          label="Confirmar senha"
          type="password"
          placeholder="Repita a senha"
          autoComplete="new-password"
          value={values.confirm}
          error={errors.confirm}
          onChange={change('confirm')}
        />

        {formError && <Alert>{formError}</Alert>}

        <Button type="submit" size="lg" block loading={loading}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </Button>

        <p className={styles.switch}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
