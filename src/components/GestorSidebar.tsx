import React from 'react';
import { IonIcon } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { statsChartOutline, bookOutline, calendarOutline, bulbOutline, folderOutline, barChartOutline } from 'ionicons/icons';

// El GestorSidebar es la barra lateral de navegación que se muestra en las páginas del gestor municipal
// Permite acceder rápidamente a las diferentes secciones de gestión como el dashboard, catálogo, agenda y mapa, propuestas, fondos y transparencia

const GestorSidebar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="gestor-sidebar">
      <nav className="sidebar-nav">
        <button type="button" className={`sidebar-item ${isActive('/gestor/dashboard') ? 'active' : ''}`} onClick={() => history.push('/gestor/dashboard')}>
          <IonIcon icon={statsChartOutline} /> Dashboard
        </button>
        <button type="button" className={`sidebar-item ${isActive('/gestor/catalogo') ? 'active' : ''}`} onClick={() => history.push('/gestor/catalogo')}>
          <IonIcon icon={bookOutline} /> Catálogo
        </button>
        <button type="button" className={`sidebar-item ${isActive('/gestor/agenda-mapa') ? 'active' : ''}`} onClick={() => history.push('/gestor/agenda-mapa')}>
          <IonIcon icon={calendarOutline} /> Agenda y Mapa
        </button>
        <button type="button" className="sidebar-item">
          <IonIcon icon={bulbOutline} /> Propuestas
        </button>
        <button type="button" className="sidebar-item">
          <IonIcon icon={folderOutline} /> Fondos
        </button>
        <button type="button" className="sidebar-item">
          <IonIcon icon={barChartOutline} /> Transparencia
        </button>
      </nav>
    </aside>
  );
};

export default GestorSidebar;