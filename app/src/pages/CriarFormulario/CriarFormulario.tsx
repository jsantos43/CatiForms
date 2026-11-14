import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createForm, deleteForm, publishForm } from '../../api/forms';
import { createQuestion } from '../../api/questions';
import { Alert } from '../../components/Alert';
import { BackLink } from '../../components/BackLink';
import { Button } from '../../components/Button';
import { buttonClass } from '../../components/buttonClass';
import { FieldError, TextAreaField, TextField } from '../../components/Field';
import { PlusIcon } from '../../components/icons';
import { Switch } from '../../components/Switch';
import { plural } from '../../lib/format';
import {
  fieldId,
  newQuestion,
  toQuestionPayload,
  validateDraft,
  type DraftQuestion,
} from './draft';
import { QuestionEditor } from './QuestionEditor';
import styles from './CriarFormulario.module.css';

// Textos lidos pelo leitor de tela ao mover uma pergunta pelo teclado ou mouse.
const DRAG_INSTRUCTIONS = {
  draggable:
    'Para mover a pergunta, pressione espaço ou Enter. Use as setas para cima e para baixo para mudar a posição e espaço ou Enter de novo para soltar. Esc cancela.',
};

const position = (questions: DraftQuestion[], key: unknown) =>
  questions.findIndex((q) => q.key === key) + 1;

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

  // Como no Google Forms: a nova pergunta entra logo abaixo da selecionada (ou no fim).
  const addQuestion = () => {
    const q = newQuestion('TEXT');
    setQuestions((qs) => {
      const at = qs.findIndex((item) => item.key === activeKey);
      if (at === -1) return [...qs, q];
      return [...qs.slice(0, at + 1), q, ...qs.slice(at + 1)];
    });
    setActiveKey(q.key);
    focusAfterRender(fieldId.question(q));
  };

  const sensors = useSensors(
    // Só começa a arrastar depois de 4px, para um clique na alça não virar arraste.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => setActiveKey(String(active.id));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setQuestions((qs) => {
      const from = qs.findIndex((q) => q.key === active.id);
      const to = qs.findIndex((q) => q.key === over.id);
      return arrayMove(qs, from, to);
    });
  };

  const announcements: Announcements = {
    onDragStart: ({ active }) => `Pergunta ${position(questions, active.id)} selecionada para mover.`,
    onDragOver: ({ over }) =>
      over ? `Posição ${position(questions, over.id)} de ${questions.length}.` : 'Fora da lista.',
    onDragEnd: ({ over }) =>
      over ? `Pergunta movida para a posição ${position(questions, over.id)}.` : 'Movimento cancelado.',
    onDragCancel: () => 'Movimento cancelado. A pergunta voltou para o lugar.',
  };

  const addError = errors[fieldId.addQuestion];
  const toolbar = (
    <div className={styles.toolbar}>
      <button
        type="button"
        id={fieldId.addQuestion}
        className={styles.toolbarButton}
        aria-label="Adicionar pergunta"
        title="Adicionar pergunta"
        onClick={addQuestion}
        aria-describedby={addError ? `${fieldId.addQuestion}-error` : undefined}
      >
        <PlusIcon size={22} />
      </button>
    </div>
  );
  const active = questions.some((q) => q.key === activeKey) ? activeKey : null;

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

    if (
      !window.confirm(
        'Publicar este formulário?\n\nTodas as perguntas serão obrigatórias. Depois de publicado, o formulário não pode ser editado nem excluído, então revise antes de publicar.',
      )
    ) {
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

      <section
        className={`${styles.formCard} ${active === null ? styles.formCardActive : ''}`}
        aria-label="Dados do formulário"
        onFocus={() => setActiveKey(null)}
        onPointerDown={() => setActiveKey(null)}
      >
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
        {active === null && toolbar}
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        accessibility={{ announcements, screenReaderInstructions: DRAG_INSTRUCTIONS }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={questions.map((q) => q.key)} strategy={verticalListSortingStrategy}>
          {questions.map((q, i) => (
            <QuestionEditor
              key={q.key}
              question={q}
              number={i + 1}
              active={active === q.key}
              errors={errors}
              onChange={updateQuestion}
              onRemove={() => removeQuestion(i)}
              onActivate={() => setActiveKey(q.key)}
              requestFocus={focusAfterRender}
              toolbar={active === q.key ? toolbar : undefined}
            />
          ))}
        </SortableContext>
      </DndContext>

      {addError && <FieldError id={`${fieldId.addQuestion}-error`}>{addError}</FieldError>}

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
