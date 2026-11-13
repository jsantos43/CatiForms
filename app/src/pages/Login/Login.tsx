import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { TextField } from '../../components/Field';
import { AuthLayout } from '../../layouts/AuthLayout';
import styles from '../auth.module.css';

type Errors = Partial<Record<'username' | 'password', string>>;

const validate = (username: string, password: string): Errors => {
  const errors: Errors = {};
  if (!username.trim()) errors.username = 'Informe seu username.';
  if (!password) errors.password = 'Informe sua senha.';
  return errors;
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; notice?: string } | null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Depois da primeira tentativa, os erros acompanham o que é digitado.
  const revalidate = (u: string, p: string) => submitted && setErrors(validate(u, p));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError('');

    const found = validate(username, password);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(found.username ? 'login-user' : 'login-pass')?.focus();
      return;
    }

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      navigate(state?.from ?? '/formularios', { replace: true });
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 401
          ? 'Username ou senha incorretos.'
          : 'Não foi possível entrar agora. Tente novamente em instantes.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crie, compartilhe e analise formulários."
      aside={
        <p className={styles.lead}>
          Plataforma de coleta e gerenciamento de formulários e respostas da CATI Jr.
        </p>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div>
          <h2 className={styles.title}>Entrar</h2>
          <p className={styles.subtitle}>Acesse com seu username e senha.</p>
        </div>

        {state?.notice && <Alert tone="info">{state.notice}</Alert>}

        <TextField
          id="login-user"
          label="Username"
          type="text"
          placeholder="seu.username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          error={errors.username}
          onChange={(e) => {
            setUsername(e.target.value);
            revalidate(e.target.value, password);
          }}
        />

        <TextField
          id="login-pass"
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => {
            setPassword(e.target.value);
            revalidate(username, e.target.value);
          }}
        />

        {formError && <Alert>{formError}</Alert>}

        <Button type="submit" size="lg" block loading={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>

        <p className={styles.switch}>
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
