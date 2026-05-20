import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonIcon, IonButton } from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import './Header.css';

// El Header es un componente del ciudadano que se muestra en todas las páginas, con el logo a la izquierda, los links de navegación al centro y el avatar de usuario a la derecha
// Es un componente "estático" que no tiene lógica propia, solo se utiliza para mostrar la barra superior y permitir navegar entre las diferentes secciones de la app

const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useAuth();

  // Helper para verificar qué pestaña resaltar
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <header className="global-header">
      <div className="header-brand" onClick={() => history.push('/ciudadano/inicio')}>
        Cultura Municipal
      </div>
      
      <nav className="header-nav">
        <button className={`nav-link ${isActive('/ciudadano/inicio')}`} onClick={() => history.push('/ciudadano/inicio')}>Inicio</button>
        <button className={`nav-link ${isActive('/ciudadano/catalogo')}`} onClick={() => history.push('/ciudadano/catalogo')}>Catálogo</button>
        <button className={`nav-link ${isActive('/ciudadano/mapa')}`} onClick={() => history.push('/ciudadano/mapa')}>Mapa</button>
        <button className={`nav-link ${isActive('/ciudadano/agenda')}`} onClick={() => history.push('/ciudadano/agenda')}>Agenda</button>
        <button className={`nav-link ${isActive('/ciudadano/comunidad')}`} onClick={() => history.push('/ciudadano/comunidad')}>Comunidad</button>
        
        {/* MODIFICACIÓN: Inclusión de la nueva pestaña de Fondos en la barra superior */}
        <button className={`nav-link ${isActive('/ciudadano/fondos')}`} onClick={() => history.push('/ciudadano/fondos')}>Fondos</button>
        
        <button className={`nav-link ${isActive('/ciudadano/transparencia')}`} onClick={() => history.push('/ciudadano/transparencia')}>Transparencia</button>
      </nav>

      <div className="header-user">
        <IonIcon icon={personCircleOutline} className="user-avatar-icon" />
        <IonButton fill="clear" onClick={() => { logout(); history.push('/auth/login'); }}>Cerrar sesión</IonButton>
      </div>
    </header>
  );
};

export default Header;