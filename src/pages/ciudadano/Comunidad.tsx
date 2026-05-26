import React, { useState } from 'react';
import { IonContent, IonPage, IonSpinner, useIonToast, IonModal, IonInput, IonTextarea, IonSelect, IonSelectOption, IonIcon } from '@ionic/react';
import { checkmarkCircleOutline, chevronBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Comunidad.css';

import { usePropuestasPopulares, usePropuestasCiudadano, useVotarPropuesta, useMisVotos, useAnularVoto, useCrearPropuesta } from '../../hooks/useComunidad';
import { useAuth } from '../../context/AuthContext';

// La página de comunidad muestra propuestas ciudadanas con diferentes estados y permite votar por ellas
const Comunidad: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [tabActiva, setTabActiva] = useState('votadas');
  const [presentToast] = useIonToast();
  
  const { data: populares = [], isLoading: loadPopulares } = usePropuestasPopulares();
  const { data: todas = [], isLoading: loadTodas } = usePropuestasCiudadano();
  const { data: misVotos = [], isLoading: loadVotos } = useMisVotos();
  
  const { mutate: votar } = useVotarPropuesta();
  const { mutate: anular } = useAnularVoto();
  const { mutateAsync: crearPropuesta } = useCrearPropuesta();

  const loading = loadPopulares || loadTodas || loadVotos;

  // Modal form states
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', categoria: 'Expresión cultural' });

  let propuestas = todas;
  if (tabActiva === 'votadas') {
    propuestas = populares;
  } else if (tabActiva === 'revision') {
    propuestas = todas.filter((p: any) => p.estado === 'en_revision' || p.estado === 'revision');
  } else if (tabActiva === 'aprobadas') {
    propuestas = todas.filter((p: any) => p.estado === 'aprobado');
  }

  const getBadgeClass = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'aprobado': return 'badge-green';
      case 'rechazado': return 'badge-red';
      case 'en_revision':
      case 'revision': return 'badge-yellow';
      default: return 'badge-gray';
    }
  };

  const timeAgo = (date: any) => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `hace ${days} días`;
  };

  // Maneja el voto por una propuesta (votar o anular voto si ya está votado)
  const handleVotar = (id: string) => {
    if (!isAuthenticated) {
      presentToast({
        message: 'Debes iniciar sesión para votar',
        duration: 2500,
        color: 'warning',
        position: 'top'
      });
      return;
    }
    
    if (misVotos.includes(id)) {
      anular(id);
      presentToast({
        message: 'Voto anulado',
        duration: 2000,
        color: 'medium',
        position: 'top'
      });
    } else {
      votar(id);
      presentToast({
        message: '¡Voto registrado con éxito!',
        duration: 2500,
        color: 'success',
        icon: checkmarkCircleOutline,
        position: 'top'
      });
    }
  };

  // Abre el modal para crear una nueva propuesta, verificando que el usuario esté autenticado
  const abrirModalNuevaPropuesta = () => {
    if (!isAuthenticated) {
      presentToast({ message: 'Debes iniciar sesión para crear propuestas', duration: 2500, color: 'warning', position: 'top' });
      return;
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTimeout(() => {
      setFormData({ titulo: '', descripcion: '', categoria: 'Expresión cultural' });
    }, 300);
  };

  const handleCrear = async () => {
    if (!formData.titulo.trim() || !formData.descripcion.trim()) {
      presentToast({ message: 'Por favor completa todos los campos', duration: 2000, color: 'danger', position: 'top' });
      return;
    }
    try {
      await crearPropuesta({ titulo: formData.titulo, descripcion: formData.descripcion });
      presentToast({ message: 'Propuesta enviada a revisión', duration: 3000, color: 'success', icon: checkmarkCircleOutline, position: 'top' });
      cerrarModal();
      setTabActiva('revision');
    } catch (e) {
      presentToast({ message: 'Error al crear la propuesta', duration: 2000, color: 'danger', position: 'top' });
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="comunidad-page">
        <div className="max-width-container ion-padding">
          
          <div className="comunidad-header-row">
            <h1>Propuestas ciudadanas</h1>
            <button className="btn-nueva-propuesta px-4" onClick={abrirModalNuevaPropuesta}>+ Nueva propuesta</button>
          </div>

          <div className="fondos-tabs">
            <button className={`fondo-tab-btn ${tabActiva === 'votadas' ? 'active' : ''}`} onClick={() => setTabActiva('votadas')}>Más votadas</button>
            <button className={`fondo-tab-btn ${tabActiva === 'recientes' ? 'active' : ''}`} onClick={() => setTabActiva('recientes')}>Recientes</button>
            <button className={`fondo-tab-btn ${tabActiva === 'revision' ? 'active' : ''}`} onClick={() => setTabActiva('revision')}>En revisión</button>
            <button className={`fondo-tab-btn ${tabActiva === 'aprobadas' ? 'active' : ''}`} onClick={() => setTabActiva('aprobadas')}>Aprobadas</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="propuestas-lista">
              {propuestas.map((propuesta: any) => {
                const yaVotado = misVotos.includes(propuesta.id);
                const totalVotos = propuesta.votosTotales;
                
                return (
                <div className="propuesta-item outline-box" key={propuesta.id}>
                  <div className="propuesta-item-header">
                    <div className="badges-group">
                      <span className="badge badge-blue">Idea</span>
                      <span className={`badge ${getBadgeClass(propuesta.estado)}`}>
                        {propuesta.estado === 'en_revision' || propuesta.estado === 'revision' ? 'En revisión' : propuesta.estado.charAt(0).toUpperCase() + propuesta.estado.slice(1)}
                      </span>
                    </div>
                    <span className="votos-count">{totalVotos} votos</span>
                  </div>
                  <h2>{propuesta.titulo}</h2>
                  <p>{propuesta.descripcion}</p>
                  <div className="progress-container margin-bottom">
                    <div className="progress-bar orange-bar" style={{width: `${Math.min((totalVotos / 150) * 100, 100)}%`}}></div>
                  </div>
                  <div className="propuesta-item-footer">
                    <div className="footer-info">
                      <span>{totalVotos} / 150 votos para escalar a convocatoria</span>
                      <span>Por: {propuesta.idUsuario} • {timeAgo(propuesta.fechaCreacion)}</span>
                    </div>
                    <button 
                      className={`btn-accion ${yaVotado ? 'bg-green-success' : 'bg-lightgray'}`} 
                      onClick={() => handleVotar(propuesta.id)}
                    >
                      {yaVotado ? 'Anular Voto' : 'Votar'}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>

        {/* Modal para crear nueva propuesta ciudadana, con validación de campos y feedback al usuario */}
        <IonModal isOpen={mostrarModal} onDidDismiss={cerrarModal} className="wizard-modal">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <button className="btn-volver-modal" onClick={cerrarModal}>
                <IonIcon icon={chevronBackOutline} /> Volver
              </button>
              <h2>Nueva Propuesta</h2>
              <div style={{width: '60px'}}></div>
            </div>
            
            <div className="modal-body fade-in">
              <div className="step-content">
                <h3>Comparte tu idea con la comunidad</h3>
                <div className="input-group">
                  <label>Título de la propuesta</label>
                  <IonInput className="custom-modal-input" placeholder="Ej: Feria vecinal todos los domingos..." value={formData.titulo} onIonInput={(e) => setFormData({...formData, titulo: e.detail.value!})} />
                </div>
                <div className="input-group">
                  <label>Descripción detallada</label>
                  <IonTextarea className="custom-modal-input" rows={4} placeholder="Describe de qué trata y a quiénes beneficia..." value={formData.descripcion} onIonInput={(e) => setFormData({...formData, descripcion: e.detail.value!})} />
                </div>
                <div className="input-group">
                  <label>Categoría temática</label>
                  <IonSelect interface="popover" className="custom-modal-select" value={formData.categoria} onIonChange={(e) => setFormData({...formData, categoria: e.detail.value!})}>
                    <IonSelectOption value="Expresión cultural">Expresión cultural</IonSelectOption>
                    <IonSelectOption value="Patrimonio">Patrimonio</IonSelectOption>
                    <IonSelectOption value="Ferias">Ferias</IonSelectOption>
                    <IonSelectOption value="Talleres">Talleres</IonSelectOption>
                  </IonSelect>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-modal btn-primary btn-full" onClick={handleCrear}>Enviar Propuesta</button>
            </div>
          </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default Comunidad;