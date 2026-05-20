import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../services/auth.service';

interface Props {
  component: React.FC;
  path: string;
  exact?: boolean;
  allowedRoles?: UserRole[];
}

// El componente ProtectedRoute se encarga de proteger las rutas que requieren autenticación 
// Verifica si el usuario tiene un token válido en localStorage y, si no, redirige al login (PENDIENTE DE IMPLEMENTAR)

const ProtectedRoute: React.FC<Props> = ({ component: Component, path, exact, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Route
      path={path}
      exact={exact}
      render={({ location }) => {
        if (!isAuthenticated) {
            return <Redirect to={{ pathname: '/auth/login', state: { from: location.pathname } }} />;
          }
        
          const roleIsAllowed = !allowedRoles || (role !== null && allowedRoles.includes(role));
          if (!roleIsAllowed) {
            return <Redirect to="/ciudadano/inicio" />;
          }
        
          return <Component />;
      }}
    />
  );
};

export default ProtectedRoute;
