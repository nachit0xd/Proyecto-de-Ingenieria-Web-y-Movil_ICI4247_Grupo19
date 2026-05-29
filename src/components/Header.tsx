import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { personCircleOutline, menuOutline, closeOutline, moonOutline, sunnyOutline, logOutOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import './Header.css';

// El Header es un componente del ciudadano adaptado responsivamente para móviles mediante menú hamburguesa lateral, y con soporte dinámico para el cambio de Modo Claro / Modo Oscuro
const Header: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { logout } = useAuth();
  
  // Estado para controlar el menú lateral en dispositivos móviles
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Estado de Modo Oscuro
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));

  // Sincronizar el estado en caso de cambios externos
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

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const navigateTo = (path: string) => {
    history.push(path);
    setMenuOpen(false); // Cierra el menú al navegar
  };

  return (
    <header className="global-header">
      <div className="header-brand" onClick={() => navigateTo('/ciudadano/inicio')}>
        Cultura Municipal
      </div>
      
      {/* Navegación de Escritorio (Desktop) */}
      <nav className="header-nav desktop-only">
        <button className={`nav-link ${isActive('/ciudadano/inicio')}`} onClick={() => navigateTo('/ciudadano/inicio')}>Inicio</button>
        <button className={`nav-link ${isActive('/ciudadano/catalogo')}`} onClick={() => navigateTo('/ciudadano/catalogo')}>Catálogo</button>
        <button className={`nav-link ${isActive('/ciudadano/mapa')}`} onClick={() => navigateTo('/ciudadano/mapa')}>Mapa</button>
        <button className={`nav-link ${isActive('/ciudadano/agenda')}`} onClick={() => navigateTo('/ciudadano/agenda')}>Agenda</button>
        <button className={`nav-link ${isActive('/ciudadano/comunidad')}`} onClick={() => navigateTo('/ciudadano/comunidad')}>Comunidad</button>
        <button className={`nav-link ${isActive('/ciudadano/fondos')}`} onClick={() => navigateTo('/ciudadano/fondos')}>Fondos</button>
        <button className={`nav-link ${isActive('/ciudadano/transparencia')}`} onClick={() => navigateTo('/ciudadano/transparencia')}>Transparencia</button>
      </nav>

      <div className="header-user desktop-only">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
          <IonIcon icon={isDark ? sunnyOutline : moonOutline} />
        </button>
        <div className="vertical-divider"></div>
        <IonIcon icon={personCircleOutline} className="user-avatar-icon" title="Perfil" />
        <button className="theme-toggle-btn" style={{ marginLeft: '5px' }} onClick={() => { logout(); history.push('/auth/login'); }} title="Cerrar sesión">
          <IonIcon icon={logOutOutline} />
        </button>
      </div>

      {/* Controles de Cabecera Móvil (Mobile) */}
      <div className="mobile-header-controls mobile-only">
        <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
          <IonIcon icon={isDark ? sunnyOutline : moonOutline} />
        </button>
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <IonIcon icon={menuOpen ? closeOutline : menuOutline} />
        </button>
      </div>

      {/* Menú Lateral Desplegable Móvil (Drawer) */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          <button className={`drawer-link ${isActive('/ciudadano/inicio')}`} onClick={() => navigateTo('/ciudadano/inicio')}>Inicio</button>
          <button className={`drawer-link ${isActive('/ciudadano/catalogo')}`} onClick={() => navigateTo('/ciudadano/catalogo')}>Catálogo</button>
          <button className={`drawer-link ${isActive('/ciudadano/mapa')}`} onClick={() => navigateTo('/ciudadano/mapa')}>Mapa</button>
          <button className={`drawer-link ${isActive('/ciudadano/agenda')}`} onClick={() => navigateTo('/ciudadano/agenda')}>Agenda</button>
          <button className={`drawer-link ${isActive('/ciudadano/comunidad')}`} onClick={() => navigateTo('/ciudadano/comunidad')}>Comunidad</button>
          <button className={`drawer-link ${isActive('/ciudadano/fondos')}`} onClick={() => navigateTo('/ciudadano/fondos')}>Fondos</button>
          <button className={`drawer-link ${isActive('/ciudadano/transparencia')}`} onClick={() => navigateTo('/ciudadano/transparencia')}>Transparencia</button>
        </nav>
        
        <div className="drawer-footer">
          <div className="drawer-user-info">
            <IonIcon icon={personCircleOutline} className="user-avatar-icon" />
            <span>Perfil Ciudadano</span>
          </div>
          <button className="drawer-logout-btn" onClick={() => { logout(); history.push('/auth/login'); setMenuOpen(false); }}>
            Cerrar sesión
          </button>
        </div>
      </div>
      
      {/* Sombra de fondo (Overlay) al abrir el menú móvil */}
      {menuOpen && <div className="drawer-overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;
