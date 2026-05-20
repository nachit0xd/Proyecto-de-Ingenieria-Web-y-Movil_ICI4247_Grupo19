import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonText, IonItem, IonInput, IonButton, IonCheckbox, IonLabel, IonSelect, IonSelectOption
} from '@ionic/react';
import './Auth.css'; // El CSS de esta página se encuentra en el mismo archivo que el login, ya que comparten estilos y diseño similar

// La página de registro es el punto de entrada para nuevos usuarios que desean unirse a la plataforma 
// Aquí pueden crear una cuenta proporcionando su nombre de usuario, RUT, correo electrónico, región, comuna, y una contraseña segura 
// El formulario incluye validaciones para asegurar que los datos ingresados sean correctos y completos antes de permitir la creación de la cuenta. Al finalizar el registro, el usuario es redirigido al login con sus datos prellenados para facilitar el acceso

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rutRegex = /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Register: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    username: '',
    rut: '',
    email: '',
    region: '',
    comuna: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Validación del formulario de registro, con mensajes de error específicos para cada campo
  const validate = () => {
    const e: any = {};
    if (!form.username.trim()) e.username = 'El nombre de usuario es obligatorio.';
    if (!form.rut.trim()) e.rut = 'El RUT es obligatorio.';
    else if (!rutRegex.test(form.rut.trim())) e.rut = 'Formato de RUT inválido. Ejemplo: 12.345.678-9';
    if (!form.email.trim()) e.email = 'El correo es obligatorio.';
    else if (!emailRegex.test(form.email.trim())) e.email = 'Ingresa un correo válido.';
    if (!form.region) e.region = 'Selecciona una región.';
    if (!form.comuna) e.comuna = 'Selecciona una comuna.';
    if (!form.password.trim()) e.password = 'La contraseña es obligatoria.';
    else if (form.password.trim().length < 8) e.password = 'La contraseña debe tener al menos 8 caracteres.';
    if (!form.confirmPassword.trim()) e.confirmPassword = 'Debes confirmar la contraseña.';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden.';
    if (!form.acceptTerms) e.acceptTerms = 'Debes aceptar los términos y condiciones.';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    await wait(700);
    setSubmitting(false);

    // Simulación: redirigir al login con prefill
    history.push('/auth/login', { prefillEmail: form.email, prefillPassword: form.password });
  };

  return (
    <IonPage>
      <IonContent fullscreen className="auth-page">
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol size="12" sizeMd="6" className="auth-visual-side ion-hide-sm-down">
              <div className="overlay">
                <div className="brand-header">
                  <IonText color="light">
                    <h2>Cultura Municipal</h2>
                  </IonText>
                </div>
                <div className="hero-text">
                  <h1>PATRIMONIO VIVO</h1>
                  <p>Completa tus datos para unirte a la plataforma.</p>
                </div>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="6" className="auth-form-side">
              <div className="form-container">
                <div className="auth-content fade-in">
                  <h2>Crear cuenta</h2>

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Nombre de usuario</IonLabel>
                    <IonInput value={form.username} onIonInput={(e) => setForm((p) => ({ ...p, username: e.detail.value ?? '' }))} placeholder="Ej. seba_gonzales" />
                  </IonItem>
                  {errors.username && <IonText color="danger"><p>{errors.username}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">RUT</IonLabel>
                    <IonInput value={form.rut} onIonInput={(e) => setForm((p) => ({ ...p, rut: e.detail.value ?? '' }))} placeholder="Ej. 12.345.678-9" />
                  </IonItem>
                  {errors.rut && <IonText color="danger"><p>{errors.rut}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput type="email" value={form.email} onIonInput={(e) => setForm((p) => ({ ...p, email: e.detail.value ?? '' }))} placeholder="ejemplo@correo.com" />
                  </IonItem>
                  {errors.email && <IonText color="danger"><p>{errors.email}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Región</IonLabel>
                    <IonSelect value={form.region} onIonChange={(e) => setForm((p) => ({ ...p, region: e.detail.value as string }))} placeholder="Seleccionar región" interface="popover">
                      <IonSelectOption value="valparaiso">Región de Valparaíso</IonSelectOption>
                      <IonSelectOption value="metropolitana">Región Metropolitana</IonSelectOption>
                      <IonSelectOption value="coquimbo">Región de Coquimbo</IonSelectOption>
                      <IonSelectOption value="biobio">Región del Biobío</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  {errors.region && <IonText color="danger"><p>{errors.region}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Comuna</IonLabel>
                    <IonSelect value={form.comuna} onIonChange={(e) => setForm((p) => ({ ...p, comuna: e.detail.value as string }))} placeholder="Seleccionar comuna" interface="popover">
                      <IonSelectOption value="vinadelmar">Viña del Mar</IonSelectOption>
                      <IonSelectOption value="valparaiso_comuna">Valparaíso</IonSelectOption>
                      <IonSelectOption value="quilpue">Quilpué</IonSelectOption>
                      <IonSelectOption value="villaalemana">Villa Alemana</IonSelectOption>
                      <IonSelectOption value="santiago">Santiago</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  {errors.comuna && <IonText color="danger"><p>{errors.comuna}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Contraseña</IonLabel>
                    <IonInput type="password" value={form.password} onIonInput={(e) => setForm((p) => ({ ...p, password: e.detail.value ?? '' }))} placeholder="**********" />
                  </IonItem>
                  {errors.password && <IonText color="danger"><p>{errors.password}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Confirmar contraseña</IonLabel>
                    <IonInput type="password" value={form.confirmPassword} onIonInput={(e) => setForm((p) => ({ ...p, confirmPassword: e.detail.value ?? '' }))} placeholder="**********" />
                  </IonItem>
                  {errors.confirmPassword && <IonText color="danger"><p>{errors.confirmPassword}</p></IonText>}

                  <IonItem lines="none" className="checkbox-item">
                    <IonCheckbox slot="start" checked={form.acceptTerms} onIonChange={(e) => setForm((p) => ({ ...p, acceptTerms: e.detail.checked }))} />
                    <IonLabel className="ion-text-wrap">Acepto los términos y condiciones y la política de privacidad.</IonLabel>
                  </IonItem>
                  {errors.acceptTerms && <IonText color="danger"><p>{errors.acceptTerms}</p></IonText>}

                  <IonButton expand="block" className="main-auth-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
                  </IonButton>

                  <p className="switch-text">¿Ya tienes cuenta? <a onClick={() => history.push('/auth/login')}>Inicia sesión aquí</a></p>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Register;
