import React, { createContext, useContext, useMemo, useState } from 'react';
import { getUserRole, isAuthenticated, login as loginService, logout as logoutService, UserRole } from '../services/auth.service';

// El AuthContext se encarga de manejar el estado de autenticación y el rol del usuario en toda la aplicación
// Proporciona funciones para iniciar sesión y cerrar sesión, y mantiene el estado de si el usuario está autenticado y cuál es su rol (ciudadano o gestor)

interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());
  const [role, setRole] = useState<UserRole | null>(getUserRole());

  const login = async (email: string, password: string, nextRole: UserRole) => {
    await wait(700);

    const success = loginService(email, password, nextRole);
    if (!success) {
      throw new Error('Credenciales inválidas.');
    }

    setAuthenticated(true);
    setRole(nextRole);
  };

  const logout = () => {
    logoutService();
    setAuthenticated(false);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated,
      role,
      login,
      logout
    }),
    [authenticated, role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
};
