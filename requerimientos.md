# Requerimientos Funcionales

## RF01 — Catálogo Interactivo de Patrimonio Cultural y Oficios Tradicionales
**Roles participantes:** Ciudadano (consultas) y Gestor Municipal (administración).

**Descripción:** El sistema debe permitir al *Gestor Municipal* registrar, editar y publicar fichas detalladas de elementos del patrimonio cultural de la comuna, incluyendo oficios tradicionales, expresiones culturales y cultores locales. El *Ciudadano* puede explorar este catálogo cultural mediante la búsqueda por categoría, territorio o palabra clave, accediendo a información didáctica con texto, imágenes, audio y video.

**Criterios:** 
- El gestor del sistema puede crear fichas con los campos: nombre, descripción, categoría (oficio, lugar, cultor), ubicación geográfica, multimedia adjunta y estado de publicación.
- El ciudadano puede filtrar por categoría, sector de la comuna y texto libre.
- Cada ficha muestra la información en formato didáctico accesible, es decir, en un lenguaje simple, con imágenes y opcionalmente con audio.
- Las fichas publicadas son visibles sin autenticación necesaria.

**Relación con caso de la vida real:**
Una iniciativa de San Pedro de Atacama describe la "ausencia de identidad local definida" y el bajo conocimiento ciudadano de iniciativas municipales locales.

## RF02 — Mapa Interactivo de Ferias, Cultores y Espacios Culturales
**Roles participantes:** Ciudadano (visualización) y Gestor Municipal (gestión de capas)

**Descripción:** El sistema debe presentar un mapa con georeferencia de la comuna. El *Ciudadano* puede visualizar la ubicación de ferias activas, talleres de oficios, espacios patrimoniales y cultores registrados. El *Gestor Municipal* administra las capas del mapa, activando/desactivando puntos según la vigencia actual y agregando información a cada marcador.

**Criterios:** 
- El mapa muestra capas diferenciadas por tipo (feria, cultores, espacios patrimoniales, eventos).
- Cada marcador despliega una tarjeta con nombre, descripción, horario/fecha si aplica y un enlace a la ficha completa del catálogo (RF01).
- El gestor puede activar/desactivar y editar marcadores desde el panel de administración.
- El ciudadano puede alternar la visibilidad de capas según su interés.

**Relación con caso de la vida real:**
Se toma inspiración de la Plataforma de Infraestructura de Datos Espaciales (IDE), una iniciativa del municipio de Temuco.

## RF03 — Agenda Cultural Comunal con Calendario de Ferias y Eventos
**Roles participantes:** Ciudadano (consulta y suscripción) y Gestor Municipal (publicación)

**Descripción:** El sistema debe gestionar una agenda cultural donde el *Gestor Municipal* publique ferias, talleres, festividades locales y eventos patrimoniales con fecha, lugar, descripción y organizador. El *Ciudadano* puede explorar la agenda, filtrar por tipo de evento y guardar eventos de interés en su lista, sin necesidad de autenticación para consultar, pero con el requerimiento de identificación para guardar.

**Criterios:** 
- El gestor puede crear, editar, cancelar y destacar eventos con los campos: título, descripción, tipo, fecha de inicio/fin, ubicación (se vincula al mapa de RF02), organizador e imagen.
- El ciudadano puede filtrar eventos por tipo, fecha y sector de la comuna.
- Los eventos próximos se destacan en la pantalla inicial de la aplicación.
- El ciudadano autenticado en la aplicación puede marcar eventos como favoritos y verlos en su agenda personal. 

**Relación con caso de la vida real:**
El requerimiento se basa en la falta de difusión de actividades culturales en varios municipios del documento.

## RF04 — Sistema de Postulación y Seguimiento de Fondos Culturales Municipales
**Roles participantes:** Ciudadano/Organización (postulación) y Gestor Municipal (evaluación y seguimiento)

