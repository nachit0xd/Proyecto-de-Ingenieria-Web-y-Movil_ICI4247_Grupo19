import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  IonApp,
  IonRouterOutlet, 
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Tema global */
import './theme/variables.css';

// Imports de componentes y contextos
import Header from './components/Header';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Importaciones estáticas para eliminar Suspense y mejorar transiciones
import Auth from './pages/auth/Auth';
import Register from './pages/auth/Register';
import Inicio from './pages/ciudadano/Inicio';
import Catalogo from './pages/ciudadano/Catalogo';
import Mapa from './pages/ciudadano/Mapa';
import Agenda from './pages/ciudadano/Agenda';  
import Comunidad from './pages/ciudadano/Comunidad';
import Fondos from './pages/ciudadano/Fondos';
import Transparencia from './pages/ciudadano/Transparencia';

import DashboardGestor from './pages/gestor/Dashboard';
import CatalogoGestor from './pages/gestor/Catalogo';
import AgendaMapaGestor from './pages/gestor/AgendaMapa';
import PropuestasGestor from './pages/gestor/Propuestas';
import FondosGestor from './pages/gestor/Fondos';
import TransparenciaGestor from './pages/gestor/Transparencia';

setupIonicReact();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const AppRouter: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname.startsWith('/ciudadano');

  // Detectar tema oscuro al cargar la aplicación
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.body.classList.add('dark-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme', 'dark');
    }
  }, []);

  return (
    <>
      {showHeader && <Header />}

      <IonRouterOutlet animated={false} style={{ marginTop: showHeader ? '64px' : '0' }}>
        {/* Rutas de Autenticación */}
        <Route exact path="/auth/login" component={Auth} />
        <Route exact path="/auth/register" component={Register} />

        {/* Rutas del Gestor: planificadas en 1er nivel para animaciones suaves */}
        <ProtectedRoute exact path="/gestor/dashboard" component={DashboardGestor} allowedRoles={['gestor']} />
        <ProtectedRoute exact path="/gestor/catalogo" component={CatalogoGestor} allowedRoles={['gestor']} />
        <ProtectedRoute exact path="/gestor/agenda-mapa" component={AgendaMapaGestor} allowedRoles={['gestor']} />
        <ProtectedRoute exact path="/gestor/propuestas" component={PropuestasGestor} allowedRoles={['gestor']} />
        <ProtectedRoute exact path="/gestor/fondos" component={FondosGestor} allowedRoles={['gestor']} />
        <ProtectedRoute exact path="/gestor/transparencia" component={TransparenciaGestor} allowedRoles={['gestor']} />
        <Route exact path="/gestor">
          <Redirect to="/gestor/dashboard" />
        </Route>

        {/* Rutas Públicas / Ciudadano */}
        <Route exact path="/ciudadano/inicio" component={Inicio} />
        <Route exact path="/ciudadano/catalogo" component={Catalogo} />
        <Route exact path="/ciudadano/mapa" component={Mapa} />
        <Route exact path="/ciudadano/agenda" component={Agenda} />
        <Route exact path="/ciudadano/fondos" component={Fondos} />
        <Route exact path="/ciudadano/comunidad" component={Comunidad} />
        <Route exact path="/ciudadano/transparencia" component={Transparencia} />
        <Route exact path="/ciudadano">
          <Redirect to="/ciudadano/inicio" />
        </Route>

        {/* Ruta base */}
        <Route exact path="/">
          <Redirect to="/auth/login" />
        </Route>
      </IonRouterOutlet>
    </>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <IonApp>
      <AuthProvider>
        <IonReactRouter>
          <AppRouter />
        </IonReactRouter>
      </AuthProvider>
    </IonApp>
  </QueryClientProvider>
);

export default App;
