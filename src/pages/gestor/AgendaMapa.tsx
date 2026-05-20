import React, { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { personCircleOutline, searchOutline, createOutline, trashOutline, chevronBackOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './AgendaMapa.css';

// La página de agenda y mapa del gestor municipal es el espacio donde los gestores pueden visualizar y administrar los eventos culturales que se están llevando a cabo en la ciudad, así como su ubicación geográfica en el mapa
// Aquí pueden ver un mapa interactivo con los eventos marcados, y al hacer clic en cada evento pueden acceder a su detalle para editar su información, cambiar su estado, o eliminarlo si ya no es relevante. 
// También hay una barra de búsqueda para filtrar eventos por nombre, fecha, o categoría, y opciones para crear nuevos eventos directamente desde esta sección.

// Base de datos simulada de eventos
const EVENTOS_MOCK = [
  { 
    id: 1, titulo: 'Mural artístico', lugar: 'Parque Norte', 
    horario: 'Todo el día', estado: 'Activo', tipo: 'patrimonio', 
    top: '30%', left: '35%', color: '#4d8000', icono: '🎨' 
  },
  { 
    id: 2, titulo: 'Feria del libro usado', lugar: 'Plaza Municipal', 
    horario: 'Lunes a viernes • 10:00 - 18:00', estado: 'Finalizado', tipo: 'feria', 
    top: '55%', left: '70%', color: '#0000a0', icono: '🎪' 
  },
  { 
    id: 3, titulo: 'Clases de Escritura', lugar: 'Sala N°4 Centro Recreacional', 
    horario: 'Martes y jueves • 16:00 - 17:30', estado: 'Finalizado', tipo: 'cultor', 
    top: '75%', left: '25%', color: '#e37e33', icono: '✍️' 
  },
  { 
    id: 4, titulo: 'Mural artístico', lugar: 'Parque Norte', 
    horario: 'Todo el día', estado: 'Activo', tipo: 'patrimonio', 
    top: '80%', left: '60%', color: '#4d8000', icono: '🎨' 
  }
];

const AgendaMapaGestor: React.FC = () => {
  const [eventoActivo, setEventoActivo] = useState<any | null>(null);

  // Componente interno para re-utilizar el renderizado del mapa
  const RenderMap = ({ enfocado }: { enfocado: boolean }) => (
    <div className={`gestor-mapa-canvas ${enfocado ? 'mapa-enfocado' : ''}`}>
      <div className="capas-flotante-gestor">
        <h4>Capas del mapa</h4>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-orange"></span> Cultores</label>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-blue"></span> Ferias</label>
        <label><input type="checkbox" defaultChecked /> <span className="dot dot-green"></span> Espacios patrimoniales</label>
      </div>

      {(enfocado ? [eventoActivo] : EVENTOS_MOCK).map((evt) => (
        <div 
          key={evt.id} 
          className="gestor-marcador"
          style={{ top: enfocado ? '50%' : evt.top, left: enfocado ? '50%' : evt.left }}
          onClick={() => setEventoActivo(evt)}
        >
          <div className="marcador-circulo-gestor" style={{ backgroundColor: evt.color }}>
          </div>
          <div className="marcador-label-gestor">{evt.titulo}</div>
        </div>
      ))}
    </div>
  );

  return (
    <IonPage>
      <header className="gestor-header">
        <div className="gestor-brand">
          <h1>Cultura Municipal</h1>
          <span className="gestor-role-badge">Gestor Municipal</span>
        </div>
        <div className="gestor-user-menu">
          <IonIcon icon={personCircleOutline} className="avatar-icon" />
        </div>
      </header>

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          
          <GestorSidebar />

          <main className="gestor-main-content">
            <div className="agenda-mapa-header">
              <h2>Gestión de Eventos y Territorio</h2>
              <button className="btn-nuevo-evento">+ Nuevo evento</button>
            </div>

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
                  {EVENTOS_MOCK.map(evt => (
                    <div className="evento-card-gestor outline-box" key={evt.id} onClick={() => setEventoActivo(evt)}>
                      <div className="evento-card-top">
                        <div className="evento-card-info">
                          <h3>{evt.titulo}</h3>
                          <p className="lugar">{evt.lugar}</p>
                          <p className="horario">{evt.horario}</p>
                        </div>
                        <span className={`badge-estado ${evt.estado === 'Activo' ? 'badge-activo' : 'badge-finalizado'}`}>
                          {evt.estado}
                        </span>
                      </div>
                      <div className="evento-card-actions">
                        <button className="icon-btn-action" onClick={(e) => e.stopPropagation()}><IonIcon icon={createOutline} /></button>
                        <button className="icon-btn-action" onClick={(e) => e.stopPropagation()}><IonIcon icon={trashOutline} /></button>
                      </div>
                      <div className="evento-card-border" style={{ backgroundColor: evt.color }}></div>
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
                  <div className="detalle-borde-grueso" style={{ backgroundColor: eventoActivo.color }}></div>
                  
                  <div className="detalle-contenido">
                    <div className="detalle-info-principal">
                      <h2>{eventoActivo.titulo}</h2>
                      <p className="lugar">{eventoActivo.lugar}</p>
                      <p className="horario">{eventoActivo.horario}</p>
                    </div>
                    
                    <div className="detalle-derecha">
                      <span className={`badge-estado ${eventoActivo.estado === 'Activo' ? 'badge-activo' : 'badge-finalizado'}`}>
                        {eventoActivo.estado}
                      </span>
                      <div className="evento-card-actions mt-auto">
                        <button className="icon-btn-action"><IonIcon icon={createOutline} /></button>
                        <button className="icon-btn-action"><IonIcon icon={trashOutline} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AgendaMapaGestor;