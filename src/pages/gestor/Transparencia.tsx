import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonToggle } from '@ionic/react';
import { settingsOutline, downloadOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import './Transparencia.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { useKPIsGestor, usePublicacionesTransparencia, useCrearPublicacion, useActualizarVisibilidad, useGraficosGestor } from '../../hooks/useTransparencia';
import { PublicacionPanel } from '../../services/transparencia.service';

// Componente principal de la página de Transparencia para gestores municipales
// Muestra KPIs clave de transparencia, gráficos de desempeño y un panel público con publicaciones y su visibilidad
const TransparenciaGestor: React.FC = () => {
  const { data: kpis, isLoading: loadKpis } = useKPIsGestor();
  const { data: pubData = [], isLoading: loadPubs } = usePublicacionesTransparencia();
  const { data: graficos, isLoading: loadGraficos } = useGraficosGestor();
  const crearPub = useCrearPublicacion();
  const toggleVis = useActualizarVisibilidad();

  const loading = loadKpis || loadPubs || loadGraficos;

  const [publicaciones, setPublicaciones] = useState<PublicacionPanel[]>([]);

  useEffect(() => {
    if (pubData.length > 0) {
      setPublicaciones(pubData);
    }
  }, [pubData]);

  const [showPubModal, setShowPubModal] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('General');

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [vedaElectoral, setVedaElectoral] = useState(() => localStorage.getItem('vedaElectoral') === 'true');
  const [panelVisible, setPanelVisible] = useState(() => localStorage.getItem('panelVisible') !== 'false');

  const handleToggleVisibility = (pub: PublicacionPanel) => {
    toggleVis.mutate({ id: pub.id, visible: !pub.visible });
  };

  const handleNuevaPublicacion = () => {
    if (nuevoMensaje.trim() !== '') {
      crearPub.mutate({ mensaje: nuevoMensaje, tipo: nuevoTipo });
      setShowPubModal(false);
      setNuevoMensaje('');
      setNuevoTipo('General');
    }
  };

  const saveConfig = () => {
    localStorage.setItem('vedaElectoral', vedaElectoral.toString());
    localStorage.setItem('panelVisible', panelVisible.toString());
    setShowConfigModal(false);
  };

  const descargarReporte = () => {
    if (!kpis) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "KPI,Valor,Meta\n"
      + `Ejecucion Presupuestaria,${kpis.ejecucionPresupuestaria},${kpis.ejecucionMeta}\n`
      + `Tasa de Aprobacion,${kpis.tasaAprobacion},${kpis.tasaAprobacionMeta}\n`
      + `Tiempo de Respuesta,${kpis.tiempoRespuesta},${kpis.tiempoRespuestaMeta}\n`
      + `Participacion Ciudadana,${kpis.participacionCiudadana},${kpis.participacionMeta}\n\n`
      + "Fecha,Mensaje,Estado\n"
      + pubData.map(p => `${p.fecha},"${p.mensaje}",${p.visible ? 'Visible' : 'Oculto'}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_transparencia.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <IonPage className="transparencia-gestor-page">
      <GestorHeader />

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          <GestorSidebar />

          <main className="gestor-main-content" style={{overflowY: 'auto'}}>
            <div className="transparencia-header-row">
              <h2>Transparencia de Reportes y Gestión</h2>
              <div className="header-actions-t">
                <button className="btn-config-panel" onClick={() => setShowConfigModal(true)}><IonIcon icon={settingsOutline} /> Configurar Panel Público</button>
                <button className="btn-descargar-reporte" onClick={descargarReporte}><IonIcon icon={downloadOutline} /> Descargar reporte (CSV)</button>
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
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={graficos?.postulacionesPorMes || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="mes" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                          <Legend iconType="circle" />
                          <Line type="monotone" dataKey="postulaciones" name="Postulaciones" stroke="#e37e33" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="aprobaciones" name="Aprobaciones" stroke="#0000a0" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="chart-card">
                    <h3>Presupuesto por Área cultural</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={graficos?.presupuestoPorArea || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="area" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value/1000000}M`} />
                          <RechartsTooltip formatter={(value: any) => [`$${Number(value).toLocaleString('es-CL')}`, 'Presupuesto']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                          <Bar dataKey="presupuesto" name="Presupuesto" fill="#e37e33" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Panel Público Table */}
                <div className="panel-publico-section">
                  <div className="panel-publico-header">
                    <h3>Panel Público</h3>
                    <button className="btn-nueva-pub" onClick={() => setShowPubModal(true)}>+ Nueva publicación</button>
                  </div>
                  <table className="panel-table">
                    <thead>
                      <tr>
                        <th style={{width: '120px'}}>Fecha</th>
                        <th style={{width: '100px'}}>Categoría</th>
                        <th>Mensaje</th>
                        <th style={{width: '150px', textAlign: 'center'}}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publicaciones.map(pub => (
                        <tr key={pub.id}>
                          <td>{pub.fecha}</td>
                          <td>
                            <span className="badge badge-gray">{pub.tipo || 'General'}</span>
                          </td>
                          <td>{pub.mensaje}</td>
                          <td style={{textAlign: 'center'}}>
                            <button 
                              className={`btn-toggle-visible ${pub.visible ? 'visible' : 'oculto'}`}
                              onClick={() => handleToggleVisibility(pub)}
                              disabled={toggleVis.isPending}
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

      {/* Modal - Nueva Publicación */}
      <IonModal isOpen={showPubModal} onDidDismiss={() => setShowPubModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Nueva Publicación</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowPubModal(false)}>Cancelar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem className="margin-bottom-large">
            <IonLabel position="stacked">Mensaje del anuncio</IonLabel>
            <IonInput 
              value={nuevoMensaje} 
              onIonChange={e => setNuevoMensaje(e.detail.value!)} 
              placeholder="Ej. Se abrieron las inscripciones..."
            />
          </IonItem>
          <IonItem className="margin-bottom-large">
            <IonLabel position="stacked">Categoría</IonLabel>
            <IonSelect value={nuevoTipo} onIonChange={e => setNuevoTipo(e.detail.value)}>
              <IonSelectOption value="General">General</IonSelectOption>
              <IonSelectOption value="Fondos">Fondos Muncipales</IonSelectOption>
              <IonSelectOption value="Eventos">Eventos</IonSelectOption>
              <IonSelectOption value="Alerta">Alerta</IonSelectOption>
            </IonSelect>
          </IonItem>
          <button className="btn-nueva-pub" style={{width: '100%'}} onClick={handleNuevaPublicacion}>
            Publicar
          </button>
        </IonContent>
      </IonModal>

      {/* Modal - Configuración Panel */}
      <IonModal isOpen={showConfigModal} onDidDismiss={() => setShowConfigModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Configuración del Panel Público</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowConfigModal(false)}>Cerrar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p style={{color: '#6b7280', marginBottom: '20px'}}>
            Ajusta los parámetros globales de visualización para la aplicación del Ciudadano.
          </p>
          <IonItem lines="full">
            <IonLabel>
              <h2>Visibilidad Global</h2>
              <p>Mostrar la sección de Actualizaciones Municipales al ciudadano</p>
            </IonLabel>
            <IonToggle checked={panelVisible} onIonChange={e => setPanelVisible(e.detail.checked)} />
          </IonItem>
          <IonItem lines="full">
            <IonLabel>
              <h2 style={{color: '#ef4444'}}>Modo Veda Electoral</h2>
              <p>Ocultar panel y anuncios por normativas de campaña</p>
            </IonLabel>
            <IonToggle checked={vedaElectoral} onIonChange={e => setVedaElectoral(e.detail.checked)} color="danger" />
          </IonItem>
          
          <div style={{marginTop: '30px', textAlign: 'center'}}>
            <button className="btn-nueva-pub" onClick={saveConfig}>
              Guardar Configuración
            </button>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default TransparenciaGestor;
