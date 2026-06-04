import api from './api';

// Servicio de autenticación para manejar el login, logout y estado de autenticación del usuario

export type UserRole = 'ciudadano' | 'gestor';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'userRole';
const USER_KEY = 'user';

// Función para realizar el login del usuario, guarda el token y rol en localStorage
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(ROLE_KEY, response.data.user.rol);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getUserRole = (): UserRole | null => {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'ciudadano' || role === 'gestor') {
    return role as UserRole;
  }
  return null;
};
