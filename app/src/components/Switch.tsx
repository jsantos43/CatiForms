import type { ReactNode } from 'react';
import styles from './Switch.module.css';

type SwitchProps = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

// Interruptor liga/desliga com rótulo e descrição (ex.: "Solicitar e-mail de contato").
export function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <label htmlFor={id} className={styles.row}>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      <span className={styles.control}>
        <input
          id={id}
          type="checkbox"
          role="switch"
          className={styles.input}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span aria-hidden="true" className={styles.track} />
        <span aria-hidden="true" className={styles.thumb} />
      </span>
    </label>
  );
}
