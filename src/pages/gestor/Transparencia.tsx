import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { personCircleOutline, settingsOutline, downloadOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './Transparencia.css';

import { useKPIsTransparencia, usePublicacionesTransparencia } from '../../hooks/useTransparencia';
import { KPI_Transparencia, PublicacionPanel } from '../../services/transparencia.service';

// Componente principal de la página de Transparencia para gestores municipales
// Muestra KPIs clave de transparencia, gráficos de desempeño y un panel público con publicaciones y su visibilidad
const TransparenciaGestor: React.FC = () => {
  const { data: kpis, isLoading: loadKpis } = useKPIsTransparencia();
  const { data: pubData = [], isLoading: loadPubs } = usePublicacionesTransparencia();

  const loading = loadKpis || loadPubs;

  const [publicaciones, setPublicaciones] = useState<PublicacionPanel[]>([]);

  useEffect(() => {
    if (pubData.length > 0) {
      setPublicaciones(pubData);
    }
  }, [pubData]);

  const toggleVisibility = (id: string) => {
    setPublicaciones(publicaciones.map(p => p.id === id ? { ...p, visible: !p.visible } : p));
  };

  return (
    <IonPage className="transparencia-gestor-page">
      <header className="gestor-header">
        <div className="gestor-brand">
          <h1>Cultura Municipal</h1>
          <span className="gestor-role-badge">Gestor Municipal</span>
        </div>
        <div className="gestor-user-menu">
          <IonIcon icon={personCircleOutline} className="avatar-icon" />
        </div>
      </header>

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          <GestorSidebar />

          <main className="gestor-main-content" style={{overflowY: 'auto'}}>
            <div className="transparencia-header-row">
              <h2>Transparencia de Reportes y Gestión</h2>
              <div className="header-actions-t">
                <button className="btn-config-panel"><IonIcon icon={settingsOutline} /> Configurar Panel Público</button>
                <button className="btn-descargar-reporte"><IonIcon icon={downloadOutline} /> Descargar reporte (PDF / Excel)</button>
              </div>
            </div>

            {loading || !kpis ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><IonSpinner name="crescent" /></div>
            ) : (
              <div className="fade-in">
                {/* KPIs */}
                <div className="kpis-grid">
                  <div className="kpi-card-gestor">
                    <p className="kpi-label">Ejecución Presupuestaria</p>
                    <h3 className="kpi-value">{kpis.ejecucionPresupuestaria}</h3>
                    <p className="kpi-meta">{kpis.ejecucionMeta}</p>
                  </div>
                  <div className="kpi-card-gestor">
                    <p className="kpi-label">Tasa de aprobación de fondos</p>
                    <h3 className="kpi-value">{kpis.tasaAprobacion}</h3>
                    <p className="kpi-meta">{kpis.tasaAprobacionMeta}</p>
                  </div>
                  <div className="kpi-card-gestor">
                    <p className="kpi-label">Tiempo de respuesta</p>
                    <h3 className="kpi-value">{kpis.tiempoRespuesta}</h3>
                    <p className="kpi-meta">{kpis.tiempoRespuestaMeta}</p>
                  </div>
                  <div className="kpi-card-gestor">
                    <p className="kpi-label">Participación Ciudadana</p>
                    <h3 className="kpi-value">{kpis.participacionCiudadana}</h3>
                    <p className="kpi-meta">{kpis.participacionMeta}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3>Postulaciones vs Aprobaciones</h3>
                    <div className="css-line-chart">
                      <div className="y-axis-labels">
                        <span>40</span>
                        <span>30</span>
                        <span>20</span>
                        <span>10</span>
                      </div>
                      
                      {/* Simple CSS/SVG Line Mock */}
                      <svg className="svg-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polyline points="0,60 20,40 40,50 60,30 80,40 100,35" fill="none" stroke="#e37e33" strokeWidth="2" />
                        <polyline points="0,80 20,50 40,55 60,45 80,40 100,55" fill="none" stroke="#0000a0" strokeWidth="2" />
                      </svg>

                      <div className="x-axis-labels">
                        <span style={{marginLeft: '0%'}}>Ene</span>
                        <span style={{marginLeft: '20%'}}>Feb</span>
                        <span style={{marginLeft: '20%'}}>Mar</span>
                        <span style={{marginLeft: '20%'}}>Abr</span>
                        <span style={{marginLeft: '20%'}}>May</span>
                      </div>

                      <div className="chart-legend">
                        <div><span className="dot" style={{background: '#e37e33'}}></span> Postulaciones</div>
                        <div><span className="dot" style={{background: '#0000a0'}}></span> Aprobaciones</div>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3>Presupuesto por Área cultural</h3>
                    <div className="css-bar-chart">
                      <div className="bar-col">
                        <span className="bar-value">$4,5 M</span>
                        <div className="bar-fill" style={{height: '100%', background: '#e37e33'}}></div>
                        <span className="bar-label">Cultores</span>
                      </div>
                      <div className="bar-col">
                        <span className="bar-value">$2,3 M</span>
                        <div className="bar-fill" style={{height: '50%', background: '#0000a0'}}></div>
                        <span className="bar-label">Ferias</span>
                      </div>
                      <div className="bar-col">
                        <span className="bar-value">$1,6 M</span>
                        <div className="bar-fill" style={{height: '35%', background: '#4d8000'}}></div>
                        <span className="bar-label">Patrimonio</span>
                      </div>
                      <div className="bar-col">
                        <span className="bar-value">$2,5 M</span>
                        <div className="bar-fill" style={{height: '55%', background: '#f5a623'}}></div>
                        <span className="bar-label">Otros</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panel Público Table */}
                <div className="panel-publico-section">
                  <div className="panel-publico-header">
                    <h3>Panel Público</h3>
                    <button className="btn-nueva-pub">+ Nueva publicación</button>
                  </div>
                  <table className="panel-table">
                    <thead>
                      <tr>
                        <th style={{width: '120px'}}>Fecha</th>
                        <th>Mensaje</th>
                        <th style={{width: '150px', textAlign: 'center'}}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publicaciones.map(pub => (
                        <tr key={pub.id}>
                          <td>{pub.fecha}</td>
                          <td>{pub.mensaje}</td>
                          <td style={{textAlign: 'center'}}>
                            <button 
                              className={`btn-toggle-visible ${pub.visible ? 'visible' : 'oculto'}`}
                              onClick={() => toggleVisibility(pub.id)}
                            >
                              {pub.visible ? 'Visible' : 'Oculto'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TransparenciaGestor;
