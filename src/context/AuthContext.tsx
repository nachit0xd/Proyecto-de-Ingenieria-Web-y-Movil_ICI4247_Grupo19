import React, { createContext, useContext, useMemo, useState } from 'react';
import { getUserRole, isAuthenticated, login as loginService, logout as logoutService, UserRole } from '../services/auth.service';

// Contexto de autenticación para manejar el estado de autenticación y rol del usuario en toda la aplicación

interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string, requestedRole: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(isAuthenticated());
  const [role, setRole] = useState<UserRole | null>(getUserRole());

// Función de login que llama al backend para validar las credenciales y obtener el rol real del usuario
  const login = async (email: string, password: string, requestedRole: UserRole) => {
    // LLamamos al backend
    const success = await loginService(email, password);
    if (!success) {
      throw new Error('Credenciales inválidas.');
    }
    
    // Obtenemos el rol validado que nos mandó el backend
    const actualRole = getUserRole();
    
    setAuthenticated(true);
    setRole(actualRole);
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
