import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonCheckbox, IonLabel, IonItem } from '@ionic/react';
import { createOutline, bookmarkOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import EventoModal from '../../components/EventoModal';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../ciudadano/Mapa.css'; // Compartimos estilos del mapa Ciudadano

import { useEventos } from '../../hooks/useEventos';
import { EventoCultural } from '../../types';

// Configuración de los íconos de Leaflet para que funcionen correctamente en el mapa dentro del modal
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 15, { animate: true, duration: 1 });
  }, [lat, lng, map]);
  return null;
};

const MapResizer = () => {
  const map = useMap();
  useEffect(() => {
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

// Página principal del gestor para visualizar y administrar eventos culturales en un mapa interactivo. 
// Permite crear, editar y eliminar eventos, así como filtrar por capas (cultores, ferias, espacios patrimoniales) y ver detalles de cada evento al hacer clic en sus puntos del mapa. 
// Utiliza un modal para la creación y edición de eventos.
const AgendaMapaGestor: React.FC = () => {
  const { data: eventos = [], isLoading: loading } = useEventos();
  const [eventoActivo, setEventoActivo] = useState<any | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState<EventoCultural | null>(null);

  const [puntos, setPuntos] = useState<any[]>([]);

  // Capas del mapa: Permiten mostrar u ocultar eventos de la agenda según su tipo (cultores, ferias, espacios patrimoniales) para facilitar la visualización y gestión en el mapa.
  const [showCultores, setShowCultores] = useState(true);
  const [showFerias, setShowFerias] = useState(true);
  const [showEspacios, setShowEspacios] = useState(true);

  useEffect(() => {
    if (eventos.length > 0) {
      const mapeados = eventos.map((evt, index) => {
        const seed1 = Math.sin(index * 12) * 0.04;
        const seed2 = Math.cos(index * 12) * 0.04;
        
        const lat = -33.4489 + seed1;
        const lng = -70.6693 + seed2;
        
        let color = '#f97316'; // Naranja
        let icono = '📅';
        if (evt.tipo === 'patrimonio') { color = '#22c55e'; icono = '🏛️'; }
        if (evt.tipo === 'feria') { color = '#3b82f6'; icono = '🎪'; }
        
        return {
          ...evt,
          lat,
          lng,
          icono,
          color,
          lugar: evt.ubicacion || 'Centro',
          extra: evt.estado
        };
      });
      setPuntos(mapeados);
    }
  }, [eventos]);

  const puntosFiltrados = puntos.filter(p => {
    if (p.tipo === 'patrimonio' && !showEspacios) return false;
    if (p.tipo === 'feria' && !showFerias) return false;
    if (p.tipo !== 'patrimonio' && p.tipo !== 'feria' && !showCultores) return false;
    return true;
  });

  const handleNuevoEvento = () => {
    setEventoParaEditar(null);
    setModalOpen(true);
  };

  const handleEditarEvento = (evt: EventoCultural) => {
    setEventoParaEditar(evt);
    setModalOpen(true);
  };

  const formatTime = (date: any) => new Date(date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <IonPage>
      <GestorHeader />
      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          <GestorSidebar />

          <main className="gestor-main-content" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px', background: 'var(--app-bg)', borderBottom: '1px solid var(--app-border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontWeight: 'bold' }}>Gestión de Eventos y Territorio</h2>
              <button className="btn-nuevo-evento" onClick={handleNuevoEvento} style={{ background: 'var(--ion-color-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>+ Nuevo evento</button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <div className="mapa-layout" style={{ height: 'calc(100% - 73px)' }}>
                
                {/* ZONA DEL MAPA */}
                <div className={`mapa-canvas ${eventoActivo ? 'mapa-comprimido' : ''}`} style={{ position: 'relative', zIndex: 1, width: eventoActivo ? '60%' : '100%', transition: 'all 0.3s' }}>
                  <div className="capas-flotante" style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, background: 'var(--app-card-bg)', borderRadius: '12px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--app-text-color)' }}>Capas del mapa</h3>
                    <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                      <IonCheckbox slot="start" checked={showCultores} onIonChange={e => setShowCultores(e.detail.checked)} />
                      <div className="punto-color naranja" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f97316', marginRight: '10px' }}></div>
                      <IonLabel style={{ color: 'var(--app-text-color)' }}>Eventos / Cultores</IonLabel>
                    </IonItem>
                    <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                      <IonCheckbox slot="start" checked={showFerias} onIonChange={e => setShowFerias(e.detail.checked)} />
                      <div className="punto-color azul" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#3b82f6', marginRight: '10px' }}></div>
                      <IonLabel style={{ color: 'var(--app-text-color)' }}>Ferias</IonLabel>
                    </IonItem>
                    <IonItem lines="none" className="capa-item" style={{ '--background': 'transparent', '--min-height': '35px' }}>
                      <IonCheckbox slot="start" checked={showEspacios} onIonChange={e => setShowEspacios(e.detail.checked)} />
                      <div className="punto-color verde" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', marginRight: '10px' }}></div>
                      <IonLabel style={{ color: 'var(--app-text-color)' }}>Espacios patrimoniales</IonLabel>
                    </IonItem>
                  </div>

                  <MapContainer 
                    center={[-33.4489, -70.6693]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <MapResizer />
                    
                    {eventoActivo && <RecenterMap lat={eventoActivo.lat} lng={eventoActivo.lng} />}

                    {puntosFiltrados.map((punto) => (
                      <Marker 
                        key={punto.id} 
                        position={[punto.lat, punto.lng]}
                        icon={createCustomIcon(punto.icono, punto.color)}
                        eventHandlers={{
                          click: () => setEventoActivo(punto),
                        }}
                      />
                    ))}
                  </MapContainer>
                </div>

                {/* PANEL LATERAL DERECHO (Detalle) */}
                {eventoActivo && (
                  <div className="mapa-sidebar animate-slide-in" style={{ width: '40%', minWidth: '350px' }}>
                    <div className="sidebar-header-img" style={{ backgroundColor: eventoActivo.color }}>
                      <div className="img-placeholder-large" style={{ fontSize: '4rem' }}>{eventoActivo.icono}</div>
                    </div>
                    
                    <div className="sidebar-content">
                      <div className="info-principal">
                        <span className="badge-tipo" style={{ backgroundColor: 'white', color: eventoActivo.color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{eventoActivo.tipo}</span>
                        <div className="titulo-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{eventoActivo.titulo}</h2>
                        </div>
                        <p className="detalles-texto" style={{ color: 'var(--app-text-muted)', fontSize: '0.95rem', marginTop: '10px' }}>
                          {formatTime(eventoActivo.fechaInicio)} • {eventoActivo.lugar}
                        </p>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                          <button 
                            style={{ flex: 1, padding: '12px', background: 'var(--ion-color-primary)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => handleEditarEvento(eventoActivo)}
                          >
                            <IonIcon icon={createOutline} style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Editar
                          </button>
                          <button 
                            style={{ flex: 1, padding: '12px', border: '1px solid var(--app-border-color)', borderRadius: '8px', background: 'var(--app-bg)', color: 'var(--app-text-color)', fontWeight: 'bold', cursor: 'pointer' }}
                            onClick={() => setEventoActivo(null)}
                          >
                            Cerrar
                          </button>
                        </div>
                      </div>
                      
                      <div style={{ marginTop: '20px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '10px' }}>Estado actual</h3>
                        <p style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '6px', textTransform: 'capitalize' }}>
                          {eventoActivo.estado}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </IonContent>

      <EventoModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        eventoAEditar={eventoParaEditar} 
      />
    </IonPage>
  );
};

export default AgendaMapaGestor;
