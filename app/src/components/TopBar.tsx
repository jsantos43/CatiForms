import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Logo } from './Logo';
import styles from './TopBar.module.css';

// Barra azul-marinho comum a todas as telas logadas.
export function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const handleLogout = async () => {
    setLeaving(true);
    await logout();
    navigate('/login', { replace: true });
  };

  const username = user?.username ?? '';

  return (
    <header className={`${styles.bar} no-print`}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <Link to="/formularios" className={styles.brand} aria-label="Cati Forms — início">
            <Logo size="small" />
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            <NavLink to="/formularios" className={styles.navLink}>
              Formulários
            </NavLink>
          </nav>
        </div>
        <div className={styles.right}>
          <span className={styles.user}>
            <span className={styles.avatar} aria-hidden="true">
              {username.charAt(0).toUpperCase()}
            </span>
            @{username}
          </span>
          <button type="button" className={styles.logout} onClick={handleLogout} disabled={leaving}>
            {leaving ? 'Saindo…' : 'Sair'}
          </button>
        </div>
      </div>
    </header>
  );
}
