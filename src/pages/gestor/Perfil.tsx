import React, { useState, useRef } from 'react';
import { IonPage, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonToast, IonToggle } from '@ionic/react';
import { personCircleOutline, saveOutline, moonOutline, sunnyOutline, arrowBackOutline, cameraOutline, notificationsOutline, documentTextOutline } from 'ionicons/icons';
import { useAuth } from '../../context/AuthContext';
import { useHistory } from 'react-router-dom';
import GestorSidebar from '../../components/GestorSidebar';
import GestorHeader from '../../components/GestorHeader';
import '../ciudadano/Perfil.css';

// La página Perfil del Gestor permite a los gestores municipales gestionar su información personal, cambiar su foto de perfil, actualizar su contraseña y configurar preferencias como el modo oscuro y las alertas de notificaciones. 
// También ofrece acceso rápido a logs del sistema para supervisar la actividad administrativa.
const PerfilGestor: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem('avatar_gestor'));
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDark, setIsDark] = useState(() => document.body.classList.contains('dark-theme'));

  // Prefencias de alertas para propuestas y fondos, que serán utilizadas para mostrar u ocultar notificaciones relacionadas en otras partes de la aplicación
  const [alertPropuestas, setAlertPropuestas] = useState(true);
  const [alertFondos, setAlertFondos] = useState(true);

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
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('avatar_gestor', base64String);
        setToastMessage('Avatar actualizado');
        setShowToast(true);
      };
      reader.readAsDataURL(file);
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
      <GestorHeader />
      <IonContent fullscreen scrollY={false}>
        <div className="gestor-layout">
          <GestorSidebar />
          <main className="gestor-main-content">
            <div style={{ padding: '20px', overflowY: 'auto', height: '100%' }}>
              <IonGrid className="max-width-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <IonRow className="ion-align-items-center ion-margin-bottom">
                  <IonCol size="auto">
                    <IonButton fill="clear" color="dark" onClick={() => history.goBack()}>
                      <IonIcon slot="icon-only" icon={arrowBackOutline} style={{ color: 'var(--app-text-color)' }} />
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <h2 style={{ color: 'var(--app-text-color)', fontWeight: 'bold', margin: 0 }}>Mi Perfil Gestor</h2>
                    <p style={{ color: 'var(--app-text-muted)', margin: 0 }}>Administra tu información personal y configuraciones administrativas.</p>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol size="12" sizeMd="7">
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
                            <p style={{ margin: 0, color: 'var(--app-text-muted)' }}>Gestor Municipal</p>
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

                        <h4 style={{ color: 'var(--app-text-color)', marginTop: '20px', fontWeight: 'bold' }}>Cambiar Contraseña</h4>
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
                  
                  <IonCol size="12" sizeMd="5">
                    <IonCard className="profile-card">
                      <IonCardHeader>
                        <IonCardTitle>Preferencias y Sistema</IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        <IonItem lines="full" className="profile-item-clean">
                          <IonIcon icon={isDark ? moonOutline : sunnyOutline} slot="start" style={{ color: 'var(--app-text-muted)' }} />
                          <IonLabel style={{ color: 'var(--app-text-color)' }}>Modo Oscuro</IonLabel>
                          <IonToggle checked={isDark} onIonChange={toggleTheme} />
                        </IonItem>

                        <IonItem lines="full" className="profile-item-clean" style={{ marginTop: '10px' }}>
                          <IonIcon icon={notificationsOutline} slot="start" style={{ color: 'var(--app-text-muted)' }} />
                          <IonLabel style={{ color: 'var(--app-text-color)' }}>Alertas de Propuestas</IonLabel>
                          <IonToggle checked={alertPropuestas} onIonChange={e => setAlertPropuestas(e.detail.checked)} />
                        </IonItem>

                        <IonItem lines="none" className="profile-item-clean">
                          <IonIcon icon={notificationsOutline} slot="start" style={{ color: 'var(--app-text-muted)' }} />
                          <IonLabel style={{ color: 'var(--app-text-color)' }}>Avisos de Fondos</IonLabel>
                          <IonToggle checked={alertFondos} onIonChange={e => setAlertFondos(e.detail.checked)} />
                        </IonItem>

                        <div style={{ marginTop: '30px' }}>
                          <IonButton expand="block" fill="outline" color="medium" onClick={() => { setToastMessage('Acceso a logs simulado'); setShowToast(true); }}>
                            <IonIcon slot="start" icon={documentTextOutline} />
                            Ver Logs del Sistema
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </div>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
              color={toastMessage.includes('no coinciden') ? 'danger' : 'success'}
            />
          </main>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PerfilGestor;