**Descripción:** El sistema debe digitalizar el proceso de postulación a fondos concursables culturales de municipios. El *Ciudadano* (persona o representante de una organización cultural) puede postular a una iniciativa completando un formulario estructurado de 4 pasos, adjuntando documentos y haciendo un seguimiento del estado de su postulación. El *Gestor Municipal* revisa las postulaciones, cambia su estado, registra observaciones y publica los resultados.

**Criterios:** 
- La postulación requiere la autenticación y debe estar vinculada al RUT del representante.
- El formulario incluye los campos: nombre de la organización, descripción de la iniciativa, área cultural (oficio, patrimonio, feria, expresión), presupuesto estimado, impacto esperado y documentos adjuntos (en formato PDF).
- El sistema muestra el estado de cada postulación: en revisión, aprobada/rechazada, requiere ajustes.
- El gestor puede cambiar estados, agregar observaciones y notificar al postulante mediante el sistema.
- Los resultados de cada convocatoria se publican en una sección visible para todos los ciudadanos (RF05).

**Relación con caso de la vida real:**
El requerimiento responde a la necesidad de digitalización y mejoras en el proceso de postulación a fondos municipales culturales.

## RF05 — Módulo de Propuestas Ciudadanas para Iniciativas Culturales
**Roles participantes:** Ciudadano (propuesta y votación) y Gestor Municipal (moderación y respuesta)

**Descripción:** El sistema debe permitir que el *Ciudadano* pueda proponer propuestas y apoyar las de otros ciudadanos (RF04) mediante votación popular. El *Gestor Municipal* modera el contenido, responde oficialmente a cada propuesta y puede escalarla a una convocatoria de fondos si supera cierto umbral de apoyo.

**Criterios:** 
- El ciudadano puede llenar un formulario simple con su idea y descripción de una propuesta.
- Otros ciudadanos autenticados pueden votar a favor de una propuesta (un voto por ciudadano por cada propuesta).
- Las propuestas se ordenan por número de votos y fecha de creación.
- El gestor municipal puede moderar (aprobar, rechazar o marcar como duplicada una publicación) y responder oficialmente las propuestas.
- Cuando una propuesta supera un límite de votos, el sistema alerta al gestor y habilita la opción de vincularla a una convocatoria de fondos.
- El ciudadano que propuso la iniciativa recibe notificaciones ante cualquier cambio de estado.

**Relación con caso de la vida real:**
El requerimiento se basa en la iniciativa "Participa Las Condes", una Plataforma Digital de Participación Ciudadana del municipio de Las Condes.

## RF06 — Panel de Indicadores y Transparencia de la Gestión Cultural
**Roles participantes:** Ciudadano (consulta) y Gestor Municipal (configuración y actualización)

**Descripción:** El sistema debe exponer un panel público con indicadores actualizados sobre la gestión cultural municipal, que incluye el número de cultores registrados, fondos adjudicados, iniciativas en ejecución, eventos realizados y participación ciudadana. El *Gestor Municipal* puede configurar qué indicadores se publican y actualizar manualmente los que no se pueden calcular automáticamente.

**Criterios:** 
- El panel es visible para todos los ciudadanos, sin autenticación.
- El panel muestra indicadores calculados automáticamente: total de fichas en el catálogo, eventos publicados, postulaciones recibidas/aprobadas, propuestas ciudadanas activas y total de votos registrados.
- El gestor municipal puede agregar indicadores de forma manual.
- Los indicadores se pueden presentar como valores númericos o con gráficos simples.

**Relación con caso de la vida real:**
El requerimiento se inspira en la transparencia implementada en la herramienta digital "Rinde Cuentas" del municipio de Lo Barnechea.

## RF07 — Valoración y Comentarios Ciudadanos sobre Patrimonio y Eventos
**Roles participantes:** Ciudadano (valoración) y Gestor Municipal (moderación)

**Descripción:** El sistema debe permitir que el *Ciudadano* autenticado valore y comente las fichas del catálogo patrimonial (RF01) y los eventos realizados (RF03), generando retroalimentación útil para la gestión municipal cultural. El *Gestor Municipal* modera los comentarios y puede usar las valoraciones como insumo para priorizar contenido y recursos.

