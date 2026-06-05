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

import { IonSpinner } from '@ionic/react';

// Función helper para envolver los componentes lazy con Suspense y mantener limpio el router
const withSuspense = (Component: React.LazyExoticComponent<any>) => (props: any) => (
  <React.Suspense fallback={<div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}><IonSpinner name="crescent" /></div>}>
    <Component {...props} />
  </React.Suspense>
);

// Importaciones dinámicas (Code Splitting) para mejorar el rendimiento inicial de la aplicación
// --- Rutas del Ciudadano (con carga diferida) ---
const Auth = withSuspense(React.lazy(() => import('./pages/auth/Auth')));
const Register = withSuspense(React.lazy(() => import('./pages/auth/Register')));
const Inicio = withSuspense(React.lazy(() => import('./pages/ciudadano/Inicio')));
const Catalogo = withSuspense(React.lazy(() => import('./pages/ciudadano/Catalogo')));
const Mapa = withSuspense(React.lazy(() => import('./pages/ciudadano/Mapa')));
const Agenda = withSuspense(React.lazy(() => import('./pages/ciudadano/Agenda')));  
const Comunidad = withSuspense(React.lazy(() => import('./pages/ciudadano/Comunidad')));
const Fondos = withSuspense(React.lazy(() => import('./pages/ciudadano/Fondos')));
const Transparencia = withSuspense(React.lazy(() => import('./pages/ciudadano/Transparencia')));

// --- Rutas del Gestor (con carga diferida) ---
const DashboardGestor = withSuspense(React.lazy(() => import('./pages/gestor/Dashboard')));
const CatalogoGestor = withSuspense(React.lazy(() => import('./pages/gestor/Catalogo')));
const AgendaMapaGestor = withSuspense(React.lazy(() => import('./pages/gestor/AgendaMapa')));
const PropuestasGestor = withSuspense(React.lazy(() => import('./pages/gestor/Propuestas')));
const FondosGestor = withSuspense(React.lazy(() => import('./pages/gestor/Fondos')));
const TransparenciaGestor = withSuspense(React.lazy(() => import('./pages/gestor/Transparencia')));
const PerfilGestor = withSuspense(React.lazy(() => import('./pages/gestor/Perfil')));
const PerfilCiudadano = withSuspense(React.lazy(() => import('./pages/ciudadano/Perfil')));
const NotFound = withSuspense(React.lazy(() => import('./pages/NotFound')));

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
        <ProtectedRoute exact path="/gestor/perfil" component={PerfilGestor} allowedRoles={['gestor']} />
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
        <Route exact path="/ciudadano/perfil" component={PerfilCiudadano} />
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
