import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, IonSpinner 
} from '@ionic/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Transparencia.css';

import { useKPIsCiudadano, usePublicacionesTransparencia, useGraficosCiudadano } from '../../hooks/useTransparencia';

// Página de transparencia que expone información sobre el presupuesto y metas alcanzadas
const Transparencia: React.FC = () => {
  const { data: kpis, isLoading: loadKpis } = useKPIsCiudadano();
  const { data: pubs = [], isLoading: loadPubs } = usePublicacionesTransparencia();
  const { data: graficos, isLoading: loadGraficos } = useGraficosCiudadano();

  const loading = loadKpis || loadPubs || loadGraficos;

  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-theme'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const chartTextColor = isDark ? '#94a3b8' : '#4b5563';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e5e7eb';

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  const vedaElectoral = localStorage.getItem('vedaElectoral') === 'true';
  const panelVisible = localStorage.getItem('panelVisible') !== 'false';
  const showUpdates = panelVisible && !vedaElectoral;

  const getDotColor = (tipo: string) => {
    switch(tipo) {
      case 'Fondos': return 'blue';
      case 'Eventos': return 'green';
      case 'Alerta': return 'orange';
      default: return 'yellow';
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="transparencia-page">
        <IonGrid className="max-width-container ion-padding">
          
          <IonRow className="margin-bottom-large">
            <IonCol size="12">
              <h1 className="page-title">Panel de transparencia cultural</h1>
              <p className="page-subtitle">Indicadores actualizados al 22 de junio 2026 • Período: Ene - Jun 2026</p>
            </IonCol>
          </IonRow>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <>
              {kpis && (
                <IonRow className="margin-bottom-large">
                  <IonCol size="6" sizeMd="3">
                    <div className="kpi-card">
                      <p className="kpi-title">Fichas publicadas</p>
                      <h3 className="kpi-number">{kpis.fichasPublicadas}</h3>
                      <p className="kpi-trend">{kpis.crecimientoFichas}</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="kpi-card">
                      <p className="kpi-title">Fondos adjudicados</p>
                      <h3 className="kpi-number">{kpis.fondosAdjudicados}</h3>
                      <p className="kpi-trend">{kpis.crecimientoFondos}</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="kpi-card">
                      <p className="kpi-title">Propuestas activas</p>
                      <h3 className="kpi-number">{kpis.propuestasActivas}</h3>
                      <p className="kpi-trend">{kpis.votosTotales}</p>
                    </div>
                  </IonCol>
                  <IonCol size="6" sizeMd="3">
                    <div className="kpi-card">
                      <p className="kpi-title">Eventos realizados</p>
                      <h3 className="kpi-number">{kpis.eventosRealizados}</h3>
                      <p className="kpi-trend">{kpis.crecimientoEventos}</p>
                    </div>
                  </IonCol>
                </IonRow>
              )}

              <IonRow>
                <IonCol size="12" sizeMd="6" className="charts-column">
                  
                  <div className="chart-box outline-box">
                    <h3 className="box-title">Postulaciones por mes</h3>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer>
                        <BarChart data={graficos?.postulacionesPorMes || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                          <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartTextColor }} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, color: isDark ? '#f8fafc' : '#1f2937' }} />
                          <Bar dataKey="cantidad" name="Postulaciones" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-box outline-box margin-top">
                    <h3 className="box-title">Distribución por categoría</h3>
                    <div style={{ width: '100%', height: 250, display: 'flex', alignItems: 'center' }}>
                      <ResponsiveContainer width="60%" height="100%">
                        <PieChart>
                          <Pie
                            data={graficos?.distribucionCategorias || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {(graficos?.distribucionCategorias || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${tooltipBorder}`, backgroundColor: tooltipBg, color: isDark ? '#f8fafc' : '#1f2937' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ width: '40%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                        {(graficos?.distribucionCategorias || []).map((entry: any, index: number) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                            <span style={{ color: 'var(--app-text-color)' }}>{entry.name} ({entry.value})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </IonCol>

                <IonCol size="12" sizeMd="6">
                  <div className="updates-box outline-box h-100">
                    <h3 className="box-title">Últimas actualizaciones municipales</h3>
                    
                    {showUpdates ? (
                      <div className="updates-list">
                        {pubs.filter((p: any) => p.visible).length > 0 ? (
                          pubs.filter((p: any) => p.visible).map((pub: any, idx: number) => (
                            <div className={`update-item ${idx === pubs.filter((p: any) => p.visible).length - 1 ? 'border-none' : ''}`} key={pub.id}>
                              <span className={`dot dot-${getDotColor(pub.tipo)} margin-right`}></span>
                              <p><strong>{pub.fecha}</strong> <span style={{fontSize: '0.8rem', color: isDark ? 'var(--app-text-color)' : '#6b7280', padding: '2px 6px', background: isDark ? 'var(--app-bg)' : '#f3f4f6', borderRadius: '4px', margin: '0 5px'}}>{pub.tipo || 'General'}</span> {pub.mensaje}</p>
                            </div>
                          ))
                        ) : (
                          <div className="update-item border-none">
                            <p style={{ color: 'var(--app-text-muted)' }}>No hay actualizaciones municipales recientes.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="update-item border-none" style={{ marginTop: '20px' }}>
                        <p style={{ color: isDark ? 'var(--app-text-muted)' : '#6b7280' }}>
                          {vedaElectoral ? 'Por disposiciones de Veda Electoral, el panel de anuncios públicos se encuentra temporalmente deshabilitado.' : 'El panel de actualizaciones públicas no se encuentra visible por configuraciones municipales.'}
                        </p>
                      </div>
                    )}
                  </div>
                </IonCol>

              </IonRow>
            </>
          )}

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Transparencia;