import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import './Comunidad.css';

// La página de comunidad muestra propuestas ciudadanas con opciones para votar y ver detalles. También incluye un modal wizard para crear nuevas propuestas (PENDIENTE)
const Comunidad: React.FC = () => {
  // Estado para controlar las pestañas
  const [tabActiva] = useState('votadas');

  return (
    <IonPage>
      <IonContent fullscreen className="comunidad-page">
        <div className="max-width-container ion-padding">
          
          <div className="comunidad-header-row">
            <h1>Propuestas ciudadanas</h1>
          </div>

          <div className="comunidad-tabs">
            <button className="tab-btn active">Más votadas</button>
            <button className="tab-btn">Recientes</button>
            <button className="tab-btn">En revisión</button>
            <button className="tab-btn">Aprobadas</button>
          </div>

          <div className="propuestas-lista">
            <div className="propuesta-item outline-box">
              <div className="propuesta-item-header">
                <div className="badges-group">
                  <span className="badge badge-blue">Feria</span>
                  <span className="badge badge-lightgreen">Activo</span>
                </div>
                <span className="votos-count">122 votos</span>
              </div>
              <h2>Feria de ropa en Parque Central</h2>
              <p>Propongo realizar una feria semanal donde locatarios y artesanos puedan ofrecer todo tipo de ropa, desde usada hasta fabricada artesanalmente.</p>
              <div className="progress-container margin-bottom">
                <div className="progress-bar orange-bar" style={{width: '81%'}}></div>
              </div>
              <div className="propuesta-item-footer">
                <div className="footer-info">
                  <span>122 / 150 votos para escalar a convocatoria</span>
                  <span>Por: María Soto • hace 4 días</span>
                </div>
                <button className="btn-accion bg-lightgray">Votar</button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Comunidad;