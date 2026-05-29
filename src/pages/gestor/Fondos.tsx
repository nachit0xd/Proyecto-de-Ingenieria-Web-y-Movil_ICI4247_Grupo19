import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonIcon, IonSpinner } from '@ionic/react';
import { documentTextOutline, searchOutline, createOutline, trashOutline, downloadOutline } from 'ionicons/icons';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import ActionButton from '../../components/ui/ActionButton';
import './Fondos.css';

import { usePostulacionesGestor, useConvocatoriasGestor, useActualizarEstadoPostulacion, useCrearFondo, useEditarFondo, useEliminarFondo } from '../../hooks/useFondos';
import { PostulacionFondoGestor } from '../../services/fondos.service';
import FondoModal from '../../components/FondoModal';

// Componente principal de la página de Fondos para gestores municipales
// Permite gestionar postulaciones a fondos culturales, revisar detalles financieros y administrar convocatorias de fondos
const FondosGestor: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<'postulaciones' | 'convocatorias'>('postulaciones');
  
  const { data: postulacionesData = [], isLoading: loadPostulaciones } = usePostulacionesGestor();
  const { data: convocatoriasData = [], isLoading: loadConvocatorias } = useConvocatoriasGestor();
  const actualizarEstado = useActualizarEstadoPostulacion();
  const crearFondo = useCrearFondo();
  const editarFondo = useEditarFondo();
  const eliminarFondo = useEliminarFondo();

  const loading = loadPostulaciones || loadConvocatorias;

  const [postulaciones, setPostulaciones] = useState<PostulacionFondoGestor[]>([]);
  const [convocatorias, setConvocatorias] = useState<any[]>([]);

  useEffect(() => {
    if (postulacionesData.length > 0) {
      setPostulaciones(postulacionesData);
      if (postulacionActiva) {
        const updated = postulacionesData.find((p: any) => p.id === postulacionActiva.id);
        if (updated) setPostulacionActiva(updated);
      }
    }
  }, [postulacionesData]);

  useEffect(() => {
    if (convocatoriasData.length > 0) {
      setConvocatorias(convocatoriasData);
    } else {
      setConvocatorias([]);
    }
  }, [convocatoriasData]);

  const [filtroPostulacion, setFiltroPostulacion] = useState<string>('pendiente');
  const [postulacionActiva, setPostulacionActiva] = useState<PostulacionFondoGestor | null>(null);

  // Estados para búsqueda y filtrado de convocatorias
  const [searchConvocatoria, setSearchConvocatoria] = useState('');
  const [filtroConvocatoria, setFiltroConvocatoria] = useState('Abiertas');
  
  // Estados para controlar el modal de creación/edición de fondos
  const [isFondoModalOpen, setIsFondoModalOpen] = useState(false);
  const [fondoAEditar, setFondoAEditar] = useState<any>(null);

  const [comentario, setComentario] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState<string>('');
  const [errorValidacion, setErrorValidacion] = useState('');

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

  const getBadgeVariant = (estado: string): BadgeVariant => {
    const map: Record<string, BadgeVariant> = {
      'pendiente': 'warning',
      'en_revision': 'info',
      'aprobado': 'success',
      'rechazado': 'danger',
      'requiere_ajuste': 'warning'
    };
    return map[estado] || 'neutral';
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

  const confirmarAccion = async () => {
    if (postulacionActiva) {
      await actualizarEstado.mutateAsync({ id: postulacionActiva.id, estado: accionPendiente });
      setComentario('');
    }
    setMostrarModal(false);
  };

  const postulacionesFiltradas = postulaciones.filter(p => filtroPostulacion === 'todas' || p.estado === filtroPostulacion);

  // Lógica de Convocatorias
  const convocatoriasFiltradas = convocatorias.filter(conv => {
    const matchSearch = conv.titulo.toLowerCase().includes(searchConvocatoria.toLowerCase());
    if (filtroConvocatoria === 'Abiertas') return matchSearch && conv.estado.toLowerCase() === 'abierto';
    if (filtroConvocatoria === 'Cerradas') return matchSearch && conv.estado.toLowerCase() === 'cerrado';
    return matchSearch; // Para "Todas" solo filtra por búsqueda
  });

  const handleNuevoFondo = () => {
    setFondoAEditar(null);
    setIsFondoModalOpen(true);
  };

  const handleEditarFondo = (fondo: any) => {
    setFondoAEditar(fondo);
    setIsFondoModalOpen(true);
  };

  const handleGuardarFondo = async (data: any) => {
    if (fondoAEditar) {
      await editarFondo.mutateAsync({ id: fondoAEditar.id, datos: data });
    } else {
      await crearFondo.mutateAsync(data);
    }
  };

  return (
    <IonPage className="fondos-gestor-page">
      <GestorHeader />

      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          <GestorSidebar />

          <main className="gestor-main-content">
            
            <div className="fondos-header-row">
              <h2>Gestión de Fondos y Postulaciones</h2>
              <button className="btn-nuevo-fondo" onClick={handleNuevoFondo}>+ Nuevo fondo</button>
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
                              <h3 style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>{post.descripcionIniciativa}</h3>
                              <Badge variant={getBadgeVariant(post.estado)}>{getStatusLabel(post.estado)}</Badge>
                            </div>
                            <Badge variant="primary">{post.fondoNombre}</Badge>
                            <div className="prop-card-meta mt-2" style={{marginTop: '8px'}}>
                              <strong>{formatCurrency(post.presupuestoEstimado)}</strong> • Por: {post.nombreRepresentante}
                            </div>
                            <div className="prop-card-footer">
                              <p>Publicado hace {Math.floor((Date.now() - new Date(post.fechaPostulacion).getTime()) / (1000 * 3600 * 24))} días</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* COLUMNA DE DETALLE */}
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
                            {postulacionActiva.desglose ? (
                              <div className="presupuesto-texto outline-box" style={{ padding: '16px', background: 'var(--app-input-bg)', color: 'var(--app-text-color)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                {postulacionActiva.desglose}
                              </div>
                            ) : (
                              <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No se ha adjuntado un desglose de presupuesto detallado.</p>
                            )}
                          </div>

                          <div className="detail-section">
                            <h3>Documentación adjunta:</h3>
                            <div className="documentos-list">
                              {postulacionActiva.documentos && JSON.parse(postulacionActiva.documentos).length > 0 ? (
                                JSON.parse(postulacionActiva.documentos).map((doc: string, idx: number) => (
                                  <div className="doc-item" key={idx}>
                                    <IonIcon icon={documentTextOutline} />
                                    <span title={doc}>{doc.length > 20 ? doc.substring(0, 17) + '...' : doc}</span>
                                  </div>
                                ))
                              ) : (
                                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No hay documentos adjuntos.</p>
                              )}
                            </div>
                          </div>


                          <div className="detail-section" style={{ borderBottom: 'none' }}>
                            <h3>Acciones:</h3>
                            <div className="detail-actions" style={{marginBottom: '16px'}}>
                              <ActionButton variant="success" onClick={() => abrirModalConfirmacion('aprobado')}>Aprobar</ActionButton>
                              <ActionButton variant="info" onClick={() => abrirModalConfirmacion('requiere_ajuste')}>Solicitar corrección</ActionButton>
                              <ActionButton variant="danger" onClick={() => abrirModalConfirmacion('rechazado')}>Rechazar</ActionButton>
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
                        <input 
                          type="text" 
                          placeholder="Buscar por nombre del fondo..." 
                          className="toolbar-search-input" 
                          value={searchConvocatoria}
                          onChange={(e) => setSearchConvocatoria(e.target.value)}
                        />
                      </div>
                      <select className="sort-select" value={filtroConvocatoria} onChange={(e) => setFiltroConvocatoria(e.target.value)}>
                        <option value="Abiertas">Abiertas</option>
                        <option value="Cerradas">Cerradas</option>
                        <option value="Todas">Todas</option>
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
                          {convocatoriasFiltradas.length > 0 ? convocatoriasFiltradas.map((conv: any) => (
                            <tr key={conv.id}>
                              <td><strong>{conv.titulo}</strong></td>
                              <td>{conv.periodo}</td>
                              <td>{formatCurrency(conv.presupuesto)}</td>
                              <td>{formatCurrency(conv.montoMaximo)}</td>
                              <td>{conv.postulaciones} / {conv.cupos}</td>
                              <td><Badge variant={conv.estado.toLowerCase() === 'abierto' ? 'success' : 'neutral'}>{conv.estado}</Badge></td>
                              <td className="cell-actions" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                <button className="action-icon-btn" title="Editar" onClick={() => handleEditarFondo(conv)}><IonIcon icon={createOutline} /></button>
                                <button className="action-icon-btn delete-btn" title="Eliminar" onClick={() => {
                                  if (window.confirm('¿Seguro que deseas eliminar este fondo?')) {
                                    eliminarFondo.mutate(conv.id);
                                  }
                                }}><IonIcon icon={trashOutline} /></button>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                No se encontraron fondos.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        <ConfirmModal
          isOpen={mostrarModal}
          title="Confirmar Acción"
          message="¿Deseas confirmar esta acción y notificar al usuario?"
          confirmText="Confirmar y Enviar"
          cancelText="Cancelar"
          onConfirm={confirmarAccion}
          onCancel={() => setMostrarModal(false)}
        />

        <FondoModal 
          isOpen={isFondoModalOpen}
          onClose={() => setIsFondoModalOpen(false)}
          fondoAEditar={fondoAEditar}
          onSave={handleGuardarFondo}
        />

      </IonContent>
    </IonPage>
  );
};

export default FondosGestor;
