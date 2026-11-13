import type { InputHTMLAttributes } from 'react';
import styles from './ChoiceOption.module.css';

type ChoiceOptionProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  type: 'checkbox' | 'radio';
  label: string;
};

// Opção marcável com alvo de toque grande; destacada em azul quando marcada.
export function ChoiceOption({ type, label, checked, ...props }: ChoiceOptionProps) {
  return (
    <label className={`${styles.option} ${checked ? styles.checked : ''}`}>
      <input type={type} className={styles.input} checked={checked} {...props} />
      <span>{label}</span>
    </label>
  );
}
