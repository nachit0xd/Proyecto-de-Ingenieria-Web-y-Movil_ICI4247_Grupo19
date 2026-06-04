import React from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { searchOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import './Dashboard.css';

import { useKpisGestor, useActividadReciente } from '../../hooks/useDashboard';

// Página principal del gestor municipal, mostrando KPIs clave, botones de acción rápida y una tabla de actividad reciente para facilitar la gestión cultural
const DashboardGestor: React.FC = () => {
  const history = useHistory();
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const { data: kpis, isLoading: loadKpis } = useKpisGestor();
  const { data: actividades = [], isLoading: loadActividades } = useActividadReciente();

  const loading = loadKpis || loadActividades;

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-');
  };

  const getBadgeClass = (estado: string) => {
    if (estado === 'aprobado' || estado === 'publicado') return 'b-success';
    if (estado === 'rechazado') return 'b-danger';
    return 'b-warning';
  };

  const formatEstado = (estado: string) => {
    if (['revision', 'en_revision', 'pendiente'].includes(estado)) return 'Pendiente de revisión';
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  return (
    <IonPage>
      {/* HEADER GLOBAL DEL GESTOR */}
      <GestorHeader />

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          {/* ÁREA PRINCIPAL DE CONTENIDO */}
          <main className="gestor-main-content">
            
            {loading ? (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <>
                {/* Banner de Bienvenida */}
                <div className="welcome-banner">
                  <div className="welcome-text">
                    <h2>¡Bienvenido, {user?.nombre || 'Gestor'}!</h2>
                    <p>¡Organiza y maneja la aplicación Cultura Municipal desde tu panel de gestión!</p>
                  </div>
                  {kpis && (
                    <div className="welcome-stats">
                      <div className="w-stat">
                        <span className="w-number">+{kpis.propuestasPorModerar}</span>
                        <span className="w-label">Propuestas<br/>ciudadanas</span>
                      </div>
                      <div className="w-stat">
                        <span className="w-number">+{kpis.eventosSemana}</span>
                        <span className="w-label">Eventos<br/>iniciados</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Fila 1: KPIs (Tarjetas grises) */}
                {kpis && (
                  <div className="kpi-grid">
                    <div className="kpi-card-gestor">
                      <p>Postulaciones<br/>por revisar</p>
                      <h3>{kpis.postulacionesPendientes}</h3>
                    </div>
                    <div className="kpi-card-gestor">
                      <p>Propuestas<br/>por moderar</p>
                      <h3>{kpis.propuestasPorModerar}</h3>
                    </div>
                    <div className="kpi-card-gestor">
                      <p>Fichas activas<br/>en catálogo</p>
                      <h3>{kpis.fichasActivas}</h3>
                    </div>
                    <div className="kpi-card-gestor">
                      <p>Eventos esta<br/>semana</p>
                      <h3>{kpis.eventosSemana}</h3>
                    </div>
                  </div>
                )}

                {/* Fila 2: Botones de Acción Rápida */}
                <div className="quick-actions-row">
                  <button className="action-btn" onClick={() => history.push('/gestor/catalogo')}><strong>+ Nueva ficha</strong></button>
                  <button className="action-btn" onClick={() => history.push('/gestor/agenda-mapa')}><strong>+ Agendar evento</strong></button>
                  <button className="action-btn" onClick={() => history.push('/gestor/fondos')}><strong>+ Abrir convocatoria</strong></button>
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
                        {actividades.map(act => (
                          <tr key={act.id}>
                            <td>{formatDate(act.fecha)}</td>
                            <td>{act.usuario}</td>
                            <td>{act.accion}</td>
                            <td>{act.titulo}</td>
                            <td>
                              <span className={`badge-table ${getBadgeClass(act.estado)}`}>
                                {['revision', 'en_revision', 'pendiente'].includes(act.estado) && <IonIcon icon={searchOutline}/>} 
                                {formatEstado(act.estado)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardGestor;
