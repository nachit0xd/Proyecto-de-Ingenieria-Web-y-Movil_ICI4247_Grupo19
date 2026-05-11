import React, { useState } from 'react';
import { 
  IonContent, IonPage, IonModal, IonIcon, IonButton, IonInput, IonTextarea, IonSelect, IonSelectOption
} from '@ionic/react';
import { chevronBackOutline, closeOutline, checkmarkOutline } from 'ionicons/icons';
import Header from '../../components/Header';
import './Comunidad.css';

const Comunidad: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pasoActual, setPasoActual] = useState(1);

  // 1. Estado para almacenar la información del formulario
  const [formData, setFormData] = useState({
    representante: '',
    organizacion: '',
    iniciativa: '',
    descripcion: '',
    area: '',
    presupuesto: '',
    desglose: ''
  });

  // 2. Función para actualizar un campo específico del formulario
  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => {
      setPasoActual(1);
      // Limpiar el formulario al cerrar
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
      <Header />
      
      <IonContent fullscreen className="comunidad-page">
        <div className="max-width-container ion-padding">
          
          <div className="comunidad-header-row">
            <h1>Propuestas ciudadanas</h1>
            <IonButton className="btn-nueva-propuesta" onClick={abrirModal}>
              + Nueva propuesta
            </IonButton>
          </div>

          <div className="comunidad-tabs">
            <button className="tab-btn active">Más votadas</button>
            <button className="tab-btn">Recientes</button>
            <button className="tab-btn">En revisión</button>
            <button className="tab-btn">Aprobadas</button>
          </div>

          <div className="propuestas-lista">
            {/* Mantengo las propuestas estáticas que ya tenías */}
            <div className="propuesta-item outline-box">
              <div className="propuesta-item-header">
                <div className="badges-group">
                  <span className="badge badge-blue">Feria</span>
                  <span className="badge badge-lightgreen">Activo</span>
                </div>
                <span className="votos-count">122 votos</span>
              </div>
              <h2>Feria de ropa en Parque Central</h2>
              <p>Propongo realizar una feria semanal donde locatarios y artesanos puedan ofrecer todo tipo de ropa, desde usada hasta fabricada artesanalmente.</p>
              <div className="progress-container margin-bottom">
                <div className="progress-bar orange-bar" style={{width: '81%'}}></div>
              </div>
              <div className="propuesta-item-footer">
                <div className="footer-info">
                  <span>122 / 150 votos para escalar a convocatoria</span>
                  <span>Por: María Soto • hace 4 días</span>
                </div>
                <button className="btn-accion bg-lightgray">Votar</button>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL WIZARD */}
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

export default Comunidad;