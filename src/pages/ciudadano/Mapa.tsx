import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonCheckbox, IonItem, IonLabel, IonIcon
} from '@ionic/react';
import { bookmarkOutline } from 'ionicons/icons';
import { useFichasPatrimonio } from '../../hooks/usePatrimonio';
import FichaModal from '../../components/FichaModal';
import { FichaPatrimonio } from '../../types/patrimonio';
import './Mapa.css';

// La página del mapa ciudadano muestra un mapa interactivo con puntos de interés cultural
// Al hacer clic en un punto, se despliega un panel lateral con detalles y opciones relacionadas
// También incluye un panel flotante para controlar las capas del mapa (ferias, cultores, espacios patrimoniales) (PENDIENTE)

const Mapa: React.FC = () => {
  const { data: fichas = [] } = useFichasPatrimonio();
  
  // Mapeamos fichas reales a puntos de mapa (coordenadas ficticias por el momento) y asignamos colores e íconos según categoría
  const [puntos, setPuntos] = useState<any[]>([]);

  React.useEffect(() => {
    if (fichas.length > 0) {
      const mapeados = fichas.map((ficha) => {
        // Coordenadas ficticias 
        const randomTop = Math.floor(Math.random() * 60 + 20) + '%';
        const randomLeft = Math.floor(Math.random() * 60 + 20) + '%';
        
        let color = '#1e3a8a';
        let icono = '📍';
        if (ficha.categoria === 'cultor') { color = '#d97706'; icono = '🏺'; }
        if (ficha.categoria === 'expresion') { color = '#047857'; icono = '🎻'; }
        if (ficha.categoria === 'oficio') { color = '#be185d'; icono = '✂️'; }
        
        return {
          id: ficha.id,
          tipo: ficha.categoria,
          titulo: ficha.nombre,
          top: randomTop,
          left: randomLeft,
          icono,
          color,
          lugar: ficha.ubicacion?.direccion || 'Centro',
          extra: ficha.estado,
          fichaOriginal: ficha // Referencia a la ficha original
        };
      });
      setPuntos(mapeados);
    }
  }, [fichas]);

  // Estado para controlar qué punto está clickeado
  const [puntoActivo, setPuntoActivo] = useState<any | null>(null);
  
  // Estado para el modal de vista rápida
  const [selectedFicha, setSelectedFicha] = useState<FichaPatrimonio | null>(null);

  return (
    <IonPage>
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

            {/* Marcadores */}
            {puntos.map((punto) => (
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
                  
                  <button 
                    className="btn-outline-white" 
                    onClick={() => setSelectedFicha(puntoActivo.fichaOriginal as FichaPatrimonio)}
                  >
                    Ver ficha completa
                  </button>
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

      <FichaModal 
        isOpen={!!selectedFicha} 
        onClose={() => setSelectedFicha(null)} 
        ficha={selectedFicha} 
      />
    </IonPage>
  );
};

export default Mapa;
