import type { ReactNode } from 'react';
import styles from './QuestionCard.module.css';

type QuestionCardProps = {
  // "fieldset" para perguntas de escolha (o enunciado vira <legend>); "section" para as demais.
  as?: 'section' | 'fieldset';
  invalid?: boolean;
  children: ReactNode;
};

// Cartão de pergunta da página de resposta. Com erro: borda vermelha de 2px e fundo rosado.
export function QuestionCard({ as = 'section', invalid = false, children }: QuestionCardProps) {
  const Tag = as;
  return (
    <Tag className={`${styles.card} ${as === 'fieldset' ? styles.fieldset : ''} ${invalid ? styles.invalid : ''}`}>
      {children}
    </Tag>
  );
}

type QuestionLabelProps = {
  htmlFor?: string;
  // Dentro de um fieldset o enunciado é a <legend>.
  as?: 'label' | 'legend';
  children: ReactNode;
};

export function QuestionLabel({ htmlFor, as = 'label', children }: QuestionLabelProps) {
  const content = (
    <>
      {children} <span className={styles.required}>*</span>
    </>
  );

  return as === 'legend' ? (
    <legend className={styles.label}>{content}</legend>
  ) : (
    <label htmlFor={htmlFor} className={styles.label}>
      {content}
    </label>
  );
}

export function QuestionHint({ children }: { children: ReactNode }) {
  return <span className={styles.hint}>{children}</span>;
}

export function RequiredMark() {
  return <span className={styles.required}>*</span>;
}
