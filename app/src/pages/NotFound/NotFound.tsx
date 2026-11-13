import { Link } from 'react-router-dom';
import { buttonClass } from '../../components/buttonClass';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.text}>O endereço pode estar errado ou a página não existe mais.</p>
      <Link to="/" className={buttonClass()}>
        Ir para o início
      </Link>
    </main>
  );
}
