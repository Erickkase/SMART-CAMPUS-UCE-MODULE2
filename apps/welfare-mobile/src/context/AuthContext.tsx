import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getToken, removeToken, setToken } from '../utils/storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken()
      .then((token) => {
        setIsAuthenticated(Boolean(token));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (_email: string, _password: string): Promise<void> => {
    // Authentication service is not enabled yet. Simulate a successful login
    // by storing a placeholder token. The token is still attached to every
    // API request so the app is ready once ACT-009 centralizes auth.
    await setToken('mock-token');
    setIsAuthenticated(true);
  };

  const logout = async (): Promise<void> => {
    await removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
