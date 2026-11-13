import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Rotas logadas: sem sessão vai para /login, guardando de onde veio.
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (user === undefined) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
}

// Login e cadastro: quem já está logado vai direto para a lista.
export function GuestOnly() {
  const { user } = useAuth();

  if (user === undefined) return null;
  if (user) return <Navigate to="/formularios" replace />;

  return <Outlet />;
}
