import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getPublicForm, submitResponse } from '../../api/responses';
import type { PublicForm, Question } from '../../api/types';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { ChoiceOption } from '../../components/ChoiceOption';
import { FieldError } from '../../components/Field';
import { QuestionCard, QuestionHint, QuestionLabel, RequiredMark } from '../../components/QuestionCard';
import { PublicLayout } from '../../layouts/PublicLayout';
import {
  emptyDraft,
  errorKey,
  focusTarget,
  hasContent,
  ids,
  toResponseInput,
  validateResponse,
  type AnswerDraft,
  type ResponseDraft,
  type ResponseErrors,
} from './answers';
import styles from './Responder.module.css';

type LoadState = { status: 'loading' } | { status: 'unavailable' } | { status: 'ready'; form: PublicForm };

export default function Responder() {
  const { codigo = '' } = useParams();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    getPublicForm(codigo)
      .then((form) => active && setLoad({ status: 'ready', form }))
      .catch(() => active && setLoad({ status: 'unavailable' }));
    return () => {
      active = false;
    };
  }, [codigo]);

  if (load.status === 'loading') {
    return (
      <PublicLayout>
        <p className={styles.loading} role="status">
          Carregando formulário…
        </p>
      </PublicLayout>
    );
  }

  if (load.status === 'unavailable') {
    return (
      <PublicLayout>
        <header className={styles.header}>
          <h1 className={styles.title}>Formulário não encontrado</h1>
          <p className={styles.description}>
            Confira se o link está completo. Se o problema continuar, peça um novo link a quem enviou o
            formulário.
          </p>
        </header>
      </PublicLayout>
    );
  }

  // key: ao trocar de formulário, o rascunho começa do zero.
  return <ResponseForm key={load.form.slug} form={load.form} />;
}

