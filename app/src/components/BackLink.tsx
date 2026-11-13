import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from './icons';
import styles from './BackLink.module.css';

export function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className={styles.link}>
      <ArrowLeftIcon />
      {children}
    </Link>
  );
}
