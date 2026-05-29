import React, { useState } from 'react';
import { useIonToast, IonContent, IonPage, IonIcon, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption, IonSpinner } from '@ionic/react';
import { downloadOutline, documentTextOutline, alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import './Fondos.css';

import { useConvocatoriasCiudadano, usePostulacionesCiudadano, usePostularFondo } from '../../hooks/useFondos';

// La página de fondos culturales muestra convocatorias abiertas, permite postular a ellas y ver el estado de las postulaciones realizadas por el usuario
const Fondos: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<'abiertas' | 'mis-postulaciones' | 'resultados'>('abiertas');
  
  const { data: convocatorias = [], isLoading: loadConvocatorias } = useConvocatoriasCiudadano();
  const { data: postulaciones = [], isLoading: loadPostulaciones } = usePostulacionesCiudadano();
  const postularFondo = usePostularFondo();
  const [presentToast] = useIonToast();

  const loading = loadConvocatorias || loadPostulaciones;

  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);

  const [formData, setFormData] = useState({
    rut: '',
    representante: '',
    organizacion: '',
    iniciativa: '',
    descripcion: '',
    area: '',
    presupuesto: '',
    desglose: ''
  });

  const [archivosAdjuntos, setArchivosAdjuntos] = useState<File[]>([]);

  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setArchivosAdjuntos(prev => [...prev, ...newFiles]);
    }
  };

  const [fondoSeleccionado, setFondoSeleccionado] = useState<any>(null);

  const abrirModal = (fondo: any) => {
    setFondoSeleccionado(fondo);
    setMostrarModal(true);
  };
  
  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => {
      setPasoActual(1);
      setFormData({ rut: '', representante: '', organizacion: '', iniciativa: '', descripcion: '', area: '', presupuesto: '', desglose: '' });
      setArchivosAdjuntos([]);
      setFondoSeleccionado(null);
    }, 300);
  };
  const siguientePaso = () => setPasoActual(prev => Math.min(prev + 1, 4));
  const pasoAnterior = () => setPasoActual(prev => Math.max(prev - 1, 1));

  const renderStepper = () => {
    const pasos = [
      { num: 1, label: 'Organización' },
      { num: 2, label: 'Iniciativa' },
      { num: 3, label: 'Presupuesto' },
      { num: 4, label: 'Confirmar' }
    ];

    return (
      <div className="stepper-container">
        {pasos.map((paso, index) => {
          const completado = pasoActual > paso.num;
          const activo = pasoActual === paso.num;
          
          return (
            <React.Fragment key={paso.num}>
              <div className="step-wrapper">
                <div className={`step-circle ${completado ? 'completed' : ''} ${activo ? 'active' : ''}`}>
                  {completado ? <IonIcon icon={checkmarkOutline} /> : paso.num}
                </div>
                <span className="step-label">{paso.label}</span>
              </div>
              {index < pasos.length - 1 && (
                <div className={`step-line ${completado ? 'completed-line' : ''}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const formatCurrency = (val: number) => {
    return '$' + val.toLocaleString('es-CL');
  };

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusIcon = (estado: string) => {
    if (estado === 'aprobada') return checkmarkCircleOutline;
    if (estado === 'rechazada') return closeCircleOutline;
    return alertCircleOutline;
  };

  const getStatusClass = (estado: string) => {
    if (estado === 'aprobada') return 'status-aprobada';
    if (estado === 'rechazada') return 'status-rechazada';
    if (estado === 'requiere_ajustes') return 'status-ajustes';
    return 'status-evaluacion';
  };

  const getStatusLabelClass = (estado: string) => {
    if (estado === 'aprobada') return 'text-green';
    if (estado === 'rechazada') return 'text-red';
    if (estado === 'requiere_ajustes') return 'text-blue';
    return 'text-orange';
  };

  const formatStatus = (estado: string) => {
    const map: any = {
      'en_revision': 'En evaluación',
      'aprobada': 'Aprobada',
      'rechazada': 'Rechazada',
      'requiere_ajustes': 'Requiere ajustes'
    };
    return map[estado] || estado;
  };

  return (
    <IonPage>
      <IonContent fullscreen className="fondos-page ion-padding">
        <div className="max-width-container">
          <h1 className="fondos-titulo">Fondos Culturales</h1>

          <div className="fondos-tabs">
            <button className={`fondo-tab-btn ${tabActiva === 'abiertas' ? 'active' : ''}`} onClick={() => setTabActiva('abiertas')}>Convocatorias Abiertas</button>
            <button className={`fondo-tab-btn ${tabActiva === 'mis-postulaciones' ? 'active' : ''}`} onClick={() => setTabActiva('mis-postulaciones')}>Mis Postulaciones</button>
            <button className={`fondo-tab-btn ${tabActiva === 'resultados' ? 'active' : ''}`} onClick={() => setTabActiva('resultados')}>Resultados</button>
          </div>

          <div className="fondos-content fade-in">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><IonSpinner name="crescent" /></div>
            ) : (
              <>
                {tabActiva === 'abiertas' && (
                  <div className="lista-fondos">
                    {convocatorias.map((conv: any) => (
                      <div className="fondo-card outline-box" key={conv.id}>
                        <div className="fondo-card-header">
                          <h2>{conv.titulo}</h2>
                          <div className="badges-row">
                            <span className="badge badge-lightgreen">Abierto</span>
                          </div>
                        </div>
                        <div className="fondo-card-meta">
                          <p><strong>💰 Monto máximo a postular:</strong> {formatCurrency(conv.montoMaximo)}</p>
                          <p><strong>📅 Cierre:</strong> {formatDate(conv.fechaCierre)}</p>
                        </div>
                        <p className="fondo-descripcion">Postula a este fondo destinado a impulsar las iniciativas culturales de la comunidad.</p>
                        <div className="fondo-card-footer">
                          <button className="btn-descargar"><IonIcon icon={downloadOutline} /> Descargar Bases</button>
                          <button className="btn-postular" onClick={() => abrirModal(conv)}>Postular ahora</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tabActiva === 'mis-postulaciones' && (
                  <div className="lista-fondos">
                    {postulaciones.filter(p => p.estado === 'en_revision' || p.estado === 'requiere_ajustes').map(postulacion => (
                      <div className={`postulacion-card outline-box ${getStatusClass(postulacion.estado)}`} key={postulacion.id}>
                        <div className="postulacion-header">
                          <div>
                            <h2>{postulacion.descripcionIniciativa}</h2>
                            <p className="subtext"><strong>📅 Área:</strong> {postulacion.areaCultural}</p>
                          </div>
                        </div>
                        <div className="status-row">
                          <span className={`status-label ${getStatusLabelClass(postulacion.estado)}`}>
                            <IonIcon icon={getStatusIcon(postulacion.estado)} /> Estado: <strong>{formatStatus(postulacion.estado)}</strong>
                          </span>
                        </div>
                        <div className="postulacion-actions">
                          <button className="btn-comprobante"><IonIcon icon={documentTextOutline} /> Ver comprobante</button>
                          <button className={`btn-editar-post ${postulacion.estado === 'requiere_ajustes' ? 'active' : ''}`} disabled={postulacion.estado !== 'requiere_ajustes'}>Editar postulación</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {tabActiva === 'resultados' && (
                  <div className="lista-fondos">
                    {postulaciones.filter(p => p.estado === 'aprobada' || p.estado === 'rechazada').map(postulacion => (
                      <div className={`postulacion-card outline-box ${getStatusClass(postulacion.estado)}`} key={postulacion.id}>
                        <div className="postulacion-header">
                          <div>
                            <h2>{postulacion.descripcionIniciativa}</h2>
                            <p className="subtext"><strong>📅 Área:</strong> {postulacion.areaCultural}</p>
                          </div>
                        </div>
                        <div className="status-row">
                          <span className={`status-label ${getStatusLabelClass(postulacion.estado)}`}>
                            <IonIcon icon={getStatusIcon(postulacion.estado)} /> Estado: <strong>{formatStatus(postulacion.estado)}</strong>
                          </span>
                        </div>
                        <div className="postulacion-actions">
                          <button className="btn-comprobante"><IonIcon icon={documentTextOutline} /> Ver comprobante</button>
                          <button className="btn-ver-resultados">Ver resultados</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <IonModal isOpen={mostrarModal} onDidDismiss={cerrarModal} className="wizard-modal">
          {/* ... keeping the modal form ... */}
          <div className="modal-content-wrapper">
            
            <div className="modal-header">
              <button className="btn-volver-modal" onClick={cerrarModal}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </button>
              <h2>Postular fondo cultural</h2>
              <div style={{width: '60px'}}></div>
            </div>

            {renderStepper()}

            <div className="modal-body fade-in">
              
              {pasoActual === 1 && (
                <div className="step-content">
                  <h3>Rellene los siguientes datos:</h3>
                  <div className="input-group">
                    <label>Nombre completo del representante</label>
                    <IonInput className="custom-modal-input" placeholder="Ej: Javier Pedro Castillo Pérez" value={formData.representante} onIonInput={(e) => handleInputChange('representante', e.detail.value)} />
                  </div>
                  <div className="input-group">
                    <label>RUT del representante</label>
                    <IonInput className="custom-modal-input" placeholder="Ej: 12.345.678-9" value={formData.rut} onIonInput={(e) => handleInputChange('rut', e.detail.value)} />
                  </div>
                  <div className="input-group">
                    <label>Nombre de la organización que representa (si aplica)</label>
                    <IonInput className="custom-modal-input" placeholder="Ej: Centro de Baile Artístico..." value={formData.organizacion} onIonInput={(e) => handleInputChange('organizacion', e.detail.value)} />
                  </div>
                </div>
              )}

              {pasoActual === 2 && (
                <div className="step-content">
                  <div className="input-group">
                    <label>Nombre de la iniciativa</label>
                    <IonInput className="custom-modal-input" placeholder="Ej: Taller de cueca chilena" value={formData.iniciativa} onIonInput={(e) => handleInputChange('iniciativa', e.detail.value)} />
                  </div>
                  <div className="input-group">
                    <label>Breve descripción de la iniciativa</label>
                    <IonTextarea className="custom-modal-input" rows={3} placeholder="Un taller de baile tradicional..." value={formData.descripcion} onIonInput={(e) => handleInputChange('descripcion', e.detail.value)} />
                  </div>
                  <div className="input-group">
                    <label>Área cultural</label>
                    <IonSelect interface="popover" placeholder="Seleccione el área" className="custom-modal-select" value={formData.area} onIonChange={(e) => handleInputChange('area', e.detail.value)}>
                      <IonSelectOption value="Expresión cultural">Expresión cultural</IonSelectOption>
                      <IonSelectOption value="Patrimonio">Patrimonio</IonSelectOption>
                      <IonSelectOption value="Ferias">Ferias</IonSelectOption>
                    </IonSelect>
                  </div>
                </div>
              )}

              {pasoActual === 3 && (
                <div className="step-content">
                  <div className="input-group">
                    <label>Presupuesto solicitado (CLP)</label>
                    <IonInput className="custom-modal-input" type="number" placeholder="Ej: 300000" value={formData.presupuesto} onIonInput={(e) => handleInputChange('presupuesto', e.detail.value)} />
                    <span className="help-text">Máximo permitido: {fondoSeleccionado ? formatCurrency(fondoSeleccionado.montoMaximo) : ''}</span>
                  </div>
                  <div className="input-group">
                    <label>Indique el desglose de gastos:</label>
                    <IonTextarea className="custom-modal-input" rows={3} placeholder="Vestimenta: $100.000; arriendo..." value={formData.desglose} onIonInput={(e) => handleInputChange('desglose', e.detail.value)} />
                  </div>
                  <div className="input-group">
                    <label>Documentos adjuntos:</label>
                    <div className="file-upload-area" style={{ position: 'relative' }}>
                      <input 
                        type="file" 
                        multiple 
                        accept=".pdf" 
                        onChange={handleFileChange}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      />
                      <p>Toca para adjuntar archivos</p>
                      <span>PDF • máx 5MB por archivo</span>
                    </div>
                    {archivosAdjuntos.length > 0 && (
                      <ul style={{ paddingLeft: '20px', margin: '8px 0', fontSize: '0.9rem', color: '#4b5563' }}>
                        {archivosAdjuntos.map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {pasoActual === 4 && (
                <div className="step-content">
                  <h3>Confirma tus datos antes de enviar:</h3>
                  <div className="resumen-lista">
                    <div className="resumen-item"><strong>Nombre del representante:</strong> {formData.representante || <span style={{color: '#9ca3af'}}>No especificado</span>}</div>
                    <div className="resumen-item"><strong>Nombre de la iniciativa:</strong> {formData.iniciativa || <span style={{color: '#9ca3af'}}>No especificado</span>}</div>
                    <div className="resumen-item"><strong>Área cultural:</strong> {formData.area || <span style={{color: '#9ca3af'}}>No especificado</span>}</div>
                    <div className="resumen-item"><strong>Presupuesto estimado:</strong> {formData.presupuesto ? `$${formData.presupuesto}` : <span style={{color: '#9ca3af'}}>No especificado</span>}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {pasoActual > 1 ? (
                <>
                  <button className="btn-modal btn-secondary" onClick={pasoAnterior} disabled={postularFondo.isPending}>Atrás</button>
                  {pasoActual === 4 ? (
                    <button className="btn-modal btn-primary" onClick={async () => {
                      if (!fondoSeleccionado) return;
                      await postularFondo.mutateAsync({
                        fondoId: fondoSeleccionado.id,
                        nombreRepresentante: formData.representante,
                        rutRepresentante: formData.rut || 'Sin especificar',
                        nombreOrganizacion: formData.organizacion || 'Persona Natural',
                        descripcion: formData.descripcion,
                        presupuestoEstimado: parseInt(formData.presupuesto) || 0,
                        areaCultural: formData.area,
                        desglose: formData.desglose,
                        documentos: JSON.stringify(archivosAdjuntos.map(f => f.name))
                      });
                      presentToast({
                        message: 'Postulación enviada correctamente',
                        duration: 3000,
                        color: 'success',
                        icon: checkmarkCircleOutline
                      });
                      cerrarModal();
                    }} disabled={postularFondo.isPending}>
                      {postularFondo.isPending ? 'Enviando...' : 'Finalizar'}
                    </button>
                  ) : (
                    <button className="btn-modal btn-primary" onClick={siguientePaso}>Siguiente</button>
                  )}
                </>
              ) : (
                <button className="btn-modal btn-primary btn-full" onClick={siguientePaso}>Siguiente</button>
              )}
            </div>

          </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Fondos;
