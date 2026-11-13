import { FormIcon } from './icons';
import styles from './Logo.module.css';

type LogoProps = {
  // "large": painel do login (40px); "small": barra superior e páginas públicas.
  size?: 'large' | 'small';
};

export function Logo({ size = 'large' }: LogoProps) {
  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <span className={styles.mark}>
        <FormIcon size={size === 'large' ? 22 : 16} />
      </span>
      <span className={styles.name}>Cati Forms</span>
    </span>
  );
}
