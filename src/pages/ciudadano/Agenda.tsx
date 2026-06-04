import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonIcon, IonSpinner
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, bookmarkOutline } from 'ionicons/icons';
import './Agenda.css';

import { useEventos } from '../../hooks/useEventos';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const Agenda: React.FC = () => {
  const { data: eventos = [], isLoading: loading } = useEventos();

  // Fecha actual 
  const hoy = new Date();
  
  // Estado para el mes y año que estamos visualizando en el calendario
  const [viewDate, setViewDate] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  
  // Estado para el día seleccionado explícitamente por el usuario
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(viewYear, parseInt(e.target.value), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewDate(new Date(parseInt(e.target.value), viewMonth, 1));
  };

  // Cálculos para dibujar el calendario
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay(); 

  // Array para los "huecos" vacíos antes del primer día del mes
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  // Array de los días del mes actual
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isHoy = (dia: number) => {
    return hoy.getDate() === dia && hoy.getMonth() === viewMonth && hoy.getFullYear() === viewYear;
  };

  const isSelected = (dia: number) => {
    return selectedDate && selectedDate.getDate() === dia && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
  };

  const tieneEvento = (dia: number) => {
    return eventos.some(e => {
      const eDate = new Date(e.fechaInicio);
      return eDate.getDate() === dia && eDate.getMonth() === viewMonth && eDate.getFullYear() === viewYear;
    });
  };

  const handleSelectDay = (dia: number) => {
    // Si ya estaba seleccionado, lo deseleccionamos
    if (isSelected(dia)) {
      setSelectedDate(null);
    } else {
      setSelectedDate(new Date(viewYear, viewMonth, dia));
    }
  };

  const formatTime = (date: any) => new Date(date).toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const formatDay = (date: any) => new Date(date).getDate();
  const formatMonthShort = (date: any) => new Date(date).toLocaleString('es-ES', { month: 'short' }).toUpperCase();

  // Filtrado de la barra derecha
  let eventosMostrados = [];
  let sidebarTitle = '';

  if (selectedDate) {
    // Si hay un día seleccionado, mostrar solo los de ese día
    eventosMostrados = eventos.filter(e => {
      const eDate = new Date(e.fechaInicio);
      return eDate.getDate() === selectedDate.getDate() && 
             eDate.getMonth() === selectedDate.getMonth() && 
             eDate.getFullYear() === selectedDate.getFullYear();
    });
    sidebarTitle = `Eventos para el ${selectedDate.getDate()} de ${MESES[selectedDate.getMonth()]}`;
  } else {
    // Mostrar próximos eventos a partir de hoy, ordenados por fecha, limitando a 5
    eventosMostrados = [...eventos]
      .filter(e => new Date(e.fechaInicio).getTime() >= hoy.setHours(0,0,0,0))
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
      .slice(0, 5);
    sidebarTitle = 'Próximos eventos';
  }

  return (
    <IonPage>
      <IonContent fullscreen className="agenda-page">
        <div className="agenda-layout">
          
          {/* ZONA IZQUIERDA: CALENDARIO */}
          <div className="calendario-container">
            <h1 className="agenda-titulo">Agenda cultural</h1>
            
            <div className="calendario-card outline-box">
              <div className="calendario-header">
                <button className="nav-btn" onClick={handlePrevMonth}>
                  <IonIcon icon={chevronBackOutline} />
                </button>
                <div className="selectores-fecha">
                  <select className="fecha-select" value={viewMonth} onChange={handleMonthChange}>
                    {MESES.map((mes, index) => (
                      <option key={index} value={index}>{mes}</option>
                    ))}
                  </select>
                  <select className="fecha-select" value={viewYear} onChange={handleYearChange}>
                    {[viewYear - 1, viewYear, viewYear + 1, viewYear + 2].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <button className="nav-btn" onClick={handleNextMonth}>
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </div>

              <div className="dias-semana">
                <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span>
                <span>Ju</span><span>Vi</span><span>Sa</span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                  <IonSpinner name="crescent" />
                </div>
              ) : (
                <div className="dias-grilla">
                  {emptyDays.map(empty => (
                    <span key={`empty-${empty}`} className="dia-vacio"></span>
                  ))}

                  {daysArray.map(dia => {
                    let claseExtra = '';
                    if (isHoy(dia)) claseExtra += ' dia-hoy'; 
                    else if (tieneEvento(dia)) claseExtra += ' dia-con-evento'; 
                    
                    if (isSelected(dia)) claseExtra += ' dia-seleccionado'; 
                    
                    return (
                      <button 
                        key={dia} 
                        className={`dia-btn ${claseExtra}`}
                        onClick={() => handleSelectDay(dia)}
                      >
                        {dia}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ZONA DERECHA: BARRA LATERAL */}
          <div className="agenda-sidebar">
            <div className="sidebar-header-info">
              <h3 className="sidebar-subtitulo">{sidebarTitle}</h3>
              {selectedDate && (
                <button className="btn-clear-date" onClick={() => setSelectedDate(null)}>
                  Ver próximos eventos
                </button>
              )}
            </div>

            <div className="lista-eventos-sidebar">
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <IonSpinner name="crescent" color="light" />
                </div>
              ) : eventosMostrados.length === 0 ? (
                <div className="empty-state">
                  <p>No hay eventos agendados.</p>
                </div>
              ) : (
                eventosMostrados.map((evento, idx) => (
                  <div className="evento-horizontal-card" key={evento.id || idx}>
                    <div className="evento-fecha-bloque bg-blue">
                      <span className="dia">{formatDay(evento.fechaInicio)}</span>
                      <span className="mes">{formatMonthShort(evento.fechaInicio)}</span>
                    </div>
                    <div className="evento-info-bloque">
                      <span className="categoria-texto color-orange">{evento.tipo}</span>
                      <h4>{evento.titulo}</h4>
                      <p>{formatTime(evento.fechaInicio)} - {formatTime(evento.fechaFin)} • {evento.direccion || 'Centro'}</p>
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
