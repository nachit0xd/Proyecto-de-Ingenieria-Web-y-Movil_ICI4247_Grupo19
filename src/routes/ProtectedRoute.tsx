import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface Props {
  component: React.FC;
  path: string;
  exact?: boolean;
}

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
