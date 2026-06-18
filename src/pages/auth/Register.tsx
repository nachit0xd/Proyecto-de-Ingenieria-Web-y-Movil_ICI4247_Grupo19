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

// Datos de regiones y comunas para el formulario de registro, permitiendo una selección dinámica basada en la región elegida por el usuario
const REGIONES_DATA: Record<string, { nombre: string; comunas: string[] }> = {
  arica: {
    nombre: 'Región de Arica y Parinacota',
    comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
  },
  tarapaca: {
    nombre: 'Región de Tarapacá',
    comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
  },
  antofagasta: {
    nombre: 'Región de Antofagasta',
    comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
  },
  atacama: {
    nombre: 'Región de Atacama',
    comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
  },
  coquimbo: {
    nombre: 'Región de Coquimbo',
    comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
  },
  valparaiso: {
    nombre: 'Región de Valparaíso',
    comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
  },
  ohiggins: {
    nombre: 'Región de O’Higgins',
    comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
  },
  maule: {
    nombre: 'Región del Maule',
    comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
  },
  ñuble: {
    nombre: 'Región de Ñuble',
    comunas: ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
  },
  biobio: {
    nombre: 'Región del Biobío',
    comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
  },
  araucania: {
    nombre: 'Región de La Araucanía',
    comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
  },
  losRios: {
    nombre: 'Región de Los Ríos',
    comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
  },
  losLagos: {
    nombre: 'Región de Los Lagos',
    comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
  },
  aysen: {
    nombre: 'Región de Aysén',
    comunas: ["Coyhaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
  },
  magallanes: {
    nombre: 'Región de Magallanes y la Antártica Chilena',
    comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
  },
  metropolitana: {
    nombre: 'Región Metropolitana de Santiago',
    comunas: ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
  }
};

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

  // Función para formatear el RUT a medida que el usuario lo va ingresando, asegurando un formato consistente y fácil de leer
  const formatRut = (value: string) => {
    const clean = value.replace(/[^0-9kK]/gi, '');
    if (clean.length === 0) return '';
    const dv = clean.slice(-1);
    const body = clean.slice(0, -1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return body.length > 0 ? `${formattedBody}-${dv}` : dv;
  };

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
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.username,
          email: form.email.trim(),
          password: form.password.trim(),
          rol: 'ciudadano' // Default a ciudadano
        })
      });

      if (!response.ok) {
        throw new Error('Error al registrar');
      }

      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      history.push('/auth/login', { prefillEmail: form.email, prefillPassword: form.password });
    } catch (error) {
      alert('Error al crear la cuenta. Intenta con otro correo o revisa la conexión.');
    } finally {
      setSubmitting(false);
    }
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
                    <IonInput value={form.rut} onIonInput={(e) => setForm((p) => ({ ...p, rut: formatRut(e.detail.value ?? '') }))} placeholder="Ej. 12.345.678-9" />
                  </IonItem>
                  {errors.rut && <IonText color="danger"><p>{errors.rut}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Correo electrónico</IonLabel>
                    <IonInput type="email" value={form.email} onIonInput={(e) => setForm((p) => ({ ...p, email: e.detail.value ?? '' }))} placeholder="ejemplo@correo.com" />
                  </IonItem>
                  {errors.email && <IonText color="danger"><p>{errors.email}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Región</IonLabel>
                    <IonSelect value={form.region} onIonChange={(e) => setForm((p) => ({ ...p, region: e.detail.value as string, comuna: '' }))} placeholder="Seleccionar región" interface="popover">
                      {Object.entries(REGIONES_DATA).map(([key, data]) => (
                        <IonSelectOption key={key} value={key}>{data.nombre}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  {errors.region && <IonText color="danger"><p>{errors.region}</p></IonText>}

                  <IonItem lines="none" className="custom-input">
                    <IonLabel position="stacked">Comuna</IonLabel>
                    <IonSelect disabled={!form.region} value={form.comuna} onIonChange={(e) => setForm((p) => ({ ...p, comuna: e.detail.value as string }))} placeholder="Seleccionar comuna" interface="popover">
                      {form.region && REGIONES_DATA[form.region]?.comunas.map((comuna) => (
                        <IonSelectOption key={comuna} value={comuna}>{comuna}</IonSelectOption>
                      ))}
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
