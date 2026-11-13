import type { ReactNode } from 'react';
import { FormIcon } from '../components/icons';
import styles from './PublicLayout.module.css';

// Páginas públicas (responder/enviado): faixa azul no topo e coluna de 720px.
export function PublicLayout({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.stripe} />
      <main className={styles.main}>
        <div className={styles.brand}>
          <span className={styles.mark}>
            <FormIcon size={15} strokeWidth={2.2} />
          </span>
          Cati Forms
        </div>
        {children}
        {footer}
      </main>
    </div>
  );
}
