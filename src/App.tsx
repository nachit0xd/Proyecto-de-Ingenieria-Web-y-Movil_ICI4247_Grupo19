import React from 'react';
import { Redirect, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  IonApp,
  IonRouterOutlet, 
  setupIonicReact,
  IonSpinner
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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Tema global */
import './theme/variables.css';

// IMPORTS: Importar futuros componentes aquí
import Header from './components/Header';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Lazy loading de páginas para optimizar rendimiento inicial
const Auth = React.lazy(() => import('./pages/auth/Auth'));
const Register = React.lazy(() => import('./pages/auth/Register'));
const Inicio = React.lazy(() => import('./pages/ciudadano/Inicio'));
const Catalogo = React.lazy(() => import('./pages/ciudadano/Catalogo'));
const Mapa = React.lazy(() => import('./pages/ciudadano/Mapa'));
const Agenda = React.lazy(() => import('./pages/ciudadano/Agenda'));  
const Comunidad = React.lazy(() => import('./pages/ciudadano/Comunidad'));
const Fondos = React.lazy(() => import('./pages/ciudadano/Fondos'));
const Transparencia = React.lazy(() => import('./pages/ciudadano/Transparencia'));
const DashboardGestor = React.lazy(() => import('./pages/gestor/Dashboard'));
const CatalogoGestor = React.lazy(() => import('./pages/gestor/Catalogo'));
const AgendaMapaGestor = React.lazy(() => import('./pages/gestor/AgendaMapa'));
const PropuestasGestor = React.lazy(() => import('./pages/gestor/Propuestas'));
const FondosGestor = React.lazy(() => import('./pages/gestor/Fondos'));
const TransparenciaGestor = React.lazy(() => import('./pages/gestor/Transparencia'));


setupIonicReact();

// Configuración del QueryClient para React Query, con opciones por defecto que se aplicarán a todas las consultas. 
// Esto incluye deshabilitar el refetch automático al enfocar la ventana y establecer un tiempo de vida de los datos en caché de 5 minutos.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

/* 1. Layout del Ciudadano (Navegación por Header) */
const CiudadanoLayout: React.FC = () => (
  <IonRouterOutlet>
    {/* Rutas de las páginas ciudadano */}
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
  </IonRouterOutlet>
);

// El layout del gestor municipal incluye un sidebar lateral para acceder a las diferentes secciones de gestión, y un header específico para el gestor con su rol destacado y opciones de navegación propias. Las rutas dentro del layout del gestor están protegidas por el componente ProtectedRoute, que verifica que el usuario tenga el rol adecuado antes de permitir el acceso a esas páginas.
const GestorLayout: React.FC = () => (
  <IonRouterOutlet>
    <Route exact path="/gestor/dashboard" component={DashboardGestor} />
    <Route exact path="/gestor/catalogo" component={CatalogoGestor} />
    <Route exact path="/gestor/agenda-mapa" component={AgendaMapaGestor} />
    <Route exact path="/gestor/propuestas" component={PropuestasGestor} />
    <Route exact path="/gestor/fondos" component={FondosGestor} />
    <Route exact path="/gestor/transparencia" component={TransparenciaGestor} />

    <Route exact path="/gestor">
      <Redirect to="/gestor/dashboard" />
    </Route>
  </IonRouterOutlet>
);

const AppRouter: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname.startsWith('/ciudadano');

  return (
    <>
      {showHeader && <Header />}

      <React.Suspense fallback={<div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}><IonSpinner name="crescent" /></div>}>
        <IonRouterOutlet style={{ marginTop: showHeader ? '64px' : '0' }}>
          {/* Flujo de Autenticación (Sin Tabs, Sin Sidebar) */}
          <Route exact path="/auth/login">
            <Auth />
          </Route>
          <Route exact path="/auth/register">
            <Register />
          </Route>

          {/* Flujo del Gestor Municipal (Layout con Sidebar) */}
          <ProtectedRoute path="/gestor" component={GestorLayout} allowedRoles={['gestor']} />

          {/* Flujo Público / Ciudadano (Renderiza las rutas de ciudadano sin tabs) */}
          <Route path="/ciudadano" component={CiudadanoLayout} />

          {/* Redirección por defecto al entrar a la raíz de la app */}
          <Route exact path="/">
            <Redirect to="/auth/login" />
          </Route>
        </IonRouterOutlet>
      </React.Suspense>
    </>
  );
};

/* 2. Enrutador Principal (App), con configuración de QueryClient */
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
