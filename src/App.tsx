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
import { home, library, map, calendar, grid } from 'ionicons/icons';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

import Auth from './pages/auth/Auth';
import Inicio from './pages/ciudadano/Inicio';
import Catalogo from './pages/ciudadano/Catalogo';
import Mapa from './pages/ciudadano/Mapa';
import Agenda from './pages/ciudadano/Agenda';
import Comunidad from './pages/ciudadano/Comunidad';
import Transparencia from './pages/ciudadano/Transparencia';
import ProtectedRoute from './routes/ProtectedRoute';

setupIonicReact();

const CiudadanoTabs: React.FC = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/ciudadano/inicio" component={Inicio} />
      <Route exact path="/ciudadano/catalogo" component={Catalogo} />
      <Route exact path="/ciudadano/mapa" component={Mapa} />
      <Route exact path="/ciudadano/agenda" component={Agenda} />
      <Route path="/ciudadano/comunidad" component={Comunidad} />
      <Route path="/ciudadano/transparencia" component={Transparencia} />
      <Route exact path="/ciudadano">
        <Redirect to="/ciudadano/inicio" />
      </Route>
    </IonRouterOutlet>

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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth/login">
          <Auth />
        </Route>
        <Route path="/gestion" render={() => <div>Layout Gestor Municipal</div>} />
        <ProtectedRoute path="/ciudadano" component={CiudadanoTabs} />
        <Route exact path="/">
          <Redirect to="/auth/login" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
