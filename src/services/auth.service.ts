// Este servicio de autenticación es una implementación simple para manejar el estado de autenticación del usuario en la aplicación.
// Proporciona funciones para iniciar sesión, cerrar sesión, verificar si el usuario está autenticado y obtener el rol del usuario.

export type UserRole = 'ciudadano' | 'gestor';

const TOKEN_KEY = 'token';
const ROLE_KEY = 'userRole';

export const login = (email: string, password: string, role: UserRole = 'ciudadano'): boolean => {
  if (email && password) {
    localStorage.setItem(TOKEN_KEY, 'mock-token');
    localStorage.setItem(ROLE_KEY, role);
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const getUserRole = (): UserRole | null => {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'ciudadano' || role === 'gestor') {
    return role;
  }
  return null;
};
