import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonSpinner, useIonToast } from '@ionic/react';
import { checkmarkCircleOutline } from 'ionicons/icons';
import './Comunidad.css';

import { usePropuestasPopulares, usePropuestasCiudadano, useVotarPropuesta } from '../../hooks/useComunidad';
import { PropuestaCiudadana } from '../../types';

// La página de comunidad muestra propuestas ciudadanas con diferentes estados y permite votar por ellas
const Comunidad: React.FC = () => {
  const [tabActiva, setTabActiva] = useState('votadas');
  const [votados, setVotados] = useState<string[]>([]);
  const [presentToast] = useIonToast();
  
  const { data: populares = [], isLoading: loadPopulares } = usePropuestasPopulares();
  const { data: todas = [], isLoading: loadTodas } = usePropuestasCiudadano();
  const { mutate: votar } = useVotarPropuesta();

  const loading = loadPopulares || loadTodas;

  let propuestas = todas;
  if (tabActiva === 'votadas') {
    propuestas = populares;
  } else if (tabActiva === 'revision') {
    propuestas = todas.filter(p => p.estado === 'en_revision');
  } else if (tabActiva === 'aprobadas') {
    propuestas = todas.filter(p => p.estado === 'aprobado');
  }

  const timeAgo = (date: Date) => {
    const diff = new Date().getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `hace ${days} días`;
  };

  // Maneja el voto por una propuesta, asegurándose de que el usuario no pueda votar más de una vez por la misma propuesta
  const handleVotar = (id: string) => {
    if (!votados.includes(id)) {
      votar(id);
      setVotados([...votados, id]);
      presentToast({
        message: '¡Voto registrado con éxito!',
        duration: 2500,
        color: 'success',
        icon: checkmarkCircleOutline,
        position: 'top'
      });
    }
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
              {propuestas.map(propuesta => {
                const yaVotado = votados.includes(propuesta.id);
                const totalVotos = yaVotado ? propuesta.votosTotales + 1 : propuesta.votosTotales;
                
                return (
                <div className="propuesta-item outline-box" key={propuesta.id}>
                  <div className="propuesta-item-header">
                    <div className="badges-group">
                      <span className="badge badge-blue">Idea</span>
                      <span className="badge badge-lightgreen">{propuesta.estado}</span>
                    </div>
                    <span className="votos-count">{totalVotos} votos</span>
                  </div>
                  <h2>{propuesta.titulo}</h2>
                  <p>{propuesta.descripcion}</p>
                  <div className="progress-container margin-bottom">
                    <div className="progress-bar orange-bar" style={{width: `${Math.min((totalVotos / 150) * 100, 100)}%`}}></div>
                  </div>
                  <div className="propuesta-item-footer">
                    <div className="footer-info">
                      <span>{totalVotos} / 150 votos para escalar a convocatoria</span>
                      <span>Por: {propuesta.idUsuario} • {timeAgo(propuesta.fechaCreacion)}</span>
                    </div>
                    <button 
                      className={`btn-accion ${yaVotado ? 'bg-green-success' : 'bg-lightgray'}`} 
                      onClick={() => handleVotar(propuesta.id)}
                      disabled={yaVotado}
                    >
                      {yaVotado ? 'Votado' : 'Votar'}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Comunidad;