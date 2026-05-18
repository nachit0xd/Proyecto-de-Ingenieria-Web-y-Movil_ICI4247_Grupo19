import React from 'react';
import { Redirect, Route } from 'react-router-dom';
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
import Auth from './pages/auth/Auth';
import Inicio from './pages/ciudadano/Inicio';
import Catalogo from './pages/ciudadano/Catalogo';
import Mapa from './pages/ciudadano/Mapa';
import Agenda from './pages/ciudadano/Agenda';  
import Comunidad from './pages/ciudadano/Comunidad';
import Fondos from './pages/ciudadano/Fondos';
import Transparencia from './pages/ciudadano/Transparencia';


setupIonicReact();

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

/* 2. Enrutador Principal (App) */
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Header />
      <IonRouterOutlet style={{ marginTop: '64px' }}>
        
        {/* Flujo de Autenticación (Sin Tabs, Sin Sidebar) */}
        <Route exact path="/auth/login">
          <Auth />
        </Route>
        
        {/* Flujo del Gestor Municipal (Layout con Sidebar) */}
        {/* PENDIENTE */}
        <Route path="/gestion" render={() => <div>Layout Gestor Municipal</div>} />

        {/* Flujo Público / Ciudadano (Renderiza las rutas de ciudadano sin tabs) */}
        <Route path="/ciudadano" component={CiudadanoLayout} />

        {/* Redirección por defecto al entrar a la raíz de la app */}
        <Route exact path="/">
          <Redirect to="/ciudadano/inicio" />
        </Route>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
