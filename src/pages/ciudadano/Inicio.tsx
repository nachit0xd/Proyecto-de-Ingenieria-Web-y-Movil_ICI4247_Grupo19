import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonSpinner
} from '@ionic/react';
import CardPatrimonio from '../../components/CardPatrimonio'; 
import './Inicio.css';

// Servicios para obtener datos de fichas, eventos, propuestas y resumen de gestión
import { patrimonioService } from '../../services/patrimonio.service';
import { eventoService } from '../../services/evento.service';
import { comunidadService } from '../../services/comunidad.service';
import { dashboardService, ResumenGestion } from '../../services/dashboard.service';
import { FichaPatrimonio, EventoCultural, PropuestaCiudadana } from '../../types';

// Página de inicio para ciudadanos, mostrando un resumen del patrimonio local, próximos eventos, propuestas populares y estadísticas de gestión cultural
const Inicio: React.FC = () => {
  const [fichas, setFichas] = useState<FichaPatrimonio[]>([]);
  const [eventos, setEventos] = useState<EventoCultural[]>([]);
  const [propuestas, setPropuestas] = useState<PropuestaCiudadana[]>([]);
  const [resumen, setResumen] = useState<ResumenGestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fichasData, eventosData, propuestasData, resumenData] = await Promise.all([
          patrimonioService.obtenerFichasDestacadas(),
          eventoService.obtenerProximosEventos(),
          comunidadService.obtenerPropuestasPopulares(),
          dashboardService.obtenerResumenGestion()
        ]);
        
        setFichas(fichasData);
        setEventos(eventosData);
        setPropuestas(propuestasData);
        setResumen(resumenData);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDay = (date: Date) => date.getDate().toString().padStart(2, '0');
  const formatMonth = (date: Date) => date.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
  const formatTime = (date: Date) => date.toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const getEventColor = (tipo: string) => {
    if (tipo === 'feria') return 'date-blue';
    if (tipo === 'taller') return 'date-orange';
    return 'date-green';
  };

  const getPropuestaBadge = (index: number) => {
    if (index === 0) return 'badge-blue';
    if (index === 1) return 'badge-green';
    return 'badge-orange';
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen className="inicio-page">
          <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="inicio-page">
        <IonGrid className="ion-padding max-width-container">
          
          {/* FILA 1: BANNER DE BIENVENIDA */}
          <IonRow>
            <IonCol size="12">
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>¡Bienvenido, Sebastián Gonzales!</h2>
                  <p>Explora el patrimonio local de tu comuna, descubre oficios tradicionales y participa en las decisiones culturales de tu municipio</p>
                  <div className="banner-actions">
                    <IonButton color="light" fill="outline" className="btn-outline" routerLink="/ciudadano/catalogo">Explorar catálogo</IonButton>
                    <IonButton color="light" fill="outline" className="btn-outline" routerLink="/ciudadano/agenda">Ver agenda</IonButton>
                  </div>
                </div>
                
                {resumen && (
                  <div className="welcome-stats ion-hide-md-down">
                    <div className="stat-item">
                      <span className="stat-number">{resumen.fichasPublicadas}</span>
                      <span className="stat-label">Fichas publicadas</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{resumen.eventosRealizados}</span>
                      <span className="stat-label">Eventos activos</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{resumen.propuestasActivas}</span>
                      <span className="stat-label">Propuestas activas</span>
                    </div>
                  </div>
                )}
              </div>
            </IonCol>
          </IonRow>

          {/* FILA 2: ACCESO RÁPIDO */}
          <IonRow className="section-header center-header">
            <IonCol size="12">
              <h3>Acceso rápido</h3>
            </IonCol>
          </IonRow>
          
          <IonRow className="ion-justify-content-center">
            <IonCol size="4" sizeMd="2">
              <a href="/ciudadano/catalogo" className="quick-access-box" style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="qa-icon">📖</div>
                <p>Catálogo<br/>patrimonial</p>
              </a>
            </IonCol>
            <IonCol size="4" sizeMd="2">
              <a href="/ciudadano/mapa" className="quick-access-box" style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="qa-icon">🗺️</div>
                <p>Mapa<br/>cultural</p>
              </a>
            </IonCol>
            <IonCol size="4" sizeMd="2">
              <a href="/ciudadano/agenda" className="quick-access-box" style={{textDecoration: 'none', color: 'inherit'}}>
                <div className="qa-icon">📅</div>
                <p>Agenda<br/>cultural</p>
              </a>
            </IonCol>
          </IonRow>

          {/* FILA 3: EVENTOS Y FICHAS DESTACADAS */}
          <IonRow className="ion-margin-top gap-row">
            {/* Columna Izquierda (Próximos eventos) */}
            <IonCol size="12" sizeMd="6" className="dashboard-column">
              <div className="box-container outline-box">
                <div className="column-header">
                  <h3>Próximos eventos</h3>
                  <a href="/ciudadano/agenda">Ver agenda &gt;</a>
                </div>
                
                <div className="event-list">
                  {eventos.map(evento => (
                    <div className="event-item" key={evento.id}>
                      <div className={`event-date ${getEventColor(evento.tipo)}`}>
                        <span className="day">{formatDay(evento.fechaInicio)}</span>
                        <span className="month">{formatMonth(evento.fechaInicio)}</span>
                      </div>
                      <div className="event-details">
                        <span className="event-category color-orange">{evento.tipo}</span>
                        <h4>{evento.titulo}</h4>
                        <p>{formatTime(evento.fechaInicio)}-{formatTime(evento.fechaFin)} • {evento.ubicacion?.direccion || 'Por definir'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </IonCol>

            {/* Columna Derecha (Fichas destacadas) */}
            <IonCol size="12" sizeMd="6" className="dashboard-column">
              <div className="box-container outline-box">
                <div className="column-header">
                  <h3>Fichas destacadas</h3>
                  <a href="/ciudadano/catalogo">Ver catálogo &gt;</a>
                </div>
                
                <div className="fichas-grid">
                  {fichas.map(ficha => (
                    <CardPatrimonio 
                      key={ficha.id}
                      categoria={ficha.categoria}
                      titulo={ficha.nombre}
                      descripcion={ficha.descripcion}
                      valoracion={4} 
                    />
                  ))}
                </div>
              </div>
            </IonCol>
          </IonRow>

          {/* FILA 4: PROPUESTAS MÁS VOTADAS */}
          <IonRow className="section-header margin-top-large">
            <IonCol size="12" className="flex-header">
              <h3>Propuestas más votadas</h3>
              <a href="/ciudadano/comunidad">Ver todas &gt;</a>
            </IonCol>
          </IonRow>

          <IonRow>
            {propuestas.map((propuesta, index) => (
              <IonCol size="12" sizeMd="4" key={propuesta.id}>
                <div className="propuesta-card outline-box">
                  <div className="propuesta-header">
                    <span className={`badge ${getPropuestaBadge(index)}`}>Idea</span>
                    <span className="votes">{propuesta.votos} votos</span>
                  </div>
                  <h4>{propuesta.titulo}</h4>
                  <div className="progress-container">
                    <div className="progress-bar" style={{width: `${Math.min((propuesta.votos / 150) * 100, 100)}%`}}></div>
                  </div>
                  <p className="progress-text">{propuesta.votos} / 150 votos para escalar</p>
                </div>
              </IonCol>
            ))}
          </IonRow>

          {/* FILA 5: RESUMEN GESTIÓN */}
          <IonRow className="section-header margin-top-large">
            <IonCol size="12" className="flex-header">
              <h3>Resumen de gestión cultural</h3>
              <a href="/ciudadano/transparencia" className="color-orange">Ver transparencia &gt;</a>
            </IonCol>
          </IonRow>

          {resumen && (
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <div className="resumen-card">
                  <p className="res-title">Fichas publicadas</p>
                  <h3 className="res-number">{resumen.fichasPublicadas}</h3>
                  <p className="res-trend">{resumen.crecimientoFichas}</p>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="resumen-card">
                  <p className="res-title">Fondos adjudicados</p>
                  <h3 className="res-number">{resumen.fondosAdjudicados}</h3>
                  <p className="res-trend">{resumen.crecimientoFondos}</p>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="resumen-card">
                  <p className="res-title">Propuestas activas</p>
                  <h3 className="res-number">{resumen.propuestasActivas}</h3>
                  <p className="res-trend">{resumen.votosTotales}</p>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="resumen-card">
                  <p className="res-title">Eventos realizados</p>
                  <h3 className="res-number">{resumen.eventosRealizados}</h3>
                  <p className="res-trend">{resumen.crecimientoEventos}</p>
                </div>
              </IonCol>
            </IonRow>
          )}

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;