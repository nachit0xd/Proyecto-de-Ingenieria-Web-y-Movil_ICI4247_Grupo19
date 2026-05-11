import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonIcon 
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, bookmarkOutline } from 'ionicons/icons';
import Header from '../../components/Header';
import './Agenda.css';

// Base de datos simulada de eventos para este mes
const EVENTOS_MES = [
  {
    id: 1,
    dia: 25,
    mes: 'JUN',
    categoria: 'Feria artesanal',
    titulo: 'Feria del libro usado',
    horario: '12:00-18:00',
    lugar: 'Parque Libertad'
  }
];

const Agenda: React.FC = () => {
  // Estado para saber qué día pinchó el usuario (iniciamos en el 13 como en tu imagen)
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(13);

  // Filtramos si hay eventos para el día seleccionado
  const eventosDelDia = EVENTOS_MES.filter(evento => evento.dia === diaSeleccionado);
  
  // Filtramos eventos futuros desde el día seleccionado
  const proximosEventos = EVENTOS_MES.filter(evento => evento.dia >= diaSeleccionado);

  // Generamos un array del 1 al 30 para pintar los días (simplificado para el prototipo)
  const diasDelMes = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <IonPage>
      <Header />
      
      <IonContent fullscreen className="agenda-page">
        <div className="agenda-layout">
          
          {/* ZONA IZQUIERDA: CALENDARIO */}
          <div className="calendario-container">
            <h1 className="agenda-titulo">Agenda cultural</h1>
            
            <div className="calendario-card outline-box">
              {/* Controles del mes */}
              <div className="calendario-header">
                <IonIcon icon={chevronBackOutline} className="nav-icon" />
                <div className="selectores-fecha">
                  <select className="fecha-select" defaultValue="junio">
                    <option value="junio">Junio</option>
                    <option value="julio">Julio</option>
                  </select>
                  <select className="fecha-select" defaultValue="2026">
                    <option value="2026">2026</option>
                  </select>
                </div>
                <IonIcon icon={chevronForwardOutline} className="nav-icon" />
              </div>

              {/* Días de la semana */}
              <div className="dias-semana">
                <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span>
                <span>Ju</span><span>Vi</span><span>Sa</span>
              </div>

              {/* Grilla numérica del mes */}
              <div className="dias-grilla">
                {/* Días vacíos previos */}
                <span className="dia-vacio"></span>

                {diasDelMes.map(dia => {
                  // Lógica para asignar clases CSS dependiendo del día
                  let claseExtra = '';
                  if (dia === 9) claseExtra = 'dia-hoy'; // Naranja
                  else if (dia === 13 || dia === 25) claseExtra = 'dia-con-evento'; // Azul
                  
                  if (dia === diaSeleccionado) claseExtra += ' dia-seleccionado'; // Contorno
                  
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

                {/* Días grises del próximo mes */}
                <span className="dia-vacio">1</span>
                <span className="dia-vacio">2</span>
                <span className="dia-vacio">3</span>
                <span className="dia-vacio">4</span>
              </div>
            </div>
          </div>

          {/* ZONA DERECHA: BARRA LATERAL (Detalle) */}
          <div className="agenda-sidebar">
            
            {/* Sección 1: Eventos del día seleccionado */}
            <div className="eventos-dia-zona">
              {eventosDelDia.length === 0 ? (
                <div className="empty-state">
                  <h3>No hay eventos agendados para este día</h3>
                </div>
              ) : (
                <div className="lista-eventos-dia">
                  <h3>Eventos para hoy</h3>
                  {eventosDelDia.map(evento => (
                    <div className="evento-horizontal-card" key={`hoy-${evento.id}`}>
                      {/* Reutilizamos el estilo de tarjeta del diseño */}
                      <div className="evento-fecha-bloque">
                        <span className="dia">{evento.dia}</span>
                        <span className="mes">{evento.mes}</span>
                      </div>
                      <div className="evento-info-bloque">
                        <span className="categoria-texto color-orange">{evento.categoria}</span>
                        <h4>{evento.titulo}</h4>
                        <p>{evento.horario} • {evento.lugar}</p>
                      </div>
                      <IonIcon icon={bookmarkOutline} className="bookmark-icon" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="divisor-sidebar"></div>

            {/* Sección 2: Próximos Eventos */}
            <div className="proximos-eventos-zona">
              <h3 className="sidebar-subtitulo">Próximos eventos</h3>
              
              <div className="evento-horizontal-card">
                <div className="evento-fecha-bloque bg-blue">
                  <span className="dia">25</span>
                  <span className="mes">JUN</span>
                </div>
                <div className="evento-info-bloque">
                  <span className="categoria-texto color-orange">Feria artesanal</span>
                  <h4>Feria del libro usado</h4>
                  <p>12:00-18:00 • Parque Libertad</p>
                </div>
                <IonIcon icon={bookmarkOutline} className="bookmark-icon" />
              </div>

            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Agenda;