# Proyecto de Ingeniería Web y Móvil: "Fomento de la cultura y el patrimonio local"

**Integrantes:** Nicolas Soto, Agustin Tapia, Ignacio Carrillo, Julian Toro

**Curso:** ICI 4247-1

**Grupo:** 19

# Tabla de Contenidos

1. [Introducción al proyecto](#introducción-al-proyecto)
2. [Justificación del Problema](#justificación-del-problema)
3. [Análisis del Usuario Objetivo](#análisis-del-usuario-objetivo)
4. [Requerimientos del Sistema](#requerimientos-del-sistema)
5. [Arquitectura de Navegación y UX](#arquitectura-de-navegación-y-ux)
6. [Instrucciones de Ejecución](#instrucciones-de-ejecución)

# Introducción al proyecto
 
## Contexto
El trabajo que se presenta en este documento surge del análisis de la publicación "Buenas prácticas de Participación Ciudadana en la Gestión Municipal"  por parte de la Subsecretaría de Desarrollo Regional y Administrativo (SUBDERE) en el año 2024. Esta publicación digital presenta 32 iniciativas de buenas prácticas de participación ciudadana en municipios de todo el país que sirven como herramienta de referencia para lograr una gestión municipal más inclusiva y participativa.

A partir de la investigación del documento, se identificó cierta problemática en algunos municipios: la falta de herramientas digitales que visibilicen y promuevan el patrimonio cultural local, los oficios tradicionales y las ferias comunitarias de forma didáctica, con información centralizada y accesible para todos los ciudadanos.

## Objetivo General
El objetivo es desarrollar una plataforma web y móvil que conecte al municipio local con las organizaciones culturales y la ciudadanía en el contexto del patrimonio y ferias tradicionales de la comuna, con enfásis en la participación ciudadana y facilidad de acceso en la gestión municipal cultural.

## Objetivos Específicos
- Visibilizar el patrimonio cultural, trabajos tradicionales y ferias locales de una comuna mediante un catálogo digital interactivo.
- Centralizar la agenda de ferias y eventos culturales de la comuna en una sola plataforma digital.
- Facilitar la participación ciudadana mediante propuestas, votaciones y valoraciones sobre iniciativas culturales locales.
- Digitalizar el proceso de postulación y seguimiento de fondos culturales municipales.
- Promover la transparencia en la gestión cultural municipal mediante indicadores públicos y accesibles

## Alcance
La plataforma está diseñada para ser implementada en cualquier municipalidad de Chile, con especial consideración para comunas rurales y/o mixtas donde la identidad cultural local es menor y existe una necesidad de digitalización de procesos administrativos dentro de un municipio.

# Justificación del Problema

## Problema General
Algunas municipalidades de Chile carecen de herramientas digitales que promuevan el patrimonio cultural y ferias locales de su comuna, especialmente aquellas ubicadas en zonas rurales y con poco acceso a tecnologías actuales, lo que a su vez dificulta la participación ciudadana y la gestión cultural municipal.

## Evidencias del Problema
El análisis del documento de la SUBDERE evidencia algunas brechas, como por ejemplo:

| Problemática | Evidencia |
|-----------|-----------|
| Desconocimiento ciudadano | El 42,5% de los ciudadanos tiene un bajo conocimiento de iniciativas municipales (San Pedro de la Paz, Región Bío-Bío, 2023) |
| Falta de información territorial | La iniciativa menciona la "Escasa información territorial para toma de decisiones" (San Pedro de Atacama, Región Antofagasta, 2020) |
| Baja asociatividad | La iniciativa reconoce una "Falta de asociatividad entre actores involucrados" en el sector cultural (San Pedro de Atacama, Región Antofagasta, 2020) |
| Ausencia de la identidad local | Un diagnóstico reconoce la ausencia de identidad local definida (San Pedro de Atacama, Región Antofagasta, 2020) |
| Acceso desigual | El 68,75% de las buenas prácticas se concentra en comunas urbanas, dejando rezagadas a las rurales y mixtas |
| Transparencia limitada | Las iniciativas de transparencia en gestión municipal solo representan el 21,88% de las prácticas documentadas |


## ¿Por qué una plataforma digital web para solucionar el problema?
- El documento base se refiere a las plataformas digitales como el mecanismo de participación de mayor crecimiento post-pandemia y también debido a la socialización y masificación de este tipo de medios.
- El uso de TICs aparece en el 18,75% de las buenas prácticas como mecanismo clave (revisar gráfico n°3 del documento).
- Permite alcanzar a grupos que no participan presencialmente de forma concurrente (ej: jóvenes, personas cuidadoras, habitantes de sectores alejados, tercera edad, entre otros).
  
# Análisis del Usuario Objetivo

## Roles del Sistema
La plataforma tiene dos roles principales:

### Rol 1: Ciudadano

#### Descripción General
El Ciudadano puede ser un vecino, turista o cualquier tipo de persona que accede a la página para descubrir, participar y calificar el patrimonio cultural de la comuna. Es necesario autenticarse en la plataforma para identificarse y realizar acciones interactivas (RUT + Clave Única).

#### Tipos de Ciudadano
| Tipo | Características | Necesidad Principal |
|----------|----------------|---------------------|
| Vecino residente | Vive en la comuna, conoce la cultura local | Informarse sobre eventos y ferias cercanas |
| Artesano / cultor | Practica un oficio tradicional | Visibilizar su trabajo y postular a fondos |
| Dirigente comunitario | Representa a una organización cultural | Gestionar postulaciones y proponer iniciativas |
| Turista | Visita la comuna temporalmente | Descubrir patrimonio y agenda cultural |
| Joven / estudiante | Baja participación presencial histórica | Participar digitalmente en decisiones culturales |
| Adulto mayor | Puede tener baja alfabetización digital | Acceder a información con interfaz simple |

#### Características del Contexto
- Acceso principalmente desde smartphone.
- Conectividad variable (estable en zonas urbanas, limitada en sectores rurales).
- Nivel de alfabetización digital: heterogéneo.

#### Necesidades Funcionales
- Explorar catálogo de patrimonio y oficios.
- Consultar agenda de ferias y eventos.
- Visualizar mapa cultural de la comuna con información simple de eventos.
- Proponer iniciativas culturales de forma sencilla.
- Votar por propuestas de otros ciudadanos.
- Postular a fondos culturales ofrecidos por la municipalidad.
- Calificar y comentar fichas y eventos.
- Consultar indicadores de gestión cultural.

---

### Rol 2: Gestor Municipal

#### Descripción General
El Gestor Municipal puede ser un funcionario de la Dirección de Cultura, Dirección de Desarrollo Comunitario (DIDECO) u oficina equivalente del municipio, responsable de administrar el contenido, gestionar fondos y monitorear la participación ciudadana. Accede a la plataforma con credenciales institucionales provistas por el municipio.

#### Características del Contexto
- Acceso principalmente desde un computador de escritorio o notebook.
- Conectividad estable.
- Nivel de alfabetización digital: media-alta.
- Tiene un tiempo disponible limitado debido a las múltiples responsabilidades de su cargo.

#### Necesidades Funcionales
- Crear y editar fichas del catálogo patrimonial cultural.
- Gestionar capas y marcadores del mapa interactivo.
- Publicar y administrar eventos en la agenda de la plataforma.
- Crear convocatorias de fondos culturales.
- Revisar y cambiar estado de postulaciones.
- Moderar propuestas y comentarios ciudadanos.
- Configurar y actualizar indicadores del panel de transparencia.
- Permitir el seguimiento de estado de iniciativas para ciudadanos.
- Obtener datos sobre participación e impacto cultural de iniciativas para la toma de decisiones.

# Requerimientos del Sistema

## Requerimientos Funcionales
| ID | Nombre | Roles | Descripción Breve |
|----|--------|-------|-------------------|
| RF01 | Catálogo de Patrimonio y Oficios | Ciudadano / Gestor | Fichas didácticas de elementos culturales con multimedia y georreferencia |
| RF02 | Mapa Interactivo Cultural | Ciudadano / Gestor | Mapa con capas diferenciadas de ferias, cultores y espacios patrimoniales |
| RF03 | Agenda Cultural Comunal | Ciudadano / Gestor | Calendario centrado en ferias, talleres y eventos con favoritos |
| RF04 | Postulación a Fondos Culturales | Ciudadano / Gestor | Formulario de múltiples pasos para postulación con seguimiento de estado |
| RF05 | Propuestas Ciudadanas | Ciudadano / Gestor | Iniciativas ciudadanas con votación y escalamiento a convocatorias |
| RF06 | Panel de Transparencia | Ciudadano / Gestor | Indicadores públicos de gestión cultural actualizados |
| RF07 | Valoración y Comentarios | Ciudadano / Gestor | Sistema de valoración con estrellas y comentarios moderados sobre fichas y eventos |

## Requerimientos No Funcionales
| ID | Tipo | Criterio Clave |
|----|------|----------------|
| RNF01 | Rendimiento | Carga ≤3s en 4G, soporte 100 usuarios simultáneos |
| RNF02 | Seguridad | HTTPS, Clave Única OAuth, rate limiting |
| RNF03 | Usabilidad | Accesibilidad universal, lenguaje simple, feedback ≤1s |

Para ver una descripción más detallada y completa de los requerimientos funcionales y no-funcionales, consulte el documento [requerimientos.md](requerimientos.md).

# Arquitectura de Navegación y UX

## Rutas Principales y Secundarias y Relaciones Jerárquicas

**Módulo Autenticación**
```
/
└── /auth                       
    ├── /auth/login         # Vista de inicio de sesión
    └── /auth/registro      # Vista de creación de cuenta ciudadana
```

**Módulo Público / Ciudadano**
```
/
└── /ciudadano
    ├── /ciudadano/inicio                           # Dashboard público
    ├── /ciudadano/catalogo                         # Catálogo patrimonial
    │   └── /ciudadano/catalogo/:id                 # Detalle de una ficha
    ├── /ciudadano/mapa                             # Mapa interactivo
    ├── /ciudadano/agenda                           # Calendario de eventos
    │   └── /ciudadano/agenda/:id                   # Detalle de un evento 
    └── /ciudadano/comunidad                        # Hub de participación 
        ├── /ciudadano/comunidad/propuestas         # Listado y votación de propuestas 
        └── /ciudadano/comunidad/transparencia      # Información de fondos y postulaciones culturales
```

**Módulo Gestor Municipal**
```
/
└── /gestor
    ├── /gestor/dashboard        # Panel inicial con métricas
    ├── /gestor/contenido        # Administración de fichas y agenda
    └── /gestor/postulaciones    # Revisión de fondos de ciudadanos
```

## Flujo de Navegación entre Funcionalidades

El flujo principal se basa en dos patrones según el rol del usuario:

- **Navegación Horizontal (Ciudadano):** Utiliza un Tab Bar superior estático para cambiar rápidamente entre los cinco dominios principales (Inicio, Catálogo, Mapa, Agenda, Comunidad). La navegación hacia vistas secundarias (ejemplo: ver el detalle de un artesano) utiliza Stack Navigation (empuja una nueva vista sobre la actual con un botón nativo de "Atrás" en la cabecera).
- **Navegación Vertical (Gestor):** Emplea un Sidebar simple (menú lateral) fijo a la izquierda. Al seleccionar un ítem, el área principal de contenido a la derecha se actualiza, facilitando la gestión de datos pesados sin perder el contexto del menú general.

## Diferenciación de Acceso según Roles 

El control de acceso se maneja mediante rutas protegidas (Protected Routes) en el router de React, evaluando el token de sesión y los permisos del usuario:
- **Acceso público (Sin autenticar):** Puede navegar libremente por `/ciudadano/inicio`, `/catalogo`, `/mapa` y `/agenda`. Si intenta interactuar (votar, postular), el flujo lo redirige automáticamente a `/auth/login`.
- **Usuario Ciudadano (Autenticado):** Mantiene el acceso público y desbloquea permisos de escritura para crear propuestas, votar y comentar fichas dentro de la jerarquía `/ciudadano/comunidad/`.
- **Gestor (Autenticado con credenciales municipales):** Es el único rol autorizado para renderizar la jerarquía `/gestor/`. Tiene permisos completos de CRUD (Crear, Leer, Actualizar, Borrar) sobre el catálogo, el mapa y la agenda, además de capacidad de moderación.

## Task Flow

Algunos flujos de tareas principales son:
**1. Primer uso — ciudadano nuevo**
```
[Abre la app]
      │
      ▼
  /login → tab "Registrarse"
      │
      ├── Ingresa nombre de usuario → validación disponibilidad
      ├── Ingresa RUT → formato automático XX.XXX.XXX-X
      ├── Ingresa correo → validación 
      ├── Selecciona región → carga comunas dependientes
      ├── Selecciona comuna
      ├── Ingresa contraseña → indicador fortaleza  → validación coincidencia
      └── Acepta términos → habilita botón "Crear cuenta"
            │
            ▼
      Notificación de éxito
            │
            ▼
      Ir a iniciar sesión → /login tab "Iniciar sesión"
            │
            ▼
      Ingresa correo + contraseña → /inicio
```

**2. Ciudadano busca y valora una ficha**
```
/inicio
    │
    ▼
Toca ficha destacada → /catalogo/:id
    │
    ├── Lee descripción didáctica
    ├── Navega galería de imágenes
    ├── Toca "Ver en mapa" → /mapa (marcador activo)
    └── Toca "Valorar"
          │
          ▼ 
      Modal de valoración
          ├── Selecciona 1-5 estrellas
          ├── Escribe comentario
          └── Envía → confirmación visual → /catalogo/:id actualizado
```

**3. Ciudadano envía nueva propuesta desde inicio**
```
/inicio → sección "Propuestas más votadas"
    │
    ▼
Toca acceso rápido → /comunidad/propuestas
    │
    ├── Revisa propuestas activas
    ├── Puede buscar, filtrar o ver detalles de propuestas activas
    └── Toca "Nueva Propuesta"
          │
          ▼
      /comunidad/propuestas/postular
          │
          ├── [Paso 1] Datos personales
          │     ├── Nombre representante
          │     ├── RUT representante
          │     └── Nombre organización
          │
          ├── [Paso 2] Descripción iniciativa
          │     ├── Nombre del proyecto
          │     ├── Categoría cultural
          │     └── Descripción del proyecto
          │
          ├── [Paso 3] Presupuesto y documentos
          │     ├── Monto solicitado (validado contra máximo)
          │     ├── Desglose de gastos
          │     └── Adjuntar PDF (acta, estatutos)
          │
          └── [Paso 4] Confirmar
                ├── Resumen de todos los datos
                └── Enviar 
```

## Puntos Críticos de Interacción

- **Formularios de ingreso de datos:** Pantallas como el registro o las postulaciones requieren retroalimentación visual inmediata (validación en tiempo real de RUT o correo) para evitar frustración antes del envío al servidor.
- **Mapa Interactivo:** Requiere manejo eficiente de gestos táctiles (zoom, arrastre) y renderizado optimizado de marcadores (ferias, cultores) para no degradar el rendimiento del navegador o dispositivo móvil.
- **Navegación con estado preservado:** Si el usuario aplica filtros y navega a otro tab, se deben preservar los filtros para evitar que el usuario repita el proceso de filtrado.

## Coherencia de Experiencia entre Dispositivos

La arquitectura de navegación debe implementar un diseño Mobile-First para el entorno ciudadano y Desktop-First para el entorno administrativo, utilizando un sistema de grillas (Grid) adaptable. Lo anterior responde bajo el supuesto de que la mayoría de los usuarios promedio utilizarán dispositivo móviles para acceder a la aplicación, mientras que administradores y gestores usarán escritorios o notebooks. 

En móvil, el ciudadano interactúa en la aplicación con pestañas táctiles grandes y vistas en pila; mientras que en escritorio, el panel del gestor está optimizado para resoluciones mayores, utilizando componentes de panel dividido para aprovechar el espacio ancho y con el uso de una cabecera superior fija.

Esta arquitectura de navegación maximiza la usabilidad al usar patrones nativos esperados por el usuario (Tabs en móvil, Sidebar en PC). La eficiencia de interacción se logra mediante la carga diferida de los tres grandes módulos; un ciudadano que solo revisa la agenda no descargará el código Javascript del panel administrativo. La claridad estructural se mantiene separando estrictamente los componentes visuales de la lógica de enrutamiento y roles. Finalmente, la escalabilidad está asegurada: agregar una nueva funcionalidad (por ejemplo, un módulo de turismo) solo requiere crear una nueva rama en el árbol de rutas sin afectar el código de los módulos existentes.

# Instrucciones de Ejecución

Este proyecto ha sido desarrollado utilizando **Ionic Framework** con **React** y empaquetado con **Vite**. Para correr el proyecto en tu entorno local, sigue estos pasos:

## Pre-requisitos

Asegúrate de tener instalados los siguientes entornos en tu máquina:
* [Node.js](https://nodejs.org/) (Versión 18.x o superior recomendada)
* Git

## Instalación y Despliegue Local

1. **Clonar el repositorio**

Abre tu terminal y ejecuta el siguiente comando para descargar el código fuente:
```
git clone https://github.com/nachit0xd/Proyecto-de-Ingenieria-Web-y-Movil_ICI4247_Grupo19.git
```
2. **Navegar al directorio del proyecto**

```
cd Proyecto-de-Ingenieria-Web-y-Movil_ICI4247_Grupo19
```
3. **Instalar las dependencias**

Instala todos los paquetes necesarios de npm en el bash para que Ionic y React funcionen correctamente:
```
npm install
```
4. **Ejecutar el servidor de desarrollo**

Levanta el entorno local utilizando Vite:
```
npm run dev
```
5. **Visualizar la app**

Una vez que el servidor esté corriendo, abre tu navegador web y pega el enlace de localhost que entrega Vite, debería verse así:
```
http://localhost:5173
```

## Prototipo de Diseño en Figma

Antes de la codificación de este proyecto, la arquitectura de la información, la interfaz de usuario (UI) y la experiencia de usuario (UX) fueron prototipados en Figma. El diseño contempla la separación de roles, flujos de tareas (como la creación de propuestas) y la coherencia visual entre dispositivos.

Puedes interactuar con el prototipo navegable aquí:
[Enlace a Figma](https://www.figma.com/design/FVP8YNPAUVWo16vc55pIOn/Proyecto-ING-Web-y-M%C3%B3vil?node-id=83-430&t=O1oTsBeLjHlMRdXI-1)