**Criterios:** 
- El ciudadano autenticado puede dejar una valoración (escala de 1 a 5 estrellas) y un comentario textual en fichas del catálogo y eventos pasados.
- Cada ciudadano puede valorar una ficha o evento una única vez, pero puede modificar su valoración.
- Los comentarios son visibles públicamente tras pasar por una revisión del gestor, que los aprueba o rechaza.
- El gestor visualiza un resumen de valoraciones promedio por ficha y evento en su panel de administración.
- Las fichas y eventos mejor valorados se destacan en la pantalla de inicio de la aplicación.

**Relación con caso de la vida real:**
El requerimiento se basa en algunas iniciativas que implementan mecanismos de consulta ciudadana, como "Viña Decide" de Viña del Mar.

## RF08 — Gestión de Identidad (Autenticación)
**Roles participantes:** Ciudadano y Gestor Municipal.

**Descripción:** El sistema debe proveer un mecanismo seguro para que los usuarios puedan registrarse e iniciar sesión utilizando su correo electrónico y contraseña. Esta funcionalidad es la entrada a los servicios personalizados y administrativos de la plataforma.

**Criterios:**
- Formulario de registro con validación de formato de correo electrónico y contraseña.
- Emisión de un Token Web JSON (JWT) con encriptación tras un login exitoso.
- Persistencia de sesión en el cliente (localStorage).

**Relación con caso de la vida real:**
Responde a la necesidad de mantener trazabilidad en los procesos de postulación y participación ciudadana, evitando el anonimato en votaciones comunitarias.

## RF09 — Diferenciación de Roles (Autorización)
**Roles participantes:** Sistema (Backend).

**Descripción:** El sistema debe aislar lógicamente las capacidades de lectura y escritura dependiendo del rol asignado al usuario durante el registro, aplicando el principio de menores privilegios (Role-Based Access Control).

**Criterios:**
- Todo nuevo usuario registrado asume por defecto el rol de "Ciudadano" (prevención de escalamiento de privilegios).
- Las vistas administrativas (Dashboard Gestor) son inaccesibles desde la interfaz si el usuario no posee el rol adecuado.
- La API rechaza cualquier intento de mutación de datos (POST/PUT/DELETE) sobre recursos protegidos si el JWT no contiene el claim de rol `gestor`.

**Relación con caso de la vida real:**
Garantiza la seguridad y la correcta delegación de tareas administrativas dentro de una DIDECO o Dirección Cultural Municipal.

## RF10 — Centro de Notificaciones
**Roles participantes:** Ciudadano y Gestor Municipal.

**Descripción:** El sistema debe informar proactivamente a los usuarios sobre cambios relevantes en sus interacciones con la municipalidad, manteniendo un registro histórico de estas alertas.

**Criterios:**
- Ícono de campana interactivo en la barra superior con contador de notificaciones no leídas.
- Generación automática de notificaciones ante cambios de estado (ej. "Tu postulación ha sido aprobada", "Nueva propuesta ciudadana requiere revisión").
- Capacidad de marcar notificaciones como leídas.

**Relación con caso de la vida real:**
Resuelve la queja común ciudadana sobre la falta de retroalimentación tras enviar trámites o participar en propuestas municipales.

## RF11 — Gestión Multimedia en la Nube
**Roles participantes:** Ciudadano y Gestor Municipal.

**Descripción:** El sistema debe soportar la carga y almacenamiento de archivos multimedia (imágenes) para enriquecer perfiles de usuario, fichas de patrimonio, eventos y propuestas, delegando el almacenamiento a un servicio en la nube (Cloudinary).

**Criterios:**
- El usuario puede subir su foto de perfil.
- El gestor puede adjuntar imágenes ilustrativas al crear fichas de catálogo o eventos.
- Las imágenes no se almacenan en el disco duro local del servidor, sino que se suben a Cloudinary mediante una integración API (Multer-Storage-Cloudinary).

