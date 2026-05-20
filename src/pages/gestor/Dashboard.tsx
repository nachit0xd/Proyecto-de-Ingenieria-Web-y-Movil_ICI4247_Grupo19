import React from 'react';
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { personCircleOutline, searchOutline
} from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './Dashboard.css';

// La página de dashboard del gestor municipal es el panel de control principal para los gestores culturales municipales.
// Aquí pueden ver un resumen de la actividad reciente, métricas clave, y acceder rápidamente a las funciones de gestión como revisar postulaciones, moderar propuestas, y administrar el catálogo de fichas culturales.

const DashboardGestor: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuth();

  return (
    <IonPage>
      {/* HEADER GLOBAL DEL GESTOR */}
      <header className="gestor-header">
        <div className="gestor-brand">
          <h1>Cultura Municipal</h1>
          <span className="gestor-role-badge">Gestor Municipal</span>
        </div>
        <div className="gestor-user-menu">
          <IonIcon icon={personCircleOutline} className="avatar-icon" />
          <IonButton fill="clear" onClick={() => { logout(); history.push('/auth/login'); }}>Cerrar sesión</IonButton>
        </div>
      </header>

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          {/* ÁREA PRINCIPAL DE CONTENIDO */}
          <main className="gestor-main-content">
            
            {/* Banner de Bienvenida */}
            <div className="welcome-banner">
              <div className="welcome-text">
                <h2>¡Bienvenido, José Soto!</h2>
                <p>¡Organiza y maneja la aplicación Cultura Municipal desde tu panel de gestión!</p>
              </div>
              <div className="welcome-stats">
                <div className="w-stat">
                  <span className="w-number">+2</span>
                  <span className="w-label">Propuestas<br/>ciudadanas</span>
                </div>
                <div className="w-stat">
                  <span className="w-number">+3</span>
                  <span className="w-label">Eventos<br/>iniciados</span>
                </div>
              </div>
            </div>

            {/* Fila 1: KPIs (Tarjetas grises) */}
            <div className="kpi-grid">
              <div className="kpi-card-gestor">
                <p>Postulaciones<br/>por revisar</p>
                <h3>19</h3>
              </div>
              <div className="kpi-card-gestor">
                <p>Propuestas<br/>por moderar</p>
                <h3>4</h3>
              </div>
              <div className="kpi-card-gestor">
                <p>Fichas activas<br/>en catálogo</p>
                <h3>12</h3>
              </div>
              <div className="kpi-card-gestor">
                <p>Eventos esta<br/>semana</p>
                <h3>2</h3>
              </div>
            </div>

            {/* Fila 2: Botones de Acción Rápida */}
            <div className="quick-actions-row">
              <button className="action-btn"><strong>+ Nueva ficha</strong></button>
              <button className="action-btn"><strong>+ Agendar evento</strong></button>
              <button className="action-btn"><strong>+ Abrir convocatoria</strong></button>
            </div>

            {/* Fila 3: Tabla de Actividad Reciente */}
            <div className="activity-section">
              <p className="section-subtitle">Actualizaciones de los últimos 7 días:</p>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Acción</th>
                      <th>Título</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>14-05-26</td>
                      <td>seba_gonzales</td>
                      <td>Postulación</td>
                      <td>Fondo Cultural Mayo 2026</td>
                      <td><span className="badge-table b-warning"><IonIcon icon={searchOutline}/> Pendiente de revisión</span></td>
                    </tr>
                    <tr>
                      <td>14-05-26</td>
                      <td>Maria_Soto</td>
                      <td>Propuesta</td>
                      <td>Evento música folclórica</td>
                      <td><span className="badge-table b-warning"><IonIcon icon={searchOutline}/> Pendiente de revisión</span></td>
                    </tr>
                    <tr>
                      <td>12-05-26</td>
                      <td>Ignacio_Ca</td>
                      <td>Postulación</td>
                      <td>Fondo Cultural Mayo 2026</td>
                      <td><span className="badge-table b-success"><IonIcon icon={searchOutline}/> Aprobado</span></td>
                    </tr>
                    <tr>
                      <td>11-05-26</td>
                      <td>matias_ramirez</td>
                      <td>Postulación</td>
                      <td>Fondo Cultural Mayo 2026</td>
                      <td><span className="badge-table b-warning"><IonIcon icon={searchOutline}/> Pendiente de revisión</span></td>
                    </tr>
                    <tr>
                      <td>09-05-26</td>
                      <td>seba_gonzales</td>
                      <td>Propuesta</td>
                      <td>Mural artístico plaza Central</td>
                      <td><span className="badge-table b-success"><IonIcon icon={searchOutline}/> Aprobado</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardGestor;