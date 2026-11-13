import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as api from '../api/auth';
import type { User } from '../api/types';
import { AuthContext, type AuthState } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    api
      .getCurrentUser()
      .then((u) => active && setUser(u))
      .catch(() => active && setUser(null));

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (data: api.LoginData) => {
    setUser(await api.login(data));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