**Relación con caso de la vida real:**
Permite visibilizar de forma mucho más atractiva e interactiva el patrimonio y las ferias locales, fomentando el interés turístico.

---

# Requerimientos No Funcionales

## RNF01 — Rendimiento
**Descripción:** El sistema debe garantizar tiempos de respuesta rápidos y fluidos, optimizando la experiencia del usuario para evitar la deserción, incluso en redes móviles (4G).

**Criterios Medibles:**
- **Tiempo de carga inicial:** La interfaz SPA debe cargar su estructura base (*First Contentful Paint*) en **≤ 1.5 segundos**.
- **Carga de catálogo:** El catálogo patrimonial debe renderizar los primeros 10 resultados en **≤ 2 segundos**.

## RNF02 — Escalabilidad
**Descripción:** El sistema backend y la base de datos deben ser capaces de procesar múltiples solicitudes simultáneas sin interrupción del servicio, pensando en picos de tráfico durante apertura de fondos o votaciones de propuestas.

**Criterios Medibles:**
- **Concurrencia:** La API (Express.js) y la DB (PostgreSQL) deben soportar sin degradación al menos **100 usuarios interactuando simultáneamente**.

## RNF03 — Autenticación
**Descripción:** El sistema debe proteger las cuentas ciudadanas y municipales contra ataques automatizados o intentos de vulneración de contraseñas.

**Criterios Medibles:**
- **Límite de peticiones (Rate Limiting):** El endpoint de login debe bloquear la IP del cliente tras **5 intentos fallidos en una ventana de 15 minutos** (previniendo ataques de fuerza bruta).
- **Criptografía:** Las contraseñas deben almacenarse procesadas por algoritmos de hashing unidireccional (*bcrypt*).

## RNF04 — Autorización o RBAC
**Descripción:** La capa de la API debe ser completamente invulnerable a accesos no autorizados mediante inyección o alteración de tokens.

**Criterios Medibles:**
- **Tolerancia cero a intrusiones:** El **100% de los endpoints administrativos** (POST, PUT, DELETE sobre entidades gestoras) deben rechazar solicitudes (Código HTTP 403 o 401) si el token JWT enviado en la cabecera no contiene la inyección encriptada del rol `gestor`.

## RNF05 — Infraestructura
**Descripción:** El código fuente y el servidor no deben permitir la exposición accidental de claves criptográficas vitales en entornos comprometidos o mal configurados.

**Criterios Medibles:**
- **Fail-Fast de secretos:** El tiempo de apagado del servidor Node.js debe ser de **0 segundos** tras su inicio (terminación inmediata `process.exit`) si no se detecta la variable de entorno crítica `JWT_SECRET`.

## RNF06 — Usabilidad
**Descripción:** El sistema debe ser altamente interactivo, confirmándole al usuario visualmente que sus acciones están siendo procesadas para evitar confusiones o dobles envíos.

**Criterios Medibles:**
- **Retroalimentación de UI:** El tiempo de feedback del sistema ante interacciones críticas (enviar formularios, votar, iniciar sesión) no debe superar **1 segundo** sin mostrar un indicador de carga visual (*Spinner* o *Toast*).
- **Accesibilidad:** Uso estricto de componentes nativos Ionic que aseguran áreas de toque grandes (mínimo 44x44 px) aptas para dispositivos móviles.

## RNF07 — Portabilidad
**Descripción:** La plataforma debe estar desacoplada del sistema operativo anfitrión para facilitar su instalación, distribución y despliegue por parte de otros equipos municipales o desarrolladores.

**Criterios Medibles:**
- **Tiempo de Despliegue:** El sistema completo (Base de Datos, Backend API y Frontend compilado) debe poder orquestarse, compilarse y levantarse en **≤ 3 minutos** en un servidor nuevo utilizando exclusivamente el comando único `docker compose up --build`.
