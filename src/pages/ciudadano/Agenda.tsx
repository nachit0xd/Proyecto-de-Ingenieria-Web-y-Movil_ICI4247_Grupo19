import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonPage, IonIcon, IonSpinner
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, bookmarkOutline } from 'ionicons/icons';
import './Agenda.css';

import { useEventos } from '../../hooks/useEventos';

// Página de agenda cultural que muestra una lista de eventos ordenados cronológicamente
const Agenda: React.FC = () => {
  const { data: eventos = [], isLoading: loading } = useEventos();

  const [filtroDia, setFiltroDia] = useState<number | null>(null);
  const [filtroMes, setFiltroMes] = useState<number | null>(null);
  
  // Por simplicidad, forzamos junio para el demo
  const [fechaActual] = useState(new Date('2024-06-13T12:00:00')); 
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(fechaActual.getDate());

  const formatDay = (date: any) => new Date(date).getDate();
  const formatMonth = (date: any) => new Date(date).toLocaleString('es-ES', { month: 'short' }).toUpperCase();
  const formatTime = (date: any) => new Date(date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });

  // Filtra si hay eventos para el día seleccionado (asumiendo que estamos en el mismo mes/año)
  const eventosOrdenados = [...eventos].sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
  const eventosFiltrados = eventosOrdenados.filter(evento => {
    const date = new Date(evento.fechaInicio);
    if (filtroDia && date.getDate() !== filtroDia) return false;
    if (filtroMes && date.getMonth() !== filtroMes) return false;
    return true;
  });

  const eventosDelDia = eventos.filter(evento => new Date(evento.fechaInicio).getDate() === diaSeleccionado);
  
  // Filtra eventos futuros a partir del día seleccionado
  const proximosEventos = eventos.filter(evento => new Date(evento.fechaInicio).getDate() >= diaSeleccionado);

  const diasDelMes = Array.from({ length: 30 }, (_, i) => i + 1);

  const tieneEvento = (dia: number) => eventos.some(e => new Date(e.fechaInicio).getDate() === dia);

  return (
    <IonPage>
      <IonContent fullscreen className="agenda-page">
        <div className="agenda-layout">
          
          {/* ZONA IZQUIERDA: CALENDARIO */}
          <div className="calendario-container">
            <h1 className="agenda-titulo">Agenda cultural</h1>
            
            <div className="calendario-card outline-box">
              <div className="calendario-header">
                <IonIcon icon={chevronBackOutline} className="nav-icon" />
                <div className="selectores-fecha">
                  <select className="fecha-select" defaultValue="junio">
                    <option value="junio">Junio</option>
                    <option value="julio">Julio</option>
                  </select>
                  <select className="fecha-select" defaultValue="2024">
                    <option value="2024">2024</option>
                  </select>
                </div>
                <IonIcon icon={chevronForwardOutline} className="nav-icon" />
              </div>

              <div className="dias-semana">
                <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span>
                <span>Ju</span><span>Vi</span><span>Sa</span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <div className="dias-grilla">
                  <span className="dia-vacio"></span>

                  {diasDelMes.map(dia => {
                    let claseExtra = '';
                    if (dia === fechaActual.getDate()) claseExtra = 'dia-hoy'; 
                    else if (tieneEvento(dia)) claseExtra = 'dia-con-evento'; 
                    
                    if (dia === diaSeleccionado) claseExtra += ' dia-seleccionado'; 
                    
                    return (
                      <button 
                        key={dia} 
                        className={`dia-btn ${claseExtra}`}
                        onClick={() => setDiaSeleccionado(dia)}
                      >
                        {dia}
                      </button>
                    );
                  })}

                  <span className="dia-vacio">1</span>
                  <span className="dia-vacio">2</span>
                  <span className="dia-vacio">3</span>
                  <span className="dia-vacio">4</span>
                </div>
              )}
            </div>
          </div>

          {/* ZONA DERECHA: BARRA LATERAL */}
          <div className="agenda-sidebar">
            
            <div className="eventos-dia-zona">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><IonSpinner name="crescent" /></div>
              ) : eventosDelDia.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay eventos agendados para este día</h3>
                </div>
              ) : (
                <div className="lista-eventos-dia">
                  <h3>Eventos para el día {diaSeleccionado}</h3>
                  {eventosDelDia.map(evento => (
                    <div className="evento-horizontal-card" key={evento.id}>
                      <div className="evento-fecha-bloque">
                        <span className="dia">{formatDay(evento.fechaInicio)}</span>
                        <span className="mes">{formatMonth(evento.fechaInicio)}</span>
                      </div>
                      <div className="evento-info-bloque">
                        <span className="categoria-texto color-orange">{evento.tipo}</span>
                        <h4>{evento.titulo}</h4>
                        <p>{formatTime(evento.fechaInicio)}-{formatTime(evento.fechaFin)} • {evento.ubicacion?.direccion || 'Sin ubicación'}</p>
                      </div>
                      <IonIcon icon={bookmarkOutline} className="bookmark-icon" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="divisor-sidebar"></div>

            <div className="proximos-eventos-zona">
              <h3 className="sidebar-subtitulo">Próximos eventos</h3>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><IonSpinner name="crescent" /></div>
              ) : proximosEventos.length === 0 ? (
                <div className="empty-state">
                  <p>No hay eventos futuros próximos.</p>
                </div>
              ) : (
                proximosEventos.slice(0,3).map(evento => (
                  <div className="evento-horizontal-card" key={`prox-${evento.id}`}>
                    <div className="evento-fecha-bloque bg-blue">
                      <span className="dia">{formatDay(evento.fechaInicio)}</span>
                      <span className="mes">{formatMonth(evento.fechaInicio)}</span>
                    </div>
                    <div className="evento-info-bloque">
                      <span className="categoria-texto color-orange">{evento.tipo}</span>
                      <h4>{evento.titulo}</h4>
                      <p>{formatTime(evento.fechaInicio)}-{formatTime(evento.fechaFin)} • {evento.ubicacion?.direccion}</p>
                    </div>
                    <IonIcon icon={bookmarkOutline} className="bookmark-icon" />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Agenda;