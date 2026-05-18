import React, { useState } from 'react';
import {
  IonContent, IonPage, IonGrid, IonRow, IonCol,
  IonText, IonSegment, IonSegmentButton, IonLabel,
  IonItem, IonInput, IonButton, IonCheckbox,
  IonIcon, IonSelect, IonSelectOption
} from '@ionic/react';
import { checkmarkCircle, closeCircle, personCircleOutline } from 'ionicons/icons';
import './Auth.css';

// Esta página maneja el login y registro de usuarios, con un diseño simple e intuitivo
const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <IonPage>
      <IonContent fullscreen className="auth-page">
        <IonGrid className="ion-no-padding">
          <IonRow>
            {/* Columna izquierda: Imagen y Branding (Se oculta en móviles pequeños) */}
            <IonCol size="12" sizeMd="6" className="auth-visual-side ion-hide-sm-down">
              <div className="overlay">
                <div className="brand-header">
                  <IonText color="light">
                    <h2>Cultura Municipal</h2>
                  </IonText>
                </div>
                <div className="hero-text">
                  <h1>PATRIMONIO VIVO</h1>
                  <p>Descubre cultores, ferias y oficios tradicionales. Participa en la gestión cultural de tu territorio.</p>
                </div>
              </div>
            </IonCol>

            {/* Columna derecha: Formulario */}
            <IonCol size="12" sizeMd="6" className="auth-form-side">
              <div className="form-container">
                
                {/* Selector de modo */}
                <IonSegment 
                  value={authMode} 
                  onIonChange={(e) => setAuthMode(e.detail.value as any)}
                  className="auth-segment"
                >
                  <IonSegmentButton value="login">
                    <IonLabel>Iniciar sesión</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="register">
                    <IonLabel>Registrarse</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {authMode === 'login' ? (
                  <div className="auth-content fade-in">
                    <h2>Bienvenido de vuelta</h2>
                    <p>Accede para participar en iniciativas culturales de tu comuna.</p>
                    
                    <IonButton expand="block" color="dark" className="clave-unica-btn">
                      Ingresar con Clave Única
                    </IonButton>

                    <div className="separator">
                      <span>o con correo</span>
                    </div>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Correo electrónico</IonLabel>
                      <IonInput type="email" placeholder="sebastian@email.com"></IonInput>
                    </IonItem>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput type="password" placeholder="**********"></IonInput>
                    </IonItem>

                    <div className="auth-options">
                      <IonItem lines="none" className="checkbox-item">
                        <IonCheckbox slot="start"></IonCheckbox>
                        <IonLabel>Recordarme</IonLabel>
                      </IonItem>
                      <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>

                    <IonButton expand="block" className="main-auth-btn">
                      Ingresar
                    </IonButton>
                    
                    <p className="switch-text">
                      ¿No tienes cuenta? <a onClick={() => setAuthMode('register')}>Regístrate aquí</a>
                    </p>
                  </div>
                ) : (
                  <div className="auth-content fade-in">
                    <h2>Crear cuenta</h2>
                    <p>Completa tus datos para unirte a la plataforma.</p>

                    {/* Inputs limpios sin validaciones forzadas */}
                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Nombre de usuario</IonLabel>
                      <IonInput placeholder="Ej. seba_gonzales"></IonInput>
                    </IonItem>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">RUT</IonLabel>
                      <IonInput placeholder="Ej. 12.345.678-9"></IonInput>
                    </IonItem>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Correo electrónico</IonLabel>
                      <IonInput type="email" placeholder="ejemplo@correo.com"></IonInput>
                    </IonItem>

                    {/* Desplegable de Regiones */}
                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Región</IonLabel>
                      <IonSelect placeholder="Seleccionar región" interface="popover">
                        <IonSelectOption value="valparaiso">Región de Valparaíso</IonSelectOption>
                        <IonSelectOption value="metropolitana">Región Metropolitana</IonSelectOption>
                        <IonSelectOption value="coquimbo">Región de Coquimbo</IonSelectOption>
                        <IonSelectOption value="biobio">Región del Biobío</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    {/* Desplegable de Comunas */}
                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Comuna</IonLabel>
                      <IonSelect placeholder="Seleccionar comuna" interface="popover">
                        <IonSelectOption value="vinadelmar">Viña del Mar</IonSelectOption>
                        <IonSelectOption value="valparaiso_comuna">Valparaíso</IonSelectOption>
                        <IonSelectOption value="quilpue">Quilpué</IonSelectOption>
                        <IonSelectOption value="villaalemana">Villa Alemana</IonSelectOption>
                        <IonSelectOption value="santiago">Santiago</IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput type="password" placeholder="**********"></IonInput>
                    </IonItem>

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Confirmar contraseña</IonLabel>
                      <IonInput type="password" placeholder="**********"></IonInput>
                    </IonItem>

                    <IonItem lines="none" className="checkbox-item">
                      <IonCheckbox slot="start"></IonCheckbox>
                      <IonLabel className="ion-text-wrap">
                        Acepto los términos y condiciones y la política de privacidad.
                      </IonLabel>
                    </IonItem>

                    <IonButton expand="block" className="main-auth-btn">
                      Crear cuenta
                    </IonButton>
                  </div>
                )}
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
