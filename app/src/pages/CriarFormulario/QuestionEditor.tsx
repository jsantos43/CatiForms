import type { KeyboardEvent } from 'react';
import type { QuestionType } from '../../api/types';
import { FieldError } from '../../components/Field';
import { CloseIcon, PlusIcon, TrashIcon } from '../../components/icons';
import { errorProps } from '../../lib/a11y';
import { isChoice, MIN_OPTIONS, QUESTION_TYPE_LABEL, QUESTION_TYPES } from '../../lib/questionTypes';
import { changeType, fieldId, newOption, type DraftErrors, type DraftQuestion } from './draft';
import styles from './CriarFormulario.module.css';

type QuestionEditorProps = {
  question: DraftQuestion;
  number: number;
  active: boolean;
  errors: DraftErrors;
  onChange: (q: DraftQuestion) => void;
  onRemove: () => void;
  onActivate: () => void;
  // Pede para focar um campo depois do próximo render (ex.: opção recém-criada).
  requestFocus: (id: string) => void;
};

const HINT: Record<QuestionType, string | null> = {
  TEXT: null,
  MULTIPLE_CHOICE: 'O respondente pode marcar quantas opções quiser.',
  SINGLE_CHOICE_JUSTIFIED: 'O respondente marca uma única opção e escreve uma justificativa obrigatória.',
};

export function QuestionEditor({
  question: q,
  number,
  active,
  errors,
  onChange,
  onRemove,
  onActivate,
  requestFocus,
}: QuestionEditorProps) {
  const titleId = fieldId.question(q);
  const typeId = `q-${q.key}-type`;
  const titleError = errors[titleId];
  const canRemoveOption = q.options.length > MIN_OPTIONS;

  const setOption = (key: string, label: string) =>
    onChange({ ...q, options: q.options.map((o) => (o.key === key ? { ...o, label } : o)) });

  const addOption = (afterIndex = q.options.length - 1) => {
    const option = newOption();
    const options = [...q.options];
    options.splice(afterIndex + 1, 0, option);
    onChange({ ...q, options });
    requestFocus(fieldId.option(q, option));
  };

  const removeOption = (index: number) => {
    const options = q.options.filter((_, i) => i !== index);
    onChange({ ...q, options });
    // Mantém o foco na lista: vai para a opção anterior (ou a nova primeira).
    requestFocus(fieldId.option(q, options[Math.max(0, index - 1)]));
  };

  // Enter numa opção cria a próxima, como num editor de lista.
  const handleOptionKey = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption(index);
    }
  };

  return (
    <section
      className={`${styles.question} ${active ? styles.questionActive : ''}`}
      aria-labelledby={`q-${q.key}-heading`}
      onFocus={onActivate}
    >
      <div className={styles.questionHeader}>
        <span id={`q-${q.key}-heading`} className={styles.questionNumber}>
          Pergunta {number}
          {active && <span aria-hidden="true"> · editando</span>}
        </span>
        <div className={styles.questionTools}>
          <label htmlFor={typeId} className="visually-hidden">
            Tipo da pergunta {number}
          </label>
          <select
            id={typeId}
            className={styles.typeSelect}
            value={q.type}
            onChange={(e) => onChange(changeType(q, e.target.value as QuestionType))}
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {QUESTION_TYPE_LABEL[type]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Remover pergunta ${number}`}
            onClick={onRemove}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <label htmlFor={titleId} className="visually-hidden">
        Enunciado da pergunta {number}
      </label>
      <input
        id={titleId}
        type="text"
        className={styles.questionTitle}
        placeholder="Escreva a pergunta"
        value={q.title}
        onChange={(e) => onChange({ ...q, title: e.target.value })}
        {...errorProps(titleId, titleError)}
      />
      {titleError && <FieldError id={`${titleId}-error`}>{titleError}</FieldError>}

      {HINT[q.type] && <p className={styles.hint}>{HINT[q.type]}</p>}

      {q.type === 'TEXT' && (
        <div aria-hidden="true" className={`${styles.preview} ${styles.previewText}`}>
          Resposta em texto livre do respondente
        </div>
      )}

      {isChoice(q.type) && (
        <div className={styles.options} role="group" aria-label={`Opções da pergunta ${number}`}>
          {q.options.map((o, i) => {
            const id = fieldId.option(q, o);
            const error = errors[id];
            return (
              <div key={o.key} className={styles.optionBlock}>
                <div className={styles.optionRow}>
                  <span
                    aria-hidden="true"
                    className={q.type === 'MULTIPLE_CHOICE' ? styles.markCheckbox : styles.markRadio}
                  />
                  <input
                    id={id}
                    type="text"
                    className={styles.optionInput}
                    placeholder={`Opção ${i + 1}`}
                    aria-label={`Opção ${i + 1} da pergunta ${number}`}
                    value={o.label}
                    onChange={(e) => setOption(o.key, e.target.value)}
                    onKeyDown={handleOptionKey(i)}
                    {...errorProps(id, error)}
                  />
                  <button
                    type="button"
                    className={styles.optionRemove}
                    aria-label={`Remover opção ${i + 1}`}
                    title={canRemoveOption ? undefined : `Mínimo de ${MIN_OPTIONS} opções`}
                    disabled={!canRemoveOption}
                    onClick={() => removeOption(i)}
                  >
                    <CloseIcon />
                  </button>
                </div>
                {error && (
                  <span className={styles.optionError}>
                    <FieldError id={`${id}-error`}>{error}</FieldError>
                  </span>
                )}
              </div>
            );
          })}
          <button type="button" className={styles.addOption} onClick={() => addOption()}>
            <PlusIcon size={16} />
            Adicionar opção
          </button>
        </div>
      )}

      {q.type === 'SINGLE_CHOICE_JUSTIFIED' && (
        <div aria-hidden="true" className={styles.preview}>
          Campo de justificativa (obrigatório para o respondente)
        </div>
      )}
    </section>
  );
}
