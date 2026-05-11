import React from 'react';
import { 
  IonContent, IonPage, IonGrid, IonRow, IonCol 
} from '@ionic/react';
import Header from '../../components/Header';
import './Transparencia.css';

const Transparencia: React.FC = () => {
  return (
    <IonPage>
      <Header />
      
      <IonContent fullscreen className="transparencia-page">
        <IonGrid className="max-width-container ion-padding">
          
          {/* ENCABEZADO */}
          <IonRow className="margin-bottom-large">
            <IonCol size="12">
              <h1 className="page-title">Panel de transparencia cultural</h1>
              <p className="page-subtitle">Indicadores actualizados al 22 de junio 2026 • Período: Ene - Jun 2026</p>
            </IonCol>
          </IonRow>

          {/* TARJETAS DE MÉTRICAS (KPIs) */}
          <IonRow className="margin-bottom-large">
            <IonCol size="6" sizeMd="3">
              <div className="kpi-card">
                <p className="kpi-title">Fichas publicadas</p>
                <h3 className="kpi-number">23</h3>
                <p className="kpi-trend">+4 este mes</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="kpi-card">
                <p className="kpi-title">Fondos adjudicados</p>
                <h3 className="kpi-number">$3.2M</h3>
                <p className="kpi-trend">+5 iniciativas</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="kpi-card">
                <p className="kpi-title">Propuestas activas</p>
                <h3 className="kpi-number">19</h3>
                <p className="kpi-trend">1.710 votos totales</p>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="kpi-card">
                <p className="kpi-title">Eventos realizados</p>
                <h3 className="kpi-number">10</h3>
                <p className="kpi-trend">+3 vs mes anterior</p>
              </div>
            </IonCol>
          </IonRow>

          {/* GRÁFICOS Y ACTUALIZACIONES */}
          <IonRow>
            {/* Columna Izquierda: Gráficos */}
            <IonCol size="12" sizeMd="6" className="charts-column">
              
              {/* Gráfico de Barras */}
              <div className="chart-box outline-box">
                <h3 className="box-title">Postulaciones por mes</h3>
                <div className="bar-chart-container">
                  <div className="bar-item">
                    <div className="bar bar-color-blue" style={{ height: '80%' }}></div>
                    <span>Feb</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-color-blue" style={{ height: '20%' }}></div>
                    <span>Mar</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-color-blue" style={{ height: '60%' }}></div>
                    <span>Abr</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-color-blue" style={{ height: '45%' }}></div>
                    <span>May</span>
                  </div>
                  <div className="bar-item">
                    {/* El mes actual destaca en naranja */}
                    <div className="bar bar-color-orange" style={{ height: '90%' }}></div>
                    <span>Jun</span>
                  </div>
                </div>
              </div>

              {/* Gráfico Circular (Pie Chart) */}
              <div className="chart-box outline-box margin-top">
                <h3 className="box-title">Distribución por categoría</h3>
                <div className="pie-chart-container">
                  <div className="pie-legend">
                    <div className="legend-item"><span className="dot dot-blue"></span>Ferias (25%)</div>
                    <div className="legend-item"><span className="dot dot-green"></span>Patrimonio (15%)</div>
                    <div className="legend-item"><span className="dot dot-orange"></span>Cultores (35%)</div>
                    <div className="legend-item"><span className="dot dot-yellow"></span>Expresiones (17%)</div>
                    <div className="legend-item"><span className="dot dot-beige"></span>Otros (8%)</div>
                  </div>
                  <div className="pie-chart"></div>
                </div>
              </div>

            </IonCol>

            {/* Columna Derecha: Actualizaciones */}
            <IonCol size="12" sizeMd="6">
              <div className="updates-box outline-box h-100">
                <h3 className="box-title">Últimas actualizaciones municipales</h3>
                
                <div className="updates-list">
                  <div className="update-item">
                    <span className="dot dot-yellow margin-right"></span>
                    <p>Fondo Cultural de Artes 2026: resultados y proyectos aprobados</p>
                  </div>
                  <div className="update-item">
                    <span className="dot dot-orange margin-right"></span>
                    <p>11 nuevas fichas agregadas al catálogo patrimonial</p>
                  </div>
                  <div className="update-item border-none">
                    <span className="dot dot-blue margin-right"></span>
                    <p>Propuesta "Feria de ropa" escalada a convocatoria de fondos</p>
                  </div>
                </div>
              </div>
            </IonCol>

          </IonRow>

        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Transparencia;