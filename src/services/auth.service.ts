export const login = (email: string, password: string): boolean => {
  if (email && password) {
    localStorage.setItem('token', 'mock-token');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};
