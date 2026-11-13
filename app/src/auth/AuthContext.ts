import { createContext, useContext } from 'react';
import type { LoginData } from '../api/auth';
import type { User } from '../api/types';

export type AuthState = {
  // undefined = verificando sessão; null = sem sessão.
  user: User | null | undefined;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthState | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
};