function ResponseForm({ form }: { form: PublicForm }) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ResponseDraft>(() => emptyDraft(form));
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  useEffect(() => {
    document.title = `${form.title} · Cati Forms`;
    return () => {
      document.title = 'Cati Forms';
    };
  }, [form.title]);

  // Nada de erro enquanto a pessoa ainda não tentou enviar; depois, os erros
  // acompanham cada alteração e somem assim que o campo é corrigido.
  const errors: ResponseErrors = submitted ? validateResponse(form, draft) : {};
  const errorCount = Object.keys(errors).length;

  const setAnswer = (q: Question, patch: Partial<AnswerDraft>) =>
    setDraft((d) => ({ ...d, answers: { ...d.answers, [q.id]: { ...d.answers[q.id], ...patch } } }));

  const toggleOption = (q: Question, label: string) => {
    const selected = draft.answers[q.id].selected;
    setAnswer(q, {
      selected: selected.includes(label)
        ? selected.filter((l) => l !== label)
        : [...selected, label],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSendError('');

    const found = validateResponse(form, draft);
    const first = Object.keys(found)[0];
    if (first) {
      const id = focusTarget(form, first);
      const el = id ? document.getElementById(id) : null;
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }

    setSending(true);
    try {
      await submitResponse(form.slug, toResponseInput(form, draft));
      navigate(`/f/${form.slug}/enviado`, { replace: true, state: { title: form.title } });
    } catch (err) {
      // A validação local cobre as regras da API; um 400/404 aqui quer dizer que o
      // formulário mudou ou saiu do ar depois que a página foi aberta.
      const rejected = err instanceof ApiError && (err.status === 400 || err.status === 404);
      setSendError(
        rejected
          ? 'O formulário não aceitou estas respostas. Recarregue a página e confira as perguntas antes de enviar de novo.'
          : 'Não foi possível enviar suas respostas agora. Verifique sua conexão e tente novamente.',
      );
      setSending(false);
    }
  };

  const handleReset = () => {
    if (hasContent(draft) && !window.confirm('Limpar todas as respostas?')) return;
    setDraft(emptyDraft(form));
    setSubmitted(false);
    setSendError('');
  };

  const errorFor = (key: string) =>
    errors[key] ? <FieldError id={ids.error(key)}>{errors[key]}</FieldError> : null;

  const describe = (key: string) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': ids.error(key) } : {};

  return (
    <PublicLayout>
      <header className={styles.header}>
        <h1 className={styles.title}>{form.title}</h1>
        {form.description && <p className={styles.description}>{form.description}</p>}
        <p className={styles.requiredNote}>
          Todas as perguntas são obrigatórias <RequiredMark />
        </p>
      </header>

      {errorCount > 0 && (
        <Alert>
          <strong>
            {errorCount === 1 ? '1 campo precisa ser preenchido' : `${errorCount} campos precisam ser preenchidos`}
          </strong>{' '}
          antes de enviar. {errorCount === 1 ? 'Ele está destacado' : 'Eles estão destacados'} abaixo.
        </Alert>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {form.collectEmail && (
          <QuestionCard invalid={!!errors[errorKey.email]}>
            <QuestionLabel htmlFor={ids.email}>E-mail de contato</QuestionLabel>
            <input
              id={ids.email}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="voce@exemplo.com"
              className={styles.input}
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              {...describe(errorKey.email)}
            />
            {errorFor(errorKey.email)}
          </QuestionCard>
        )}

        {form.questions.map((q, i) => {
          const a = draft.answers[q.id];
          const key = errorKey.answer(q);
          const title = `${i + 1}. ${q.title}`;

          if (q.type === 'TEXT') {
            return (
              <QuestionCard key={q.id} invalid={!!errors[key]}>
                <QuestionLabel htmlFor={ids.text(q)}>{title}</QuestionLabel>
                <textarea
                  id={ids.text(q)}
                  rows={5}
                  placeholder="Sua resposta"
                  className={`${styles.input} ${styles.textarea}`}
                  value={a.text}
                  onChange={(e) => setAnswer(q, { text: e.target.value })}
                  {...describe(key)}
                />
                {errorFor(key)}
              </QuestionCard>
            );
          }

          const multiple = q.type === 'MULTIPLE_CHOICE';
          const jKey = errorKey.justification(q);
          const invalid = !!errors[key] || (!multiple && !!errors[jKey]);

          return (
            <QuestionCard key={q.id} as="fieldset" invalid={invalid}>
              <QuestionLabel as="legend">{title}</QuestionLabel>
              <QuestionHint>
                {multiple ? 'Marque todas que se aplicam.' : 'Escolha uma opção e justifique.'}
              </QuestionHint>
              <div
                className={styles.options}
                role={multiple ? 'group' : 'radiogroup'}
                aria-label={q.title}
                {...describe(key)}
              >
                {q.options.map((o, oi) => (
                  <ChoiceOption
                    key={o.label}
                    id={ids.option(q, oi)}
                    type={multiple ? 'checkbox' : 'radio'}
                    name={`q-${q.id}`}
                    label={o.label}
                    checked={a.selected.includes(o.label)}
                    onChange={() =>
                      multiple ? toggleOption(q, o.label) : setAnswer(q, { selected: [o.label] })
                    }
                  />
                ))}
              </div>
              {errorFor(key)}

              {!multiple && (
                <>
                  <label htmlFor={ids.justification(q)} className={styles.justificationLabel}>
                    Justificativa <RequiredMark />
                  </label>
                  <textarea
                    id={ids.justification(q)}
                    rows={3}
                    placeholder="Explique sua escolha"
                    className={`${styles.input} ${styles.textarea}`}
                    value={a.justification}
                    onChange={(e) => setAnswer(q, { justification: e.target.value })}
                    {...describe(jKey)}
                  />
                  {errorFor(jKey)}
                </>
              )}
            </QuestionCard>
          );
        })}

        {sendError && <Alert>{sendError}</Alert>}

        <div className={styles.actions}>
          <button type="button" className={styles.reset} onClick={handleReset} disabled={sending}>
            Limpar respostas
          </button>
          <Button type="submit" className={styles.submit} loading={sending}>
            {sending ? 'Enviando…' : 'Enviar respostas'}
          </Button>
        </div>
      </form>
    </PublicLayout>
  );
}
