import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import './Comunidad.css';

import { comunidadService } from '../../services/comunidad.service';
import { PropuestaCiudadana } from '../../types';

// La página de comunidad muestra propuestas ciudadanas con diferentes estados y permite votar por ellas
const Comunidad: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('votadas');
  const [propuestas, setPropuestas] = useState<PropuestaCiudadana[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropuestas = async () => {
      setLoading(true);
      try {
        let data: PropuestaCiudadana[] = [];
        if (tabActiva === 'votadas') {
          data = await comunidadService.obtenerPropuestasPopulares();
        } else {
          data = await comunidadService.obtenerPropuestas();
        }
        setPropuestas(data);
      } catch (error) {
        console.error("Error loading propuestas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPropuestas();
  }, [tabActiva]);

  const timeAgo = (date: Date) => {
    const diff = new Date().getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `hace ${days} días`;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="comunidad-page">
        <div className="max-width-container ion-padding">
          
          <div className="comunidad-header-row">
            <h1>Propuestas ciudadanas</h1>
          </div>

          <div className="comunidad-tabs">
            <button className={`tab-btn ${tabActiva === 'votadas' ? 'active' : ''}`} onClick={() => setTabActiva('votadas')}>Más votadas</button>
            <button className={`tab-btn ${tabActiva === 'recientes' ? 'active' : ''}`} onClick={() => setTabActiva('recientes')}>Recientes</button>
            <button className={`tab-btn ${tabActiva === 'revision' ? 'active' : ''}`} onClick={() => setTabActiva('revision')}>En revisión</button>
            <button className={`tab-btn ${tabActiva === 'aprobadas' ? 'active' : ''}`} onClick={() => setTabActiva('aprobadas')}>Aprobadas</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="propuestas-lista">
              {propuestas.map(propuesta => (
                <div className="propuesta-item outline-box" key={propuesta.id}>
                  <div className="propuesta-item-header">
                    <div className="badges-group">
                      <span className="badge badge-blue">Idea</span>
                      <span className="badge badge-lightgreen">{propuesta.estado}</span>
                    </div>
                    <span className="votos-count">{propuesta.votos} votos</span>
                  </div>
                  <h2>{propuesta.titulo}</h2>
                  <p>{propuesta.descripcion}</p>
                  <div className="progress-container margin-bottom">
                    <div className="progress-bar orange-bar" style={{width: `${Math.min((propuesta.votos / 150) * 100, 100)}%`}}></div>
                  </div>
                  <div className="propuesta-item-footer">
                    <div className="footer-info">
                      <span>{propuesta.votos} / 150 votos para escalar a convocatoria</span>
                      <span>Por: {propuesta.idUsuario} • {timeAgo(propuesta.fechaCreacion)}</span>
                    </div>
                    <button className="btn-accion bg-lightgray">Votar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Comunidad;