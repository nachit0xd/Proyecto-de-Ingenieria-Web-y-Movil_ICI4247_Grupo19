import React from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { warningOutline, homeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// La página NotFound se muestra cuando el usuario intenta acceder a una ruta que no existe. 
// Proporciona un mensaje claro y un botón para volver a la página de inicio, adaptándose al rol del usuario (Ciudadano o Gestor Municipal).
const NotFound: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();

  const goHome = () => {
    if (user?.rol === 'gestor') {
      history.push('/gestor/dashboard');
    } else {
      history.push('/ciudadano/inicio');
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': 'var(--app-bg)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
          <IonIcon icon={warningOutline} style={{ fontSize: '6rem', color: 'var(--ion-color-warning)', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 10px 0', color: 'var(--app-text-color)' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', color: 'var(--app-text-muted)' }}>Página no encontrada</h2>
          <p style={{ maxWidth: '400px', marginBottom: '30px', color: 'var(--app-text-muted)' }}>
            Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que el enlace esté caído o la página haya sido eliminada.
          </p>
          <IonButton color="primary" onClick={goHome}>
            <IonIcon slot="start" icon={homeOutline} />
            Volver al inicio
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
