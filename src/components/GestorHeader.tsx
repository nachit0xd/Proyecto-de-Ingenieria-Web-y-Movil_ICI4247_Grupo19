import React, { useState, useEffect } from 'react';
import { IonIcon } from '@ionic/react';
import { personCircleOutline, menuOutline, closeOutline, moonOutline, sunnyOutline, logOutOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';

// GestorHeader es la barra de herramientas del Gestor Municipal adaptada con un toggle de Modo Oscuro y un disparador móvil para alternar la visibilidad de la barra lateral (sidebar)
const GestorHeader: React.FC = () => {
  const { logout } = useAuth();
  const history = useHistory();

  // Estados de control de Modo Oscuro y sidebar
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sincronizar el tema con cambios externos en la clase del body
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-theme'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme', 'dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector('.gestor-sidebar');
    if (sidebar) {
      if (sidebarOpen) {
        sidebar.classList.remove('open');
        setSidebarOpen(false);
      } else {
        sidebar.classList.add('open');
        setSidebarOpen(true);
      }
    }
  };

  return (
    <header className="gestor-header">
      <div className="gestor-header-left">
        <button className="gestor-menu-toggle mobile-only" onClick={toggleSidebar} aria-label="Menu sidebar">
          <IonIcon icon={sidebarOpen ? closeOutline : menuOutline} />
        </button>
        <div className="gestor-brand">
          <h1>Cultura Municipal</h1>
          <span className="gestor-role-badge">Gestor Municipal</span>
        </div>
      </div>

      <div className="gestor-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
          <IonIcon icon={isDark ? sunnyOutline : moonOutline} />
        </button>
        <div className="vertical-divider" style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
        <IonIcon icon={personCircleOutline} className="avatar-icon" style={{ fontSize: '2rem', color: 'white', cursor: 'pointer' }} title="Perfil" onClick={() => history.push('/gestor/perfil')} />
        <button className="theme-toggle-btn" onClick={() => { logout(); history.push('/auth/login'); }} title="Cerrar sesión">
          <IonIcon icon={logOutOutline} />
        </button>
      </div>
    </header>
  );
};

export default GestorHeader;
