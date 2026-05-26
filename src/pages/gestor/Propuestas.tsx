import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonModal } from '@ionic/react';
import { personCircleOutline, documentTextOutline, alertCircleOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ActionButton from '../../components/ui/ActionButton';
import './Propuestas.css';

import { usePropuestasGestor } from '../../hooks/useComunidad';
import { PropuestaComunidadGestor } from '../../services/comunidad.service';

// Componente principal de la página de Propuestas para gestores municipales
// Muestra una lista de propuestas culturales enviadas por la comunidad, permite filtrarlas por estado y tomar acciones de aprobación, rechazo o revisión con un modal de confirmación
const PropuestasGestor: React.FC = () => {
  const { data = [], isLoading: loading } = usePropuestasGestor();
  const [filtro, setFiltro] = useState<string>('todas');
  const [propuestaActiva, setPropuestaActiva] = useState<PropuestaComunidadGestor | null>(null);
  const [propuestasState, setPropuestasState] = useState<PropuestaComunidadGestor[]>([]);

  useEffect(() => {
    if (data.length > 0) {
      setPropuestasState(data);
    }
  }, [data]);

  // Modal State
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<string>('');

  const formatDate = (date: any) => {
    const diffTime = Math.abs(Date.now() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `hace ${diffDays} días`;
  };
  
  const formatDateAbsolute = (date: any) => {
    return new Date(date).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
  };

  const getStatusLabel = (estado: string) => {
    const map: any = {
      'pendiente': 'Pendiente',
      'en_revision': 'En revisión',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado'
    };
    return map[estado] || estado;
  };

  const getBadgeVariant = (estado: string): BadgeVariant => {
    const map: Record<string, BadgeVariant> = {
      'pendiente': 'warning',
      'en_revision': 'info',
      'aprobado': 'success',
      'rechazado': 'danger'
    };
    return map[estado] || 'neutral';
  };

  const abrirModalConfirmacion = (accion: string) => {
    setAccionPendiente(accion);
    setMostrarModal(true);
  };

  const confirmarAccion = () => {
    if (propuestaActiva) {
      const updatedPropuesta = { ...propuestaActiva, estado: accionPendiente };
      setPropuestasState(propuestasState.map(p => p.id === propuestaActiva.id ? updatedPropuesta : p));
      setPropuestaActiva(updatedPropuesta);
    }
    setMostrarModal(false);
  };

  const propuestasFiltradas = propuestasState.filter(p => filtro === 'todas' || p.estado === filtro);

  return (
    <IonPage className="propuestas-gestor-page">
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
            <div className="master-detail-layout">
              
              {/* COLUMNA PRINCIPAL */}
              <div className="master-column">
                <div className="propuestas-header">
                  <h2>Gestión de Propuestas</h2>
                  <div className="propuestas-filters">
                    <button className={`filter-btn ${filtro === 'pendiente' ? 'active' : ''}`} onClick={() => setFiltro('pendiente')}>Pendientes</button>
                    <button className={`filter-btn ${filtro === 'en_revision' ? 'active' : ''}`} onClick={() => setFiltro('en_revision')}>En revisión</button>
                    <button className={`filter-btn ${filtro === 'aprobado' ? 'active' : ''}`} onClick={() => setFiltro('aprobado')}>Aprobadas</button>
                    <button className={`filter-btn ${filtro === 'rechazado' ? 'active' : ''}`} onClick={() => setFiltro('rechazado')}>Rechazadas</button>
                    <select className="sort-select">
                      <option>Más recientes</option>
                      <option>Más votadas</option>
                    </select>
                  </div>
                </div>

                <div className="propuestas-list">
                  {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}><IonSpinner name="crescent" /></div>
                  ) : (
                    propuestasFiltradas.map(prop => (
                      <div 
                        key={prop.id} 
                        className={`propuesta-card-mini status-${prop.estado} ${propuestaActiva?.id === prop.id ? 'active' : ''}`}
                        onClick={() => setPropuestaActiva(prop)}
                      >
                        <div className="prop-card-header">
                          <h3>{prop.titulo}</h3>
                          <Badge variant="primary">{prop.votos} votos</Badge>
                        </div>
                        <p className="prop-card-meta">{prop.categoria} • Por: {prop.autor}</p>
                        <div className="prop-card-footer">
                          <p>Publicado {formatDate(prop.fechaPublicacion)}</p>
                          <Badge variant={getBadgeVariant(prop.estado)}>{getStatusLabel(prop.estado)}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                  {!loading && propuestasFiltradas.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No hay propuestas para mostrar.</p>
                  )}
                </div>
              </div>

              {/* COLUMNA DE DETALLE */}
              <div className="detail-column">
                {propuestaActiva ? (
                  <div className="fade-in">
                    <div className="detail-header">
                      <h2>{propuestaActiva.titulo}</h2>
                      <div className="detail-meta">
                        <span>{propuestaActiva.autor}</span>
                        <span>•</span>
                        <span>{formatDateAbsolute(propuestaActiva.fechaPublicacion)}</span>
                        <span>•</span>
                        <span>{propuestaActiva.votos}/150 votos</span>
                      </div>
                    </div>

                    <div className="detail-section">
                      <h3>Descripción de la propuesta:</h3>
                      <p className="detail-desc">"{propuestaActiva.descripcion}"</p>
                    </div>

                    <div className="detail-section">
                      <h3>Acciones:</h3>
                      <div className="detail-actions">
                        <ActionButton variant="info" onClick={() => abrirModalConfirmacion('en_revision')}>En revisión</ActionButton>
                        <ActionButton variant="success" onClick={() => abrirModalConfirmacion('aprobado')}>Aprobar</ActionButton>
                        <ActionButton variant="danger" onClick={() => abrirModalConfirmacion('rechazado')}>Rechazar</ActionButton>
                      </div>
                    </div>

                    <div className="detail-section" style={{ borderBottom: 'none' }}>
                      <h3>Comentarios de gestor:</h3>
                      {propuestaActiva.comentariosGestor && propuestaActiva.comentariosGestor.length > 0 ? (
                        <div className="comments-list" style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {propuestaActiva.comentariosGestor.map((comentario: any, index: any) => (
                            <div key={index} className="comment-bubble" style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.9rem', color: '#334155' }}>
                              {comentario}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '14px' }}>No hay comentarios todavía.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="empty-detail fade-in">
                    <IonIcon icon={documentTextOutline} />
                    <h3>Selecciona una propuesta</h3>
                    <p>Haz clic en una propuesta de la lista para ver sus detalles y tomar acciones.</p>
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>

        <ConfirmModal
          isOpen={mostrarModal}
          title="Confirmar Acción"
          message={`¿Estás seguro que deseas cambiar el estado de esta propuesta a ${getStatusLabel(accionPendiente)}?`}
          confirmText="Confirmar"
          cancelText="Cancelar"
          onConfirm={confirmarAccion}
          onCancel={() => setMostrarModal(false)}
        />

      </IonContent>
    </IonPage>
  );
};

export default PropuestasGestor;
