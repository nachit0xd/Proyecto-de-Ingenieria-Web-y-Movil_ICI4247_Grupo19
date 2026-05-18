import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface Props {
  component: React.FC;
  path: string;
  exact?: boolean;
}

// El componente ProtectedRoute se encarga de proteger las rutas que requieren autenticación 
// Verifica si el usuario tiene un token válido en localStorage y, si no, redirige al login (PENDIENTE DE IMPLEMENTAR)

const ProtectedRoute: React.FC<Props> = ({ component: Component, path, exact }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return (
    <Route
      path={path}
      exact={exact}
      render={() => isAuthenticated ? <Component /> : <Redirect to="/auth/login" />}
    />
  );
};

export default ProtectedRoute;
