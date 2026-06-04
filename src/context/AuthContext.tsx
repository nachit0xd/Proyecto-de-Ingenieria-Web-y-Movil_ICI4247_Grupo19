import React, { createContext, useContext, useMemo, useState } from 'react';
import { getUserRole, isAuthenticated, login as loginService, logout as logoutService, UserRole } from '../services/auth.service';

// Contexto de autenticación para manejar el estado de autenticación y rol del usuario en toda la aplicación

interface User {
  id: string;
  nombre: string;
  rol: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserRole | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());
  const [role, setRole] = useState<UserRole | null>(getUserRole());
  const [user, setUser] = useState<User | null>(getStoredUser());

// Función de login que llama al backend para validar las credenciales y obtener el rol real del usuario
  const login = async (email: string, password: string) => {
    // LLamamos al backend
    const success = await loginService(email, password);
    if (!success) {
      throw new Error('Credenciales inválidas.');
    }
    
    // Obtenemos el rol validado que nos mandó el backend
    const actualRole = getUserRole();
    
    setAuthenticated(true);
    setRole(actualRole);
    setUser(getStoredUser());
  };

  const logout = () => {
    logoutService();
    setAuthenticated(false);
    setRole(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: authenticated,
      role,
      user,
      login,
      logout
    }),
    [authenticated, role, user]
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
