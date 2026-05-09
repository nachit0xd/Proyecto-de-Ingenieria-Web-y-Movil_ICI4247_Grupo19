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

**Descripción:** El sistema debe digitalizar el proceso de postulación a fondos concursables culturales de municipios. El *Ciudadano* (persona o representante de una organización cultural) puede postular a una iniciativa completando un formulario estructurado, adjuntando documentos y haciendo un seguimiento del estado de su postulación. El *Gestor Municipal* revisa las postulaciones, cambia su estado, registra observaciones y publica los resultados.

**Criterios:** 
- La postulación requiere la autenticación con Clave Única y debe estar vinculada al RUT del representante.
- El formulario incluye los campos: nombre de la organización, descripción de la iniciativa, área cultural (oficio, patrimonio, feria, expresión), presupuesto estimado, impacto esperado y documentos adjuntos (en formato PDF).
- El sistema muestra el estado de cada postulación: borrador, enviada, en revisión, aprobada/rechazada, en ejecución, finalizada.
- El gestor puede cambiar estados, agregar observaciones y notificar al postulante mediante el sistema.
- Los resultados de cada convocatoria se publican en una sección visible para todos los ciudadanos y está disponible a votación (RF05).

**Relación con caso de la vida real:**
El requerimiento responde a la necesidad de digitalización y mejoras en el proceso de postulación a fondos municipales culturales.

## RF05 — Módulo de Propuestas Ciudadanas para Iniciativas Culturales
**Roles participantes:** Ciudadano (propuesta y votación) y Gestor Municipal (moderación y respuesta)

**Descripción:** El sistema debe permitir que el *Ciudadano* pueda apoyar las propuestas de otros ciudadanos (RF04) mediante votación popular. El *Gestor Municipal* modera el contenido, responde oficialmente a cada propuesta y puede escalarla a una convocatoria de fondos (RF04) si supera cierto umbral de apoyo.

**Criterios:** 
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
- El gestor municipal puede agregar indicadores de forma manual, como: monto total adjudicado en fondos, número de beneficiarios, etc.
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

# Requerimientos No Funcionales

## RNF01 — Rendimiento
**Descripción:** El sistema debe garantizar tiempos de respuesta adecuados tanto en condiciones normales como en momentos de alta concurrencia, considerando que puede ser utilizado desde zonas con conectividad limitada (comunas rurales y mixtas).

**Criterios Medibles:**
- Carga de pantalla principal (≤ 3 segundos).
- Carga del catálogo patrimonial (≤ 5 segundos para los primeros resultados).
- Carga del mapa interactivo (≤ 5 segundos con conexión adecuada).
- Concurrencia soportada sin degradación (mínimo 100 usuarios al mismo tiempo).

## RNF02 — Seguridad
**Descripción:** El sistema debe proteger los datos de los ciudadanos y garantizar que únicamente usuarios autorizados puedan ejecutar acciones sensibles, cumpliendo la ley chilena.

**Criterios Medibles:**
- Autenticación de ciudadano (integración de **Clave Única** de Chile).
- Comunicación Cliente-Servidor (HTTPS en todos los endpoints).
- Datos sensibles (el RUT ciudadano no debe exponerse en ningún momento).
- Registro actualizado (el sistema registra cada acción crítica del gestor, como creación, edición, eliminación o cambio de estado de variables).

## RNF03 — Usabilidad
**Descripción:** El sistema debe ser accesible, intuitivo y usable para una audiencia diversa que incluye ciudadanos de comunas rurales, personas con baja alfabetización digital y adultos mayores.

**Criterios Medibles:**
- Diseño responsivo (la interfaz debe adaptarse a pantallas de escritorio y móviles).
- Lenguaje (todos los textos deben estar en lenguaje simple y evitar tecnicismos municipales).
- Consistencia visual (el sistema debe mantener un diseño coherente, una paleta de colores definida y componentes reutilizables, como botones o símbolos).
- Feedback de acciones (una acción del usuario, como votar o comentar, debe recibir una confirmación visual rápida).
- Accesibilidad (se deben cumplir criterios de accesibilidad, como contraste mínimo, textos alternativos con imágenes o navegación por teclado).
