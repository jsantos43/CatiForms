import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import styles from './AppLayout.module.css';

// Área logada: barra superior + conteúdo de 1120px.
export function AppLayout() {
  return (
    <div className={styles.page}>
      <TopBar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
