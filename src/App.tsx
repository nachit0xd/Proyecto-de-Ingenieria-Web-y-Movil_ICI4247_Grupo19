import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp,
  IonIcon,
  IonLabel, 
  IonRouterOutlet, 
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  home,
  library,
  map,
  calendar,
  grid 
 } from 'ionicons/icons';

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

// TODO: Importar futuros componentes aquí
import Auth from './pages/auth/Auth';
import Inicio from './pages/ciudadano/Inicio';
import Catalogo from './pages/ciudadano/Catalogo';
import Mapa from './pages/ciudadano/Mapa';
import Agenda from './pages/ciudadano/Agenda';  
import Comunidad from './pages/ciudadano/Comunidad';
import Transparencia from './pages/ciudadano/Transparencia';


setupIonicReact();

/* 1. Layout del Ciudadano (Tabs Inferiores) */
const CiudadanoTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      {/* Rutas de las pestañas */}
      <Route exact path="/ciudadano/inicio" component={Inicio} />
      <Route exact path="/ciudadano/catalogo" component={Catalogo} />
      <Route exact path="/ciudadano/mapa" component={Mapa} />
      <Route exact path="/ciudadano/agenda" component={Agenda} />
      
      {/* Esta ruta agrupa Propuestas, Fondos y Transparencia en un solo menú */}
      <Route exact path="/ciudadano/comunidad" component={Comunidad} />
      <Route exact path="/ciudadano/transparencia" component={Transparencia} />
      
      <Route exact path="/ciudadano">
        <Redirect to="/ciudadano/inicio" />
      </Route>
    </IonRouterOutlet>

    {/* Barra de navegación inferior (visible en móvil, pero se puede ocultar en desktop) */}
    <IonTabBar slot="bottom">
      <IonTabButton tab="inicio" href="/ciudadano/inicio">
        <IonIcon icon={home} />
        <IonLabel>Inicio</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="catalogo" href="/ciudadano/catalogo">
        <IonIcon icon={library} />
        <IonLabel>Catálogo</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="mapa" href="/ciudadano/mapa">
        <IonIcon icon={map} />
        <IonLabel>Mapa</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="agenda" href="/ciudadano/agenda">
        <IonIcon icon={calendar} />
        <IonLabel>Agenda</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="comunidad" href="/ciudadano/comunidad">
        <IonIcon icon={grid} />
        <IonLabel>Comunidad</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

/* 2. Enrutador Principal (App) */
const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        
        {/* Flujo de Autenticación (Sin Tabs, Sin Sidebar) */}
        <Route exact path="/auth/login">
          <Auth />
        </Route>
        
        {/* Flujo del Gestor Municipal (Layout con Sidebar) */}
        {/* Aquí luego inyectaremos un componente que contenga el <IonSplitPane> */}
        <Route path="/gestion" render={() => <div>Layout Gestor Municipal</div>} />

        {/* Flujo Público / Ciudadano (Renderiza el componente de Tabs) */}
        <Route path="/ciudadano" component={CiudadanoTabs} />

        {/* Redirección por defecto al entrar a la raíz de la app */}
        <Route exact path="/">
          <Redirect to="/ciudadano/inicio" />
        </Route>

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
