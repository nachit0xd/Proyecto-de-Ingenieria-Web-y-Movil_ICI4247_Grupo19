import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonText, IonSegment, IonSegmentButton, IonLabel,
IonItem, IonInput, IonButton, IonCheckbox
} from '@ionic/react';
import { UserRole } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

// Esta página maneja el login de usuarios, con un diseño simple e intuitivo.
// El formulario de login permite a los usuarios ingresar con su correo y contraseña, o usar Clave Única (pendiente de implementar).
// El formulario de registro solicita información básica para crear una cuenta, con validaciones simples para mejorar la experiencia del usuario.

interface LoginFormState {
  email: string;
  password: string;
}

type FormErrors<T extends string> = Partial<Record<T, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validaciones de los formularios de login y registro, con mensajes de error claros para guiar al usuario a corregir los campos
const validateLogin = (form: LoginFormState): FormErrors<'email' | 'password'> => {
  const errors: FormErrors<'email' | 'password'> = {};

  if (!form.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (!form.password.trim()) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (form.password.trim().length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
};

const Auth: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const { login, isAuthenticated, role } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: '',
    password: ''
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors<'email' | 'password'>>({});
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [authError, setAuthError] = useState('');

    useEffect(() => {
      if (isAuthenticated && role) {
        // Redirigir a la ruta destino después de autenticarse
        const destination = resolveDestination(role);
        history.replace(destination);
      }
    }, [isAuthenticated, role, history, location.state?.from]);

  const resolveDestination = (nextRole: UserRole) => {
    const from = location.state?.from;

    if (!from) {
      return nextRole === 'gestor' ? '/gestor/dashboard' : '/ciudadano/inicio';
    }

    if (nextRole === 'gestor' && from.startsWith('/gestor')) {
      return from;
    }

    if (nextRole === 'ciudadano' && from.startsWith('/ciudadano')) {
      return from;
    }

    return nextRole === 'gestor' ? '/gestor/dashboard' : '/ciudadano/inicio';
  };

  const handleLogin = async () => {
    const errors = validateLogin(loginForm);
    setLoginErrors(errors);
    setAuthError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmittingLogin(true);

    try {
      await login(loginForm.email.trim(), loginForm.password.trim());
    } catch {
      setAuthError('No fue posible iniciar sesión. Intenta nuevamente.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

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
                
                {/* Selector de modo (redirige a registro) */}
                <IonSegment
                  value={authMode}
                  onIonChange={(e) => {
                    const v = e.detail.value as string;
                    if (v === 'register') {
                      history.push('/auth/register');
                    } else {
                      setAuthMode('login');
                    }
                  }}
                  className="auth-segment"
                >
                  <IonSegmentButton value="login">
                    <IonLabel>Iniciar sesión</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="register">
                    <IonLabel>Registrarse</IonLabel>
                  </IonSegmentButton>
                </IonSegment>

                {authMode === 'login' && (
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
                      <IonInput
                        type="email"
                        value={loginForm.email}
                        onIonInput={(e) => {
                          const value = e.detail.value ?? '';
                          setLoginForm((prev) => ({ ...prev, email: value }));
                          if (loginErrors.email) {
                            setLoginErrors((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        placeholder="sebastian@email.com"
                      />
                    </IonItem>
                    {loginErrors.email && (
                      <IonText color="danger">
                        <p>{loginErrors.email}</p>
                      </IonText>
                    )}

                    <IonItem lines="none" className="custom-input">
                      <IonLabel position="stacked">Contraseña</IonLabel>
                      <IonInput
                        type="password"
                        value={loginForm.password}
                        onIonInput={(e) => {
                          const value = e.detail.value ?? '';
                          setLoginForm((prev) => ({ ...prev, password: value }));
                          if (loginErrors.password) {
                            setLoginErrors((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        placeholder="**********"
                      />
                    </IonItem>
                    {loginErrors.password && (
                      <IonText color="danger">
                        <p>{loginErrors.password}</p>
                      </IonText>
                    )}



                    <div className="auth-options">
                      <IonItem lines="none" className="checkbox-item">
                        <IonCheckbox slot="start"></IonCheckbox>
                        <IonLabel>Recordarme</IonLabel>
                      </IonItem>
                      <a href="#">¿Olvidaste tu contraseña?</a>
                    </div>

                    {authError && (
                      <IonText color="danger">
                        <p>{authError}</p>
                      </IonText>
                    )}

                    <IonButton
                      expand="block"
                      className="main-auth-btn"
                      onClick={handleLogin}
                      disabled={isSubmittingLogin}
                    >
                      {isSubmittingLogin ? 'Ingresando...' : 'Ingresar'}
                    </IonButton>
                    
                    <p className="switch-text">
                      ¿No tienes cuenta? <a onClick={() => history.push('/auth/register')}>Regístrate aquí</a>
                    </p>
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
