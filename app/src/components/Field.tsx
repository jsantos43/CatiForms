import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { AlertCircleIcon } from './icons';
import styles from './Field.module.css';

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className={styles.error}>
      <AlertCircleIcon />
      {children}
    </span>
  );
}

type FieldBase = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

function FieldShell({ id, label, error, hint, children }: FieldBase & { children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span id={`${id}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

const describedBy = ({ id, error, hint }: FieldBase) =>
  [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined;

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldBase;

// Label + input + mensagem de erro, com aria-invalid/aria-describedby ligados.
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, error, hint, className, ...props },
  ref,
) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        ref={ref}
        id={id}
        className={[styles.input, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ id, label, error, hint })}
        {...props}
      />
    </FieldShell>
  );
});

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldBase;

export function TextAreaField({ id, label, error, hint, className, ...props }: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        className={[styles.input, styles.textarea, className].filter(Boolean).join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy({ id, label, error, hint })}
        {...props}
      />
    </FieldShell>
  );
}
