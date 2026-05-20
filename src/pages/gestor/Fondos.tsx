import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner, IonModal } from '@ionic/react';
import { personCircleOutline, documentTextOutline, searchOutline, createOutline, eyeOutline, trashOutline, alertCircleOutline, downloadOutline, chevronForwardOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import './Fondos.css';

import { fondosService, PostulacionFondoGestor } from '../../services/fondos.service';

// Componente principal de la página de Fondos para gestores municipales
// Permite gestionar postulaciones a fondos culturales, revisar detalles financieros y administrar convocatorias de fondos
const FondosGestor: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<'postulaciones' | 'convocatorias'>('postulaciones');
  
  const [postulaciones, setPostulaciones] = useState<PostulacionFondoGestor[]>([]);
  const [convocatorias, setConvocatorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroPostulacion, setFiltroPostulacion] = useState<string>('pendiente');
  const [postulacionActiva, setPostulacionActiva] = useState<PostulacionFondoGestor | null>(null);

  const [comentario, setComentario] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<string>('');
  const [errorValidacion, setErrorValidacion] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tabActiva === 'postulaciones') {
          const data = await fondosService.obtenerPostulacionesGestor();
          setPostulaciones(data);
        } else {
          const data = await fondosService.obtenerConvocatoriasGestor();
          setConvocatorias(data);
        }
      } catch (error) {
        console.error("Error fetching", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tabActiva]);

  const formatDateAbsolute = (date: Date) => {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/');
  };

  const getStatusLabel = (estado: string) => {
    const map: any = {
      'pendiente': 'Pendiente',
      'en_revision': 'En revisión',
      'aprobado': 'Aprobada',
      'rechazado': 'Rechazada',
      'requiere_ajuste': 'Requiere ajuste'
    };
    return map[estado] || estado;
  };

  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString('es-CL');
  };

  const abrirModalConfirmacion = (accion: string) => {
    if ((accion === 'requiere_ajuste' || accion === 'rechazado') && !comentario.trim()) {
      setErrorValidacion('Debe ingresar un comentario para solicitar corrección o rechazar.');
      return;
    }
    setErrorValidacion('');
    setAccionPendiente(accion);
    setMostrarModal(true);
  };

  const confirmarAccion = () => {
    if (postulacionActiva) {
      const updated = { ...postulacionActiva, estado: accionPendiente };
      setPostulaciones(postulaciones.map(p => p.id === postulacionActiva.id ? updated : p));
      setPostulacionActiva(updated);
      setComentario('');
    }
    setMostrarModal(false);
  };

  const postulacionesFiltradas = postulaciones.filter(p => filtroPostulacion === 'todas' || p.estado === filtroPostulacion);

  return (
    <IonPage className="fondos-gestor-page">
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
            
            <div className="fondos-header-row">
              <h2>Gestión de Fondos y Postulaciones</h2>
              <button className="btn-nuevo-fondo">+ Nuevo fondo</button>
            </div>

            <div className="fondos-tabs">
              <button className={`tab-btn ${tabActiva === 'postulaciones' ? 'active' : ''}`} onClick={() => setTabActiva('postulaciones')}>Postulaciones</button>
              <button className={`tab-btn ${tabActiva === 'convocatorias' ? 'active' : ''}`} onClick={() => setTabActiva('convocatorias')}>Convocatorias</button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><IonSpinner name="crescent" /></div>
            ) : (
              <>
                {tabActiva === 'postulaciones' && (
                  <div className="master-detail-layout fade-in">
                    
                    {/* MASTER COLUMN */}
                    <div className="master-column">
                      <div className="fondos-filters">
                        <button className={`filter-btn ${filtroPostulacion === 'pendiente' ? 'active' : ''}`} onClick={() => setFiltroPostulacion('pendiente')}>Pendientes</button>
                        <button className={`filter-btn ${filtroPostulacion === 'en_revision' ? 'active' : ''}`} onClick={() => setFiltroPostulacion('en_revision')}>En revisión</button>
                        <button className={`filter-btn ${filtroPostulacion === 'aprobado' ? 'active' : ''}`} onClick={() => setFiltroPostulacion('aprobado')}>Aprobadas</button>
                        <button className={`filter-btn ${filtroPostulacion === 'rechazado' ? 'active' : ''}`} onClick={() => setFiltroPostulacion('rechazado')}>Rechazadas</button>
                        <button className={`filter-btn ${filtroPostulacion === 'requiere_ajuste' ? 'active' : ''}`} onClick={() => setFiltroPostulacion('requiere_ajuste')}>Requiere ajuste</button>
                      </div>

                      <div className="fondos-list">
                        {postulacionesFiltradas.map(post => (
                          <div 
                            key={post.id} 
                            className={`postulacion-card-mini status-${post.estado} ${postulacionActiva?.id === post.id ? 'active' : ''}`}
                            onClick={() => setPostulacionActiva(post)}
                          >
                            <div className="postulacion-card-header">
                              <h3>{post.descripcionIniciativa.substring(0, 30)}...</h3>
                              <span className={`badge-status-small ${post.estado}`}>{getStatusLabel(post.estado)}</span>
                            </div>
                            <span className="badge-fondo">{post.fondoNombre}</span>
                            <div className="prop-card-meta mt-2" style={{marginTop: '8px'}}>
                              <strong>{formatCurrency(post.presupuestoEstimado)}</strong> • Por: {post.nombreRepresentante}
                            </div>
                            <div className="prop-card-footer">
                              <p>Publicado hace {Math.floor((Date.now() - post.fechaPostulacion.getTime()) / (1000 * 3600 * 24))} días</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DETAIL COLUMN */}
                    <div className="detail-column">
                      {postulacionActiva ? (
                        <div className="fade-in">
                          <div className="detail-header-top">
                            <div>
                              <h2>{postulacionActiva.fondoNombre}</h2>
                              <p>Monto solicitado: <strong>{formatCurrency(postulacionActiva.presupuestoEstimado)}</strong></p>
                            </div>
                            <button className="btn-descargar-detalle">Descargar detalle <IonIcon icon={downloadOutline} /></button>
                          </div>

                          <div className="detail-section">
                            <h3>Organización e iniciativa:</h3>
                            <ul className="info-list">
                              <li><strong>Descripción de la iniciativa:</strong> "{postulacionActiva.descripcionIniciativa}"</li>
                              <li><strong>Área cultural:</strong> {postulacionActiva.areaCultural}</li>
                              <li><strong>Nombre del representante:</strong> {postulacionActiva.nombreRepresentante}</li>
                              <li><strong>RUT del representante:</strong> {postulacionActiva.rutRepresentante}</li>
                              <li><strong>Organización que representa:</strong> {postulacionActiva.nombreOrganizacion}</li>
                            </ul>
                          </div>

                          <div className="detail-section">
                            <h3>Análisis de presupuesto:</h3>
                            <table className="presupuesto-table">
                              <thead>
                                <tr>
                                  <th>Tipo de gasto</th>
                                  <th>Monto</th>
                                </tr>
                              </thead>
                              <tbody>
                                {postulacionActiva.desglose.map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.tipo}</td>
                                    <td>{formatCurrency(item.monto)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="detail-section">
                            <h3>Documentación adjunta:</h3>
                            <div className="documentos-list">
                              <div className="doc-item">
                                <IonIcon icon={documentTextOutline} />
                                <span>Detalle gastos de in...</span>
                              </div>
                              <div className="doc-item">
                                <IonIcon icon={documentTextOutline} />
                                <span>Presupuesto publici...</span>
                              </div>
                              <div className="doc-item">
                                <IonIcon icon={documentTextOutline} />
                                <span>Presupuesto luz</span>
                              </div>
                              <div className="doc-item" style={{justifyContent: 'center', color: '#9ca3af'}}>
                                <IonIcon icon={chevronForwardOutline} style={{fontSize: '24px'}} />
                              </div>
                            </div>
                          </div>

                          <div className="detail-section" style={{ borderBottom: 'none' }}>
                            <h3>Acciones:</h3>
                            <div className="detail-actions" style={{marginBottom: '16px'}}>
                              <button className="btn-action-gestor btn-aprobar" onClick={() => abrirModalConfirmacion('aprobado')}>Aprobar</button>
                              <button className="btn-action-gestor btn-en-revision" onClick={() => abrirModalConfirmacion('requiere_ajuste')}>Solicitar corrección</button>
                              <button className="btn-action-gestor btn-rechazar" onClick={() => abrirModalConfirmacion('rechazado')}>Rechazar</button>
                            </div>
                            
                            {errorValidacion && <p style={{color: '#dc2626', fontSize: '13px', margin: '0 0 8px 0'}}>{errorValidacion}</p>}
                            
                            <div className="comentario-area">
                              <label>Ingrese un comentario (obligatorio para corrección o rechazo):</label>
                              <textarea 
                                value={comentario} 
                                onChange={e => setComentario(e.target.value)} 
                                placeholder="Escribe aquí los motivos..."
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="empty-detail fade-in">
                          <IonIcon icon={documentTextOutline} />
                          <h3>Selecciona una postulación</h3>
                          <p>Haz clic en la lista para revisar los antecedentes financieros.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {tabActiva === 'convocatorias' && (
                  <div className="fade-in">
                    <div className="convocatorias-toolbar">
                      <div className="search-box-container">
                        <IonIcon icon={searchOutline} className="search-icon-inside" />
                        <input type="text" placeholder="Buscar por nombre del fondo..." className="toolbar-search-input" />
                      </div>
                      <select className="sort-select">
                        <option>Abiertas</option>
                        <option>Cerradas</option>
                        <option>Borrador</option>
                      </select>
                    </div>

                    <div className="table-scroll-container">
                      <table className="fondos-table">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Periodo</th>
                            <th>Presupuesto</th>
                            <th>Monto por postulante</th>
                            <th>Postulaciones / Cupos</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {convocatorias.map(conv => (
                            <tr key={conv.id}>
                              <td><strong>{conv.titulo}</strong></td>
                              <td>{conv.periodo}</td>
                              <td>{formatCurrency(conv.presupuesto)}</td>
                              <td>{formatCurrency(conv.montoMaximo)}</td>
                              <td>{conv.postulaciones} / {conv.cupos}</td>
                              <td><span className="badge-abierta">{conv.estado}</span></td>
                              <td className="cell-actions" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                <button className="action-icon-btn" title="Editar"><IonIcon icon={createOutline} /></button>
                                <button className="action-icon-btn" title="Ver"><IonIcon icon={eyeOutline} /></button>
                                <button className="action-icon-btn delete-btn" title="Eliminar"><IonIcon icon={trashOutline} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Modal de confirmación */}
        <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)} className="confirm-modal" style={{ '--height': 'auto', '--width': '400px', '--border-radius': '12px' }}>
          <div className="confirm-modal-content">
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '48px', color: '#2563eb', marginBottom: '16px' }} />
            <h3>Confirmar Acción</h3>
            <p>¿Deseas confirmar esta acción y notificar al usuario?</p>
            <div className="modal-actions">
              <button className="btn-modal-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
              <button className="btn-modal-confirm" onClick={confirmarAccion}>Confirmar y Enviar</button>
            </div>
          </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default FondosGestor;
