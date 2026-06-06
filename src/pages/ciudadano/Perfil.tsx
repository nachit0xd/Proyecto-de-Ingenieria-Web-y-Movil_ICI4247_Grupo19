import React, { useState, useRef } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonToast, IonToggle } from '@ionic/react';
import { personCircleOutline, saveOutline, moonOutline, sunnyOutline, arrowBackOutline, cameraOutline, flashOutline, calendarOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import './Perfil.css';
import { useEventos } from '../../hooks/useEventos';

// La página Perfil del Ciudadano permite a los usuarios gestionar su información personal, revisar su agenda guardada y acceder rápidamente a secciones clave como fondos abiertos y propuestas ciudadanas. 
// Además, ofrece la opción de cambiar la foto de perfil y alternar entre modo claro y oscuro directamente para una experiencia personalizada.
const Perfil: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: eventos = [] } = useEventos();
  
  // Estados para gestionar la información del perfil, la foto de perfil, los mensajes de toast y el modo oscuro
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('avatar_ciudadano'));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));

  const savedIds = JSON.parse(localStorage.getItem('saved_events') || '[]');
  const savedEvents = eventos.filter(e => savedIds.includes(e.id));

  // Función para manejar la acción de guardar cambios en el perfil, validando que las contraseñas coincidan si se han ingresado
  const handleSave = () => {
    if (password && password !== confirmPassword) {
      setToastMessage('Las contraseñas no coinciden');
      setShowToast(true);
      return;
    }
    setToastMessage('Perfil actualizado correctamente');
    setShowToast(true);
  };

  // Función para manejar el cambio de avatar, convirtiendo la imagen seleccionada y almacenándola en localStorage (simulando una subida al backend)
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      setToastMessage('Subiendo imagen a la nube...');
      setShowToast(true);

      try {
        const res = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.success) {
          setAvatar(data.imageUrl);
          localStorage.setItem('avatar_ciudadano', data.imageUrl);
          setToastMessage('Avatar guardado exitosamente');
        } else {
          setToastMessage('Error al subir avatar: ' + (data.error || ''));
        }
        setShowToast(true);
      } catch (err) {
        setToastMessage('Error de red al subir la imagen');
        setShowToast(true);
      }
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      document.body.classList.remove('dark-theme', 'dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ '--background': 'var(--app-bg)' }}>
        <IonGrid className="max-width-container" style={{ maxWidth: '1000px', marginTop: '20px' }}>
          <IonRow className="ion-align-items-center ion-margin-bottom">
            <IonCol size="auto">
              <IonButton fill="clear" color="dark" onClick={() => history.goBack()}>
                <IonIcon slot="icon-only" icon={arrowBackOutline} style={{ color: 'var(--app-text-color)' }} />
              </IonButton>
            </IonCol>
            <IonCol>
              <h2 style={{ color: 'var(--app-text-color)', fontWeight: 'bold', margin: 0 }}>Mi Perfil</h2>
              <p style={{ color: 'var(--app-text-muted)', margin: 0 }}>Administra tu información, revisa tu agenda y preferencias.</p>
            </IonCol>
          </IonRow>
          
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard className="profile-card">
                <IonCardHeader>
                  <IonCardTitle>Datos Personales</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                      {avatar ? (
                        <img src={avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginRight: '20px', border: '2px solid var(--ion-color-primary)' }} />
                      ) : (
                        <IonIcon icon={personCircleOutline} style={{ fontSize: '5rem', color: 'var(--ion-color-primary)', marginRight: '20px' }} />
                      )}
                      <div style={{ position: 'absolute', bottom: '0', right: '15px', background: 'var(--ion-color-primary)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={cameraOutline} style={{ color: 'white', fontSize: '14px' }} />
                      </div>
                      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleAvatarChange} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--app-text-color)' }}>{user?.nombre}</h3>
                      <p style={{ margin: 0, color: 'var(--app-text-muted)' }}>Ciudadano</p>
                    </div>
                  </div>
                  
                  <IonItem className="profile-input">
                    <IonLabel position="stacked">Nombre completo</IonLabel>
                    <IonInput value={nombre} onIonChange={e => setNombre(e.detail.value!)}></IonInput>
                  </IonItem>
                  
                  <IonItem className="profile-input">
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput value={email} readonly></IonInput>
                  </IonItem>

                  <h4 style={{ color: 'var(--app-text-color)', marginTop: '20px', fontWeight: 'bold' }}>Seguridad</h4>
                  <IonItem className="profile-input">
                    <IonLabel position="stacked">Nueva contraseña</IonLabel>
                    <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} placeholder="Dejar en blanco para mantener"></IonInput>
                  </IonItem>
                  <IonItem className="profile-input">
                    <IonLabel position="stacked">Confirmar nueva contraseña</IonLabel>
                    <IonInput type="password" value={confirmPassword} onIonChange={e => setConfirmPassword(e.detail.value!)}></IonInput>
                  </IonItem>
                  
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <IonButton color="primary" onClick={handleSave}>
                      <IonIcon slot="start" icon={saveOutline} />
                      Guardar Cambios
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            
            <IonCol size="12" sizeMd="6">
              <IonRow>
                <IonCol size="12">
                  <IonCard className="profile-card">
                    <IonCardHeader>
                      <IonCardTitle>Accesos Rápidos</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton expand="block" color="secondary" style={{ marginBottom: '10px' }} onClick={() => history.push('/ciudadano/fondos')}>
                        <IonIcon slot="start" icon={flashOutline} />
                        Explorar Fondos Abiertos
                      </IonButton>
                      <IonButton expand="block" color="tertiary" onClick={() => history.push('/ciudadano/comunidad')}>
                        <IonIcon slot="start" icon={personCircleOutline} />
                        Crear/Ver Propuestas Ciudadanas
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12">
                  <IonCard className="profile-card">
                    <IonCardHeader>
                      <IonCardTitle>Mi Agenda Guardada</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      {savedEvents.length === 0 ? (
                        <p style={{ color: 'var(--app-text-muted)' }}>No tienes eventos guardados actualmente. Explora la agenda para añadir eventos de tu interés.</p>
                      ) : (
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {savedEvents.map(ev => (
                            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--app-border-color)', paddingBottom: '10px' }}>
                              <IonIcon icon={calendarOutline} style={{ color: 'var(--ion-color-primary)', marginRight: '10px', fontSize: '1.5rem' }} />
                              <div>
                                <h4 style={{ margin: 0, fontWeight: 'bold', color: 'var(--app-text-color)', fontSize: '0.95rem' }}>{ev.titulo}</h4>
                                <span style={{ fontSize: '0.8rem', color: 'var(--app-text-muted)' }}>{new Date(ev.fechaInicio).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <IonButton expand="block" fill="clear" onClick={() => history.push('/ciudadano/agenda')}>
                        Ir a la Agenda
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12">
                  <IonCard className="profile-card">
                    <IonCardContent style={{ padding: '10px 20px' }}>
                      <IonItem lines="none" className="profile-item-clean">
                        <IonIcon icon={isDark ? moonOutline : sunnyOutline} slot="start" style={{ color: 'var(--app-text-muted)' }} />
                        <IonLabel style={{ color: 'var(--app-text-color)', fontWeight: 'bold' }}>Modo Oscuro</IonLabel>
                        <IonToggle checked={isDark} onIonChange={toggleTheme} />
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastMessage.includes('no coinciden') ? 'danger' : 'success'}
        />
      </IonContent>
    </IonPage>
  );
};

export default Perfil;
