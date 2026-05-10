import React from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton
} from '@ionic/react';
import Header from '../../components/Header';
import CardPatrimonio from '../../components/CardPatrimonio'; 
import './Inicio.css';

const Inicio: React.FC = () => {
  return (
    <IonPage>
      <Header />
      
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
                    <IonButton color="light" fill="outline" className="btn-outline">Explorar catálogo</IonButton>
                    <IonButton color="light" fill="outline" className="btn-outline">Ver agenda</IonButton>
                  </div>
                </div>
                
                <div className="welcome-stats ion-hide-md-down">
                  <div className="stat-item">
                    <span className="stat-number">41</span>
                    <span className="stat-label">Fichas publicadas</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Eventos activos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">15</span>
                    <span className="stat-label">Propuestas activas</span>
                  </div>
                </div>
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
              <div className="quick-access-box">
                <div className="qa-icon">📖</div>
                <p>Catálogo<br/>patrimonial</p>
              </div>
            </IonCol>
            <IonCol size="4" sizeMd="2">
              <div className="quick-access-box">
                <div className="qa-icon">🗺️</div>
                <p>Mapa<br/>cultural</p>
              </div>
            </IonCol>
            <IonCol size="4" sizeMd="2">
              <div className="quick-access-box">
                <div className="qa-icon">📅</div>
                <p>Agenda<br/>cultural</p>
              </div>
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
                  <div className="event-item">
                    <div className="event-date date-blue">
                      <span className="day">25</span>
                      <span className="month">JUN</span>
                    </div>
                    <div className="event-details">
                      <span className="event-category color-orange">Feria artesanal</span>
                      <h4>Feria del libro usado</h4>
                      <p>12:00-18:00 • Parque Libertad</p>
                    </div>
                  </div>

                  <div className="event-item">
                    <div className="event-date date-orange">
                      <span className="day">06</span>
                      <span className="month">JUL</span>
                    </div>
                    <div className="event-details">
                      <span className="event-category color-orange">Cultor local</span>
                      <h4>Taller de canto chileno</h4>
                      <p>14:00-18:00 • Centro Recreacional</p>
                    </div>
                  </div>

                  <div className="event-item">
                    <div className="event-date date-green">
                      <span className="day">21</span>
                      <span className="month">JUL</span>
                    </div>
                    <div className="event-details">
                      <span className="event-category color-orange">Espacio patrimonial</span>
                      <h4>Inauguración Monumento de la Memoria</h4>
                      <p>12:00-14:00 • Parque Centro</p>
                    </div>
                  </div>
                </div>
              </div>
            </IonCol>

            {/* FICHAS DESTACADAS CON COMPONENTE REUTILIZABLE */}
            <IonCol size="12" sizeMd="6" className="dashboard-column">
              <div className="box-container outline-box">
                <div className="column-header">
                  <h3>Fichas destacadas</h3>
                  <a href="/ciudadano/catalogo">Ver catálogo &gt;</a>
                </div>
                
                <div className="fichas-grid">
                  <CardPatrimonio 
                    categoria="Oficio"
                    titulo="Tejeduría en telar"
                    descripcion="Técnica ancestral mapuche transmitida por generaciones"
                    valoracion={4}
                  />
                  <CardPatrimonio 
                    categoria="Cultor"
                    titulo="Alfarería en greda"
                    descripcion="Cerrámica artesanal con técnicas prehispánicas locales"
                    valoracion={3}
                  />
                  <CardPatrimonio 
                    categoria="Expresión"
                    titulo="Música folclórica"
                    descripcion="Cueca chora interpretada por músicos locales"
                    valoracion={4}
                  />
                </div>
              </div>
            </IonCol>
          </IonRow>

          {/* FILA 4: PROPUESTAS MÁS VOTADAS */}
          <IonRow className="section-header margin-top-large">
            <IonCol size="12" className="flex-header">
              <h3>Propuestas más votadas</h3>
              <a href="/ciudadano/comunidad/propuestas">Ver todas &gt;</a>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" sizeMd="4">
              <div className="propuesta-card outline-box">
                <div className="propuesta-header">
                  <span className="badge badge-blue">Feria</span>
                  <span className="votes">122 votos</span>
                </div>
                <h4>Feria de ropa en Parque Central</h4>
                <div className="progress-container">
                  <div className="progress-bar" style={{width: '81%'}}></div>
                </div>
                <p className="progress-text">122 / 150 votos para escalar</p>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className="propuesta-card outline-box">
                <div className="propuesta-header">
                  <span className="badge badge-green">Patrimonio</span>
                  <span className="votes">56 votos</span>
                </div>
                <h4>Mural histórico en calle Bellavista</h4>
                <div className="progress-container">
                  <div className="progress-bar" style={{width: '37%'}}></div>
                </div>
                <p className="progress-text">56 / 150 votos para escalar</p>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className="propuesta-card outline-box">
                <div className="propuesta-header">
                  <span className="badge badge-orange">Cultor</span>
                  <span className="votes">32 votos</span>
                </div>
                <h4>Taller de muralismo para jóvenes</h4>
                <div className="progress-container">
                  <div className="progress-bar" style={{width: '21%'}}></div>
                </div>
                <p className="progress-text">32 / 150 votos para escalar</p>
              </div>
            </IonCol>
          </IonRow>

          {/* FILA 5: RESUMEN GESTIÓN */}
          <IonRow className="section-header margin-top-large">
            <IonCol size="12" className="flex-header">
              <h3>Resumen de gestión cultural</h3>
              <a href="/ciudadano/transparencia" className="color-orange">Ver transparencia &gt;</a>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6" sizeMd="3">
              <div className="resumen-card">
                <p className="res-title">Fichas publicadas</p>
                <h3 className="res-number">23</h3>
                <p className="res-trend">+4 este mes</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="resumen-card">
                <p className="res-title">Fondos adjudicados</p>
                <h3 className="res-number">$3.2M</h3>
                <p className="res-trend">+5 iniciativas</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="resumen-card">
                <p className="res-title">Propuestas activas</p>
                <h3 className="res-number">19</h3>
                <p className="res-trend">1,710 votos</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="resumen-card">
                <p className="res-title">Eventos realizados</p>
                <h3 className="res-number">10</h3>
                <p className="res-trend">+3 vs mes anterior</p>
              </div>
            </IonCol>
          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;