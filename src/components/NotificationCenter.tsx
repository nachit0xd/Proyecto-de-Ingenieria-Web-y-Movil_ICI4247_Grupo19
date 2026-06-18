import React, { useRef, useState } from 'react';
import { IonIcon, IonPopover, IonList, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/react';
import { notificationsOutline, checkmarkDoneOutline, documentTextOutline, cashOutline, informationCircleOutline } from 'ionicons/icons';
import { useNotificaciones, Notificacion } from '../hooks/useNotificaciones';
import './NotificationCenter.css';

interface Props {
  rol: 'ciudadano' | 'gestor';
}

// El componente NotificationCenter muestra un icono de campana con un badge para indicar el número de notificaciones no leídas. 
// Al hacer clic sobre la campana, se abre un popover con la lista de notificaciones, cada una con su icono, título, mensaje y fecha. 
// Las notificaciones no leídas se pueden marcar como leídas individualmente o todas a la vez.
const NotificationCenter: React.FC<Props> = ({ rol }) => {
  const { notificaciones, noLeidas, marcarComoLeida, marcarTodasComoLeidas } = useNotificaciones(rol);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const iconRef = useRef<HTMLIonIconElement>(null);

  const getIconForType = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'propuesta': return documentTextOutline;
      case 'fondo': return cashOutline;
      case 'sistema': return informationCircleOutline;
      default: return informationCircleOutline;
    }
  };

  const getColorForType = (tipo: Notificacion['tipo']) => {
    switch (tipo) {
      case 'propuesta': return 'var(--ion-color-primary)';
      case 'fondo': return 'var(--ion-color-success)';
      case 'sistema': return 'var(--ion-color-warning)';
      default: return 'var(--app-text-muted)';
    }
  };

  const formatearFecha = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="notification-trigger" onClick={() => setPopoverOpen(true)}>
        <IonIcon ref={iconRef} icon={notificationsOutline} className="notification-icon" />
        {noLeidas > 0 && <IonBadge color="danger" className="notification-badge">{noLeidas}</IonBadge>}
      </div>

      <IonPopover
        isOpen={popoverOpen}
        event={iconRef.current as any}
        onDidDismiss={() => setPopoverOpen(false)}
        className="notification-popover"
        alignment="end"
      >
        <div className="notification-header">
          <h3>Notificaciones</h3>
          {noLeidas > 0 && (
            <button className="mark-all-btn" onClick={marcarTodasComoLeidas}>
              <IonIcon icon={checkmarkDoneOutline} /> Marcar leídas
            </button>
          )}
        </div>
        
        <IonList className="notification-list">
          {notificaciones.length === 0 ? (
            <div className="no-notifications">
              <p>No tienes notificaciones pendientes.</p>
            </div>
          ) : (
            notificaciones.map(notif => (
              <IonItem 
                key={notif.id} 
                className={`notification-item ${notif.leida ? 'read' : 'unread'}`}
                lines="full"
                onClick={() => { if (!notif.leida) marcarComoLeida(notif.id); }}
                button
              >
                <div className="notif-icon-container" slot="start" style={{ color: getColorForType(notif.tipo) }}>
                  <IonIcon icon={getIconForType(notif.tipo)} />
                </div>
                <IonLabel className="ion-text-wrap">
                  <h2>{notif.titulo}</h2>
                  <p>{notif.mensaje}</p>
                  <span className="notif-date">{formatearFecha(notif.fecha)}</span>
                </IonLabel>
                {!notif.leida && <div className="unread-dot" slot="end"></div>}
              </IonItem>
            ))
          )}
        </IonList>
      </IonPopover>
    </>
  );
};

export default NotificationCenter;
