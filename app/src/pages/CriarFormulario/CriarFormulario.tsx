import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createForm, deleteForm, publishForm } from '../../api/forms';
import { createQuestion } from '../../api/questions';
import type { QuestionType } from '../../api/types';
import { Alert } from '../../components/Alert';
import { BackLink } from '../../components/BackLink';
import { Button } from '../../components/Button';
import { buttonClass } from '../../components/buttonClass';
import { FieldError, TextAreaField, TextField } from '../../components/Field';
import { InfoIcon, MultipleTypeIcon, SingleTypeIcon, TextTypeIcon } from '../../components/icons';
import { Switch } from '../../components/Switch';
import { plural } from '../../lib/format';
import { QUESTION_TYPE_LABEL } from '../../lib/questionTypes';
import {
  fieldId,
  newQuestion,
  toQuestionPayload,
  validateDraft,
  type DraftQuestion,
} from './draft';
import { QuestionEditor } from './QuestionEditor';
import styles from './CriarFormulario.module.css';

const ADD_BUTTONS: { type: QuestionType; Icon: typeof TextTypeIcon }[] = [
  { type: 'TEXT', Icon: TextTypeIcon },
  { type: 'MULTIPLE_CHOICE', Icon: MultipleTypeIcon },
  { type: 'SINGLE_CHOICE_JUSTIFIED', Icon: SingleTypeIcon },
];

const focusField = (id: string) => {
  const el = document.getElementById(id);
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
};

export default function CriarFormulario() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectEmail, setCollectEmail] = useState(false);
  const [questions, setQuestions] = useState<DraftQuestion[]>(() => [newQuestion('TEXT')]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  // Campo a focar depois do próximo render (pergunta/opção recém-criada ainda não está no DOM).
  const pendingFocus = useRef<string | null>(null);
  const focusAfterRender = (id: string) => {
    pendingFocus.current = id;
  };

  // Os erros só aparecem depois da primeira tentativa de publicar e então acompanham a edição.
  const errors = submitted ? validateDraft(title, questions) : {};
  const errorCount = Object.keys(errors).length;

  const dirty =
    title.trim() !== '' ||
    description.trim() !== '' ||
    questions.length !== 1 ||
    questions.some((q) => q.title.trim() || q.options.some((o) => o.label.trim()));

  useEffect(() => {
    if (!pendingFocus.current) return;
    focusField(pendingFocus.current);
    pendingFocus.current = null;
  });

  // Aviso do navegador ao fechar/recarregar a aba com um rascunho não publicado.
  useEffect(() => {
    if (!dirty || publishing) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, publishing]);

  const updateQuestion = (q: DraftQuestion) =>
    setQuestions((qs) => qs.map((item) => (item.key === q.key ? q : item)));

  const removeQuestion = (index: number) => {
    const next = questions.filter((_, i) => i !== index);
    setQuestions(next);
    const neighbor = next[Math.min(index, next.length - 1)];
    focusAfterRender(neighbor ? fieldId.question(neighbor) : fieldId.addQuestion);
  };

  const addQuestion = (type: QuestionType) => {
    const q = newQuestion(type);
    setQuestions((qs) => [...qs, q]);
    setActiveKey(q.key);
    focusAfterRender(fieldId.question(q));
  };

  const handleCancel = () => {
    if (dirty && !window.confirm('Descartar este formulário? O que você escreveu será perdido.')) return;
    navigate('/formularios');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setPublishError('');

    const found = validateDraft(title, questions);
    const first = Object.keys(found)[0];
    if (first) {
      focusField(first);
      return;
    }

    setPublishing(true);
    let formId: string | null = null;

    try {
      const form = await createForm({
        title: title.trim(),
        description: description.trim() || null,
        collectEmail,
      });
      formId = form.id;

      // Em ordem, para a posição de cada pergunta bater com a da tela.
      for (const [position, q] of questions.entries()) {
        await createQuestion(form.id, toQuestionPayload(q, position));
      }

      // Só depois de todas as perguntas criadas: publicado, o formulário fica travado (RN07).
      const published = await publishForm(form.id);

      navigate(`/formularios/${form.id}/publicado`, {
        replace: true,
        state: { title: published.title, slug: published.slug },
      });
    } catch {
      // Formulários não podem ser editados depois de publicados (RN07): desfaz o que foi criado
      // para não deixar um formulário pela metade.
      if (formId) await deleteForm(formId).catch(() => undefined);
      setPublishError('Não foi possível publicar o formulário. Nada foi salvo; tente novamente.');
      setPublishing(false);
    }
  };

  return (
    <form className={styles.page} onSubmit={handleSubmit} noValidate>
      <BackLink to="/formularios">Voltar para formulários</BackLink>
      <h1 className={styles.title}>Novo formulário</h1>

      <div role="note" className={styles.note}>
        <InfoIcon className={styles.noteIcon} />
        <span>
          Todas as perguntas serão obrigatórias. Depois de publicado, o formulário{' '}
          <strong>não pode ser editado nem excluído</strong>, então revise antes de publicar.
        </span>
      </div>

      <section className={styles.formCard} aria-label="Dados do formulário">
        <TextField
          id={fieldId.title}
          label="Título do formulário"
          className={styles.formTitleInput}
          placeholder="Ex.: Banco de Talentos 2026 — Etapa 1"
          value={title}
          error={errors[fieldId.title]}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextAreaField
          id="f-desc"
          label="Descrição"
          hint="Opcional. Aparece abaixo do título para quem for responder."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Switch
          id="f-email"
          label="Solicitar e-mail de contato"
          description="O respondente precisará informar um e-mail antes de enviar."
          checked={collectEmail}
          onChange={setCollectEmail}
        />
      </section>

      {questions.map((q, i) => (
        <QuestionEditor
          key={q.key}
          question={q}
          number={i + 1}
          active={activeKey === q.key}
          errors={errors}
          onChange={updateQuestion}
          onRemove={() => removeQuestion(i)}
          onActivate={() => setActiveKey(q.key)}
          requestFocus={focusAfterRender}
        />
      ))}

      <section className={styles.addCard} aria-labelledby="add-question-label">
        <span id="add-question-label" className={styles.addTitle}>
          Adicionar pergunta
        </span>
        <div className={styles.addButtons}>
          {ADD_BUTTONS.map(({ type, Icon }) => (
            <button
              key={type}
              id={`add-question-${type}`}
              type="button"
              className={styles.addButton}
              onClick={() => addQuestion(type)}
              aria-describedby={type === 'TEXT' && errors[fieldId.addQuestion] ? `${fieldId.addQuestion}-error` : undefined}
            >
              <Icon />
              {QUESTION_TYPE_LABEL[type]}
            </button>
          ))}
        </div>
        {errors[fieldId.addQuestion] && (
          <FieldError id={`${fieldId.addQuestion}-error`}>{errors[fieldId.addQuestion]}</FieldError>
        )}
      </section>

      {errorCount > 0 && (
        <Alert>
          <strong>{plural(errorCount, 'campo precisa', 'campos precisam')} de atenção</strong> antes de
          publicar. Eles estão destacados acima.
        </Alert>
      )}
      {publishError && <Alert>{publishError}</Alert>}

      <div className={styles.actions}>
        <Link
          to="/formularios"
          className={buttonClass({ variant: 'secondary', size: 'lg' })}
          onClick={(e) => {
            e.preventDefault();
            handleCancel();
          }}
        >
          Cancelar
        </Link>
        <Button type="submit" size="lg" loading={publishing}>
          {publishing ? 'Publicando…' : 'Publicar formulário'}
        </Button>
      </div>
    </form>
  );
}
