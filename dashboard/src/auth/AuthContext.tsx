import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { authApi } from '../api/endpoints';
import type { User } from '../api/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jp_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('jp_token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const login = useCallback((t: string, u: User) => {
    localStorage.setItem('jp_token', t);
    setToken(t);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('jp_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
