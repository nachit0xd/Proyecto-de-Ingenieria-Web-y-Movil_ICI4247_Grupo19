import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { searchOutline, createOutline, chevronBackOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import EventoModal from '../../components/EventoModal';
import './AgendaMapa.css';

import { useEventos } from '../../hooks/useEventos';
import { EventoCultural } from '../../types';

// Componente principal de la página de Agenda Mapa para gestores municipales
// Muestra un mapa con eventos culturales geolocalizados y permite gestionar eventos desde una vista detallada
const AgendaMapaGestor: React.FC = () => {
  const { data: eventos = [], isLoading: loading } = useEventos();
  const [eventoActivo, setEventoActivo] = useState<EventoCultural | null>(null);
  
  // Estados para controlar el modal de creación/edición de eventos
  const [modalOpen, setModalOpen] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState<EventoCultural | null>(null);

  const handleNuevoEvento = () => {
    setEventoParaEditar(null);
    setModalOpen(true);
  };

  const handleEditarEvento = (evt: EventoCultural) => {
    setEventoParaEditar(evt);
    setModalOpen(true);
  };

  const getEventColor = (tipo: string) => {
    if (tipo === 'patrimonio') return '#22c55e'; // Verde: patrimonio
    if (tipo === 'feria') return '#3b82f6'; // Azul: feria
    return '#f97316'; // Naranja: cultores y otros eventos
  };

  const getPosition = (index: number) => {
    const positions = [
      { top: '30%', left: '35%' },
      { top: '55%', left: '70%' },
      { top: '75%', left: '25%' },
      { top: '80%', left: '60%' },
      { top: '40%', left: '80%' }
    ];
    return positions[index % positions.length];
  };

  const formatTime = (date: any) => new Date(date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const formatDayName = (date: any) => new Date(date).toLocaleDateString('es-ES', { weekday: 'long' });

  const RenderMap = ({ enfocado }: { enfocado: boolean }) => (
    <div className={`gestor-mapa-canvas ${enfocado ? 'mapa-enfocado' : ''}`}>
      <div className="capas-flotante-gestor">
        <h4>Capas del mapa</h4>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-orange"></span> Cultores</label>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-blue"></span> Ferias</label>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-green"></span> Espacios patrimoniales</label>
      </div>

      {(enfocado && eventoActivo ? [eventoActivo] : eventos).map((evt, index) => {
        const pos = getPosition(index);
        return (
          <div 
            key={evt.id} 
            className="gestor-marcador"
            style={{ top: enfocado ? '50%' : pos.top, left: enfocado ? '50%' : pos.left }}
            onClick={() => setEventoActivo(evt)}
          >
            <div className="marcador-circulo-gestor" style={{ backgroundColor: getEventColor(evt.tipo) }}>
            </div>
            <div className="marcador-label-gestor">{evt.titulo}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <IonPage className="agenda-mapa-gestor-page">
      <GestorHeader />

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          <main className="gestor-main-content">
            <div className="agenda-mapa-header">
              <h2>Gestión de Eventos y Territorio</h2>
              <button className="btn-nuevo-evento" onClick={handleNuevoEvento}>+ Nuevo evento</button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <>
                {/* VISTA 1: BÚSQUEDA Y MAPA GENERAL */}
                {!eventoActivo && (
                  <div className="vista-general fade-in">
                    <RenderMap enfocado={false} />

                    <div className="agenda-toolbar">
                      <div className="search-box-container">
                        <IonIcon icon={searchOutline} className="search-icon-inside" />
                        <input type="text" placeholder="Buscar por nombre, fecha, palabra clave..." className="toolbar-search-input" />
                      </div>
                      <select className="toolbar-select">
                        <option>Todas las categorías</option>
                      </select>
                    </div>

                    <div className="eventos-grid">
                      {eventos.map(evt => (
                        <div className="evento-card-gestor outline-box" key={evt.id} onClick={() => setEventoActivo(evt)}>
                          <div className="evento-card-top">
                            <div className="evento-card-info">
                              <h3>{evt.titulo}</h3>
                              <p className="lugar">{evt.direccion || 'Sin dirección'}</p>
                              <p className="horario">{formatDayName(evt.fechaInicio)} • {formatTime(evt.fechaInicio)} - {formatTime(evt.fechaFin)}</p>
                            </div>
                            <span className={`badge-estado ${evt.estado === 'activo' ? 'badge-activo' : 'badge-finalizado'}`}>
                              {evt.estado}
                            </span>
                          </div>
                          <div className="evento-card-actions">
                            <button className="icon-btn-action" onClick={(e) => { e.stopPropagation(); handleEditarEvento(evt); }}>
                              <IonIcon icon={createOutline} />
                            </button>
                          </div>
                          <div className="evento-card-border" style={{ backgroundColor: getEventColor(evt.tipo) }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* VISTA 2: DETALLE DE EVENTO (Al hacer clic) */}
                {eventoActivo && (
                  <div className="vista-detalle fade-in">
                    <RenderMap enfocado={true} />

                    <button className="btn-volver-buscador" onClick={() => setEventoActivo(null)}>
                      <IonIcon icon={chevronBackOutline} /> Volver al buscador
                    </button>

                    <div className="detalle-card-grande outline-box">
                      <div className="detalle-borde-grueso" style={{ backgroundColor: getEventColor(eventoActivo.tipo) }}></div>
                      
                      <div className="detalle-contenido">
                        <div className="detalle-info-principal">
                          <h2>{eventoActivo.titulo}</h2>
                          <p className="lugar">{eventoActivo.direccion || 'Sin dirección'}</p>
                          <p className="horario">{formatDayName(eventoActivo.fechaInicio)} • {formatTime(eventoActivo.fechaInicio)} - {formatTime(eventoActivo.fechaFin)}</p>
                        </div>
                        
                        <div className="detalle-derecha">
                          <span className={`badge-estado ${eventoActivo.estado === 'activo' ? 'badge-activo' : 'badge-finalizado'}`}>
                            {eventoActivo.estado}
                          </span>
                          <div className="evento-card-actions mt-auto">
                            <button className="icon-btn-action" onClick={() => handleEditarEvento(eventoActivo)}>
                              <IonIcon icon={createOutline} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
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
