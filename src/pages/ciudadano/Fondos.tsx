import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonModal, IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption } from '@ionic/react';
import { downloadOutline, documentTextOutline, alertCircleOutline, checkmarkCircleOutline, closeCircleOutline, chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import './Fondos.css';

// La página de fondos concursables muestra convocatorias abiertas, mis postulaciones y resultados
// Incluye un modal wizard para postular a un fondo cultural (PENDIENTE)

const Fondos: React.FC = () => {
  // Estado para controlar cuál sub-tab está activa
  const [tabActiva, setTabActiva] = useState<'abiertas' | 'mis-postulaciones' | 'resultados'>('abiertas');

  // Estado para el modal wizard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);

  // Estado para almacenar la información del formulario
  const [formData, setFormData] = useState({
    representante: '',
    organizacion: '',
    iniciativa: '',
    descripcion: '',
    area: '',
    presupuesto: '',
    desglose: ''
  });

  // Funciones del modal
  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => {
      setPasoActual(1);
      setFormData({ representante: '', organizacion: '', iniciativa: '', descripcion: '', area: '', presupuesto: '', desglose: '' });
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

  return (
    <IonPage>
      <IonContent fullscreen className="fondos-page ion-padding">
        <div className="max-width-container">
          <h1 className="fondos-titulo">Fondos Culturales</h1>

          {/* TABS SECUNDARIOS (Navegación Interna)*/}
          <div className="fondos-tabs">
            <button 
              className={`fondo-tab-btn ${tabActiva === 'abiertas' ? 'active' : ''}`}
              onClick={() => setTabActiva('abiertas')}
            >
              Convocatorias Abiertas
            </button>
            <button 
              className={`fondo-tab-btn ${tabActiva === 'mis-postulaciones' ? 'active' : ''}`}
              onClick={() => setTabActiva('mis-postulaciones')}
            >
              Mis Postulaciones
            </button>
            <button 
              className={`fondo-tab-btn ${tabActiva === 'resultados' ? 'active' : ''}`}
              onClick={() => setTabActiva('resultados')}
            >
              Resultados
            </button>
          </div>

          {/* CONTENEDOR DE TARJETAS DINÁMICAS */}
          <div className="fondos-content fade-in">
            
            {/* PESTAÑA 1: CONVOCATORIAS ABIERTAS */}
            {tabActiva === 'abiertas' && (
              <div className="lista-fondos">
                <div className="fondo-card outline-box">
                  <div className="fondo-card-header">
                    <h2>Fondo Concursable de Gastronomía 2026</h2>
                    <div className="badges-row">
                      <span className="badge badge-lightgreen">Abierto</span>
                      <span className="badge badge-orange-light">Cierra en 2 días</span>
                    </div>
                  </div>
                  <div className="fondo-card-meta">
                    <p><strong>💰 Monto máximo a postular:</strong> $600,000</p>
                    <p><strong>📅 Cierre:</strong> 18 de Junio de 2026</p>
                  </div>
                  <p className="fondo-descripcion">
                    Este fondo está dedicado a los emprendedores que deseen participar con un stand propio en la Feria Gastronómica Anual de la comuna. Los postulantes deben indicar con detalle qué tipo de exposición realizarán en su stand. Los ganadores recibirán $600,000 para los gastos de su exposición culinaria y un cupo en la feria mencionada.
                  </p>
                  <div className="fondo-card-footer">
                    <button className="btn-descargar">
                      <IonIcon icon={downloadOutline} /> Descargar Bases
                    </button>
                    <button className="btn-postular" onClick={abrirModal}>Postular ahora</button>
                  </div>
                </div>

                <div className="fondo-card outline-box">
                  <div className="fondo-card-header">
                    <h2>Fondo Proyecto Artístico Juvenil 2026</h2>
                    <div className="badges-row">
                      <span className="badge badge-lightgreen">Abierto</span>
                      <span className="badge badge-orange-light">Cierra en 5 días</span>
                    </div>
                  </div>
                  <div className="fondo-card-meta">
                    <p><strong>💰 Monto máximo a postular:</strong> $300,000</p>
                    <p><strong>📅 Cierre:</strong> 21 de Junio de 2026</p>
                  </div>
                  <p className="fondo-descripcion">
                    Este fondo está dedicado a los artistas, entre 18 y 21 años, que tengan una idea de proyecto innovadora que esté relacionada con la cultura y/o patrimonio de la comuna. El postulante podrá recibir $300,000 para los gastos asociados al proyecto, además del apoyo de voluntarios del municipio, si así lo requiere.
                  </p>
                  <div className="fondo-card-footer">
                    <button className="btn-descargar">
                      <IonIcon icon={downloadOutline} /> Descargar Bases
                    </button>
                    <button className="btn-postular" onClick={abrirModal}>Postular ahora</button>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: MIS POSTULACIONES */}
            {tabActiva === 'mis-postulaciones' && (
              <div className="lista-fondos">
                <div className="postulacion-card outline-box status-evaluacion">
                  <div className="postulacion-header">
                    <div>
                      <h2>Exposición de Gastronomía de Fiestas Patrias</h2>
                      <p className="subtext"><strong>📅 Postulando a:</strong> Fondo Concursable de Gastronomía 2026</p>
                    </div>
                    <span className="time-ago">hace 5 días</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label text-orange">
                      <IonIcon icon={alertCircleOutline} /> Estado de postulación: <strong>En evaluación</strong>
                    </span>
                  </div>
                  <div className="postulacion-actions">
                    <button className="btn-comprobante">
                      <IonIcon icon={documentTextOutline} /> Ver comprobante de envío
                    </button>
                    <button className="btn-editar-post" disabled>Editar postulación</button>
                  </div>
                </div>

                <div className="postulacion-card outline-box status-ajustes">
                  <div className="postulacion-header">
                    <div>
                      <h2>Obra de teatro</h2>
                      <p className="subtext"><strong>📅 Postulando a:</strong> Fondo Artes 2026</p>
                    </div>
                    <span className="time-ago">hace 10 días</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label text-blue">
                      <IonIcon icon={alertCircleOutline} /> Estado de postulación: <strong>Requiere ajustes</strong>
                    </span>
                  </div>
                  <div className="postulacion-actions">
                    <button className="btn-comprobante">
                      <IonIcon icon={documentTextOutline} /> Ver comprobante de envío
                    </button>
                    <button className="btn-editar-post active">Editar postulación</button>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 3: RESULTADOS */}
            {tabActiva === 'resultados' && (
              <div className="lista-fondos">
                <div className="postulacion-card outline-box status-aprobada">
                  <div className="postulacion-header">
                    <div>
                      <h2>Taller de teatro juvenil</h2>
                      <p className="subtext"><strong>📅 Postulando a:</strong> Fondo Cultural Abril 2026</p>
                    </div>
                    <span className="time-ago">hace 14 días</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label text-green">
                      <IonIcon icon={checkmarkCircleOutline} /> Estado de postulación: <strong>Aprobada</strong>
                    </span>
                  </div>
                  <div className="postulacion-actions">
                    <button className="btn-comprobante">
                      <IonIcon icon={documentTextOutline} /> Ver comprobante de envío
                    </button>
                    <button className="btn-ver-resultados">Ver resultados</button>
                  </div>
                </div>

                <div className="postulacion-card outline-box status-rechazada">
                  <div className="postulacion-header">
                    <div>
                      <h2>Feria de ropa en Plaza Sur</h2>
                      <p className="subtext"><strong>📅 Postulando a:</strong> Fondo Ferias de Grupos Emprendedores</p>
                    </div>
                    <span className="time-ago">hace 21 días</span>
                  </div>
                  <div className="status-row">
                    <span className="status-label text-red">
                      <IonIcon icon={closeCircleOutline} /> Estado de postulación: <strong>Rechazada</strong>
                    </span>
                  </div>
                  <div className="postulacion-actions">
                    <button className="btn-comprobante">
                      <IonIcon icon={documentTextOutline} /> Ver comprobante de envío
                    </button>
                    <button className="btn-ver-resultados">Ver resultados</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* MODAL WIZARD (FORMULARIO DE 4 PASOS PARA POSTULAR A UN FONDO CULTURAL)*/}
        <IonModal isOpen={mostrarModal} onDidDismiss={cerrarModal} className="wizard-modal">
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
              
              {/* PASO 1: Organización */}
              {pasoActual === 1 && (
                <div className="step-content">
                  <h3>Rellene los siguientes datos:</h3>
                  
                  <div className="input-group">
                    <label>Nombre completo del representante</label>
                    <IonInput 
                      className="custom-modal-input" 
                      placeholder="Ej: Javier Pedro Castillo Pérez"
                      value={formData.representante}
                      onIonInput={(e) => handleInputChange('representante', e.detail.value)}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Nombre de la organización que representa (si aplica)</label>
                    <IonInput 
                      className="custom-modal-input" 
                      placeholder="Ej: Centro de Baile Artístico..."
                      value={formData.organizacion}
                      onIonInput={(e) => handleInputChange('organizacion', e.detail.value)}
                    />
                  </div>
                </div>
              )}

              {/* PASO 2: Iniciativa */}
              {pasoActual === 2 && (
                <div className="step-content">
                  <div className="input-group">
                    <label>Nombre de la iniciativa</label>
                    <IonInput 
                      className="custom-modal-input" 
                      placeholder="Ej: Taller de cueca chilena"
                      value={formData.iniciativa}
                      onIonInput={(e) => handleInputChange('iniciativa', e.detail.value)}
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Breve descripción de la iniciativa</label>
                    <IonTextarea 
                      className="custom-modal-input" 
                      rows={3} 
                      placeholder="Un taller de baile tradicional..."
                      value={formData.descripcion}
                      onIonInput={(e) => handleInputChange('descripcion', e.detail.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Área cultural</label>
                    <IonSelect 
                      interface="popover" 
                      placeholder="Seleccione el área" 
                      className="custom-modal-select"
                      value={formData.area}
                      onIonChange={(e) => handleInputChange('area', e.detail.value)}
                    >
                      <IonSelectOption value="Expresión cultural">Expresión cultural</IonSelectOption>
                      <IonSelectOption value="Patrimonio">Patrimonio</IonSelectOption>
                      <IonSelectOption value="Ferias">Ferias</IonSelectOption>
                    </IonSelect>
                  </div>
                </div>
              )}

              {/* PASO 3: Presupuesto */}
              {pasoActual === 3 && (
                <div className="step-content">
                  <div className="input-group">
                    <label>Presupuesto solicitado (CLP)</label>
                    <IonInput 
                      className="custom-modal-input" 
                      type="number" 
                      placeholder="Ej: 300000"
                      value={formData.presupuesto}
                      onIonInput={(e) => handleInputChange('presupuesto', e.detail.value)}
                    />
                    <span className="help-text">Máximo permitido: $600.000</span>
                  </div>
                  
                  <div className="input-group">
                    <label>Indique el desglose de gastos:</label>
                    <IonTextarea 
                      className="custom-modal-input" 
                      rows={3} 
                      placeholder="Vestimenta: $100.000; arriendo..."
                      value={formData.desglose}
                      onIonInput={(e) => handleInputChange('desglose', e.detail.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label>Documentos adjuntos:</label>
                    <div className="file-upload-area">
                      <p>Toca para adjuntar archivos</p>
                      <span>PDF • máx 5MB por archivo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4: Confirmar */}
              {pasoActual === 4 && (
                <div className="step-content">
                  <h3>Confirma tus datos antes de enviar:</h3>
                  
                  <div className="resumen-lista">
                    <div className="resumen-item">
                      <strong>Nombre del representante:</strong> 
                      {formData.representante || <span style={{color: '#9ca3af'}}>No especificado</span>}
                    </div>
                    <div className="resumen-item">
                      <strong>Nombre de la iniciativa:</strong> 
                      {formData.iniciativa || <span style={{color: '#9ca3af'}}>No especificado</span>}
                    </div>
                    <div className="resumen-item">
                      <strong>Área cultural:</strong> 
                      {formData.area || <span style={{color: '#9ca3af'}}>No especificado</span>}
                    </div>
                    <div className="resumen-item">
                      <strong>Presupuesto estimado:</strong> 
                      {formData.presupuesto ? `$${formData.presupuesto}` : <span style={{color: '#9ca3af'}}>No especificado</span>}
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="modal-footer">
              {pasoActual > 1 ? (
                <>
                  <button className="btn-modal btn-secondary" onClick={pasoAnterior}>Atrás</button>
                  {pasoActual === 4 ? (
                    <button className="btn-modal btn-primary" onClick={cerrarModal}>Finalizar</button>
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