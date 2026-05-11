import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCheckbox, IonItem, IonLabel, IonIcon
} from '@ionic/react';
import { bookmarkOutline, locationOutline } from 'ionicons/icons';
import Header from '../../components/Header';
import './Mapa.css';

// Simulamos una base de datos de puntos en el mapa
const PUNTOS_MOCK = [
  {
    id: 1,
    tipo: 'Feria',
    titulo: 'Feria artesanal del centro',
    top: '35%',
    left: '60%',
    icono: '🎪',
    color: '#1e3a8a', // Azul
    horario: 'Sábados 09:00-14:00',
    lugar: 'Plaza Central',
    extra: '32 expositores locales'
  },
  {
    id: 2,
    tipo: 'Cultor',
    titulo: 'Alfarería de greda',
    top: '70%',
    left: '45%',
    icono: '🏺',
    color: '#d97706', // Naranja
    horario: 'Lunes a Viernes',
    lugar: 'Taller San José',
    extra: 'Venta directa'
  },
  {
    id: 3,
    tipo: 'Expresión',
    titulo: 'Música folclórica',
    top: '25%',
    left: '15%',
    icono: '🎻',
    color: '#d97706', // Naranja
    horario: 'Domingos 16:00',
    lugar: 'Anfiteatro',
    extra: 'Abierto a todo público'
  }
];

const Mapa: React.FC = () => {
  // Estado para controlar qué punto está clickeado
  const [puntoActivo, setPuntoActivo] = useState<any | null>(null);

  return (
    <IonPage>
      <Header />
      
      {/* scrollY={false} evita que la página haga scroll, el mapa debe ocupar el 100% */}
      <IonContent fullscreen className="mapa-page" scrollY={false}>
        
        <div className="mapa-layout">
          
          {/* ZONA DEL MAPA (Izquierda / Centro) */}
          <div className={`mapa-canvas ${puntoActivo ? 'mapa-comprimido' : ''}`}>
            
            {/* Panel Flotante de Capas */}
            <div className="capas-flotante">
              <h3>Capas del mapa</h3>
              <IonItem lines="none" className="capa-item">
                <IonCheckbox slot="start" checked />
                <div className="punto-color naranja"></div>
                <IonLabel>Cultores</IonLabel>
              </IonItem>
              <IonItem lines="none" className="capa-item">
                <IonCheckbox slot="start" checked />
                <div className="punto-color azul"></div>
                <IonLabel>Ferias</IonLabel>
              </IonItem>
              <IonItem lines="none" className="capa-item">
                <IonCheckbox slot="start" checked />
                <div className="punto-color verde"></div>
                <IonLabel>Espacios patrimoniales</IonLabel>
              </IonItem>
            </div>

            {/* Marcadores Simulados */}
            {PUNTOS_MOCK.map((punto) => (
              <div 
                key={punto.id}
                className={`marcador-mapa ${puntoActivo?.id === punto.id ? 'marcador-activo' : ''}`}
                style={{ top: punto.top, left: punto.left }}
                onClick={() => setPuntoActivo(punto)}
              >
                <div className="marcador-circulo" style={{ backgroundColor: punto.color }}>
                  {punto.icono}
                </div>
                <div className="marcador-etiqueta">{punto.titulo}</div>
              </div>
            ))}
          </div>

          {/* PANEL LATERAL DERECHO (Detalle) */}
          {puntoActivo && (
            <div className="mapa-sidebar animate-slide-in">
              <div className="sidebar-header-img">
                <div className="img-placeholder-large">{puntoActivo.icono}</div>
              </div>
              
              <div className="sidebar-content">
                <div className="info-principal">
                  <span className="badge-tipo">{puntoActivo.tipo}</span>
                  <div className="titulo-row">
                    <h2>{puntoActivo.titulo}</h2>
                    <IonIcon icon={bookmarkOutline} className="icon-save" />
                  </div>
                  <p className="detalles-texto">
                    {puntoActivo.horario} • {puntoActivo.lugar} • {puntoActivo.extra}
                  </p>
                  
                  <button className="btn-outline-white">Ver ficha completa</button>
                </div>

                <div className="seccion-cercanos">
                  <h3>Cercanos a este punto</h3>
                  
                  {/* Ejemplo de item cercano */}
                  <div className="cercano-item">
                    <div className="cercano-icon">🏺</div>
                    <div className="cercano-info">
                      <span className="cercano-cat">Cultor • 400m</span>
                      <h4>Alfarería de greda</h4>
                    </div>
                  </div>
                  
                  <div className="cercano-item">
                    <div className="cercano-icon">🎻</div>
                    <div className="cercano-info">
                      <span className="cercano-cat">Cultor • 800m</span>
                      <h4>Música folclórica</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón Inferior para cerrar el panel */}
              <div className="sidebar-footer">
                <button 
                  className="btn-volver"
                  onClick={() => setPuntoActivo(null)}
                >
                  Volver a explorar
                </button>
              </div>
            </div>
          )}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Mapa;