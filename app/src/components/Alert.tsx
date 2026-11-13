import type { ReactNode } from 'react';
import { AlertCircleIcon } from './icons';
import styles from './Alert.module.css';

type AlertProps = {
  tone?: 'error' | 'info';
  children: ReactNode;
};

export function Alert({ tone = 'error', children }: AlertProps) {
  return (
    <div role={tone === 'error' ? 'alert' : 'note'} className={`${styles.alert} ${styles[tone]}`}>
      <AlertCircleIcon size={20} strokeWidth={2.2} className={styles.icon} />
      <span>{children}</span>
    </div>
  );
}
