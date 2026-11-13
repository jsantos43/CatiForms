import type { ReactNode } from 'react';
import { Logo } from '../components/Logo';
import styles from './AuthLayout.module.css';

type AuthLayoutProps = {
  title: string;
  // "lg" (44px) no login; "md" (40px) no cadastro, que tem uma lista abaixo.
  titleSize?: 'lg' | 'md';
  // Conteúdo abaixo do título no painel azul-marinho.
  aside: ReactNode;
  children: ReactNode;
};

// Tela dividida do login/cadastro: painel navy à esquerda, formulário à direita.
export function AuthLayout({ title, titleSize = 'lg', aside, children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <section className={styles.panel}>
        <Logo />
        <div className={styles.asideContent}>
          <h1 className={`${styles.title} ${styles[titleSize]}`}>{title}</h1>
          {aside}
        </div>
        <p className={styles.footer}>Banco de Talentos 2026 · CATI Jr.</p>
      </section>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
