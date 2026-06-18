import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonCheckbox, IonItem, IonLabel, IonIcon, IonToast
} from '@ionic/react';
import { bookmarkOutline, bookmark } from 'ionicons/icons';
import { useFichasPatrimonio } from '../../hooks/usePatrimonio';
import { useEventos } from '../../hooks/useEventos';
import FichaModal from '../../components/FichaModal';
import { FichaPatrimonio } from '../../types/patrimonio';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Mapa.css';

// Configuración de los íconos de Leaflet para que funcionen correctamente en el mapa
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { animate: true, duration: 1 });
    setTimeout(() => map.invalidateSize(), 300);
  }, [lat, lng, map]);
  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
    // Invalida el tamaño luego de que el DOM se haya renderizado para evitar tiles grises
    setTimeout(() => map.invalidateSize(), 250);
  }, [map]);
  return null;
};

const createCustomIcon = (emoji: string, color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">${emoji}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

// Componente principal del mapa, que muestra fichas de patrimonio y eventos culturales como puntos interactivos. Permite filtrar por capas y guardar eventos favoritos.
const Mapa: React.FC = () => {
  const { data: fichas = [] } = useFichasPatrimonio();
  const { data: eventos = [] } = useEventos();
  
  const [puntos, setPuntos] = useState<any[]>([]);

  useEffect(() => {
    let mapeados: any[] = [];
    if (fichas.length > 0) {
      const mapeadosFichas = fichas.map((ficha, index) => {
        const seed1 = Math.sin(index * 10) * 0.04;
        const seed2 = Math.cos(index * 10) * 0.04;
        const lat = -33.4489 + seed1;
        const lng = -70.6693 + seed2;
        
        let color = '#1e3a8a'; // Azul
        let icono = '📍';
        if (ficha.categoria === 'cultor') { color = '#d97706'; icono = '🏺'; }
        if (ficha.categoria === 'expresion') { color = '#047857'; icono = '🎻'; }
        if (ficha.categoria === 'oficio') { color = '#be185d'; icono = '✂️'; }
        
        return {
          id: ficha.id,
          tipo: ficha.categoria,
          titulo: ficha.nombre,
          lat, lng, icono, color,
          lugar: ficha.ubicacion?.direccion || 'Centro',
          extra: ficha.estado,
          fichaOriginal: ficha,
          isEvento: false
        };
      });
      mapeados = [...mapeados, ...mapeadosFichas];
    }

    // Se mapean los eventos culturales de la agenda, aplicando un pequeño desplazamiento aleatorio para evitar solapamientos y asignando íconos y colores según su tipo.
    if (eventos.length > 0) {
      const mapeadosEventos = eventos.map((evt, index) => {
        const seed1 = Math.sin(index * 12) * 0.04;
        const seed2 = Math.cos(index * 12) * 0.04;
        const lat = evt.lat || (-33.4489 + seed1);
        const lng = evt.lng || (-70.6693 + seed2);
        
        let color = '#f97316';
        let icono = '📅';
        if (evt.tipo === 'patrimonio') { color = '#22c55e'; icono = '🏛️'; }
        if (evt.tipo === 'feria') { color = '#3b82f6'; icono = '🎪'; }

        return {
          id: evt.id,
          tipo: 'evento',
          titulo: evt.titulo,
          lat, lng, icono, color,
          lugar: evt.direccion || 'Centro',
          extra: evt.estado,
          eventoOriginal: evt,
          isEvento: true
        };
      });
      mapeados = [...mapeados, ...mapeadosEventos];
    }
    
    setPuntos(mapeados);
  }, [fichas, eventos]);

  const [puntoActivo, setPuntoActivo] = useState<any | null>(null);
  const [selectedFicha, setSelectedFicha] = useState<FichaPatrimonio | null>(null);

  // Filtros de capas: Permiten mostrar u ocultar cultores, ferias, espacios patrimoniales y eventos de agenda en el mapa.
  const [showCultores, setShowCultores] = useState(true);
  const [showFerias, setShowFerias] = useState(true);
  const [showEspacios, setShowEspacios] = useState(true);
  const [showEventos, setShowEventos] = useState(true);

  // Favoritos: Permite a los usuarios guardar eventos de la agenda en su perfil (simulado con localStorage) y muestra un toast de confirmación.
  const [savedEvents, setSavedEvents] = useState<string[]>(() => {
    const saved = localStorage.getItem('saved_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const handleToggleSave = (eventoId: string) => {
    let newSaved = [...savedEvents];
    if (newSaved.includes(eventoId)) {
      newSaved = newSaved.filter(id => id !== eventoId);
      setToastMsg('Evento removido de tus guardados');
    } else {
      newSaved.push(eventoId);
      setToastMsg('Evento guardado en tu perfil');
    }
    setSavedEvents(newSaved);
    localStorage.setItem('saved_events', JSON.stringify(newSaved));
    setShowToast(true);
  };

  const puntosFiltrados = puntos.filter(p => {
    if (p.tipo === 'cultor' && !showCultores) return false;
    if (p.tipo === 'oficio' && !showFerias) return false;
    if (p.tipo === 'expresion' && !showEspacios) return false;
    if (p.tipo === 'evento' && !showEventos) return false;
    return true;
  });

  return (
    <IonPage>
      <IonContent fullscreen className="mapa-page" scrollY={false}>
        <div className="mapa-layout">
          
          <div className={`mapa-canvas ${puntoActivo ? 'mapa-comprimido' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
            
            {/* Panel Flotante de Capas superpuesto al mapa */}
            <div className="capas-flotante" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, background: 'var(--app-card-bg)', borderRadius: '12px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--app-text-color)' }}>Capas del mapa</h3>
              <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                <IonCheckbox slot="start" checked={showCultores} onIonChange={e => setShowCultores(e.detail.checked)} />
                <div className="punto-color naranja" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#d97706', marginRight: '10px' }}></div>
                <IonLabel style={{ color: 'var(--app-text-color)' }}>Cultores</IonLabel>
              </IonItem>
              <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                <IonCheckbox slot="start" checked={showFerias} onIonChange={e => setShowFerias(e.detail.checked)} />
                <div className="punto-color azul" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1e3a8a', marginRight: '10px' }}></div>
                <IonLabel style={{ color: 'var(--app-text-color)' }}>Ferias / Oficios</IonLabel>
              </IonItem>
              <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                <IonCheckbox slot="start" checked={showEspacios} onIonChange={e => setShowEspacios(e.detail.checked)} />
                <div className="punto-color verde" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#047857', marginRight: '10px' }}></div>
                <IonLabel style={{ color: 'var(--app-text-color)' }}>Espacios patrimoniales</IonLabel>
              </IonItem>
              <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                <IonCheckbox slot="start" checked={showEventos} onIonChange={e => setShowEventos(e.detail.checked)} />
                <div className="punto-color naranja" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316', marginRight: '10px' }}></div>
                <IonLabel style={{ color: 'var(--app-text-color)' }}>Eventos de Agenda</IonLabel>
              </IonItem>
            </div>

            <MapContainer 
              center={[-33.4489, -70.6693]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              {/* TileLayer de OpenStreetMap*/}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapResizer />
              
              {puntoActivo && <RecenterMap lat={puntoActivo.lat} lng={puntoActivo.lng} />}

              {puntosFiltrados.map((punto) => (
                <Marker 
                  key={punto.id} 
                  position={[punto.lat, punto.lng]}
                  icon={createCustomIcon(punto.icono, punto.color)}
                  eventHandlers={{
                    click: () => {
                      setPuntoActivo(punto);
                    },
                  }}
                >
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* PANEL LATERAL DERECHO (Detalle) */}
          {puntoActivo && (
            <div className="mapa-sidebar animate-slide-in">
              <div className="sidebar-header-img">
                <div className="img-placeholder-large" style={{ fontSize: '4rem' }}>{puntoActivo.icono}</div>
              </div>
              
              <div className="sidebar-content">
                <div className="info-principal">
                  <span className="badge-tipo" style={{ backgroundColor: puntoActivo.color, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{puntoActivo.tipo}</span>
                  <div className="titulo-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{puntoActivo.titulo}</h2>
                    {puntoActivo.isEvento && (
                      <IonIcon 
                        icon={savedEvents.includes(puntoActivo.id) ? bookmark : bookmarkOutline} 
                        className="icon-save" 
                        onClick={() => handleToggleSave(puntoActivo.id)}
                        style={{ fontSize: '1.5rem', color: savedEvents.includes(puntoActivo.id) ? 'var(--ion-color-primary)' : 'var(--app-text-muted)', cursor: 'pointer' }} 
                      />
                    )}
                  </div>
                  <p className="detalles-texto" style={{ color: 'var(--app-text-muted)', fontSize: '0.95rem', marginTop: '10px' }}>
                    {puntoActivo.lugar} • {puntoActivo.extra}
                  </p>
                  
                  <button 
                    className="btn-outline-white" 
                    onClick={() => setSelectedFicha(puntoActivo.fichaOriginal as FichaPatrimonio)}
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--app-border-color)', borderRadius: '8px', background: 'var(--app-bg)', color: 'var(--app-text-color)', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}
                  >
                    Ver ficha completa
                  </button>
                </div>

                <div className="seccion-cercanos" style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' }}>Cercanos a este punto</h3>
                  
                  <div className="cercano-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                    <div className="cercano-icon" style={{ fontSize: '1.8rem', marginRight: '15px' }}>🏺</div>
                    <div className="cercano-info">
                      <span className="cercano-cat" style={{ color: 'var(--app-text-muted)', fontSize: '0.8rem' }}>Cultor • 400m</span>
                      <h4 style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: 'bold' }}>Alfarería de greda</h4>
                    </div>
                  </div>
                  
                  <div className="cercano-item" style={{ display: 'flex', alignItems: 'center', padding: '10px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                    <div className="cercano-icon" style={{ fontSize: '1.8rem', marginRight: '15px' }}>🎻</div>
                    <div className="cercano-info">
                      <span className="cercano-cat" style={{ color: 'var(--app-text-muted)', fontSize: '0.8rem' }}>Expresión • 800m</span>
                      <h4 style={{ margin: '2px 0 0 0', fontSize: '0.95rem', fontWeight: 'bold' }}>Música folclórica</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px' }}>
                <button 
                  className="btn-volver"
                  onClick={() => setPuntoActivo(null)}
                  style={{ width: '100%', padding: '15px', background: 'var(--ion-color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
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

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMsg}
        duration={2000}
        color="success"
      />
    </IonPage>
  );
};

export default Mapa;
