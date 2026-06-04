# Proyecto de Ingeniería Web y Móvil: "Fomento de la cultura y el patrimonio local"

**Integrantes:** Nicolas Soto, Agustin Tapia, Ignacio Carrillo, Julian Toro

**Curso:** ICI 4247-1

**Grupo:** 19

# Tabla de Contenidos

1. [Introducción al proyecto](#introducción-al-proyecto)
2. [Justificación del Problema](#justificación-del-problema)
3. [Análisis del Usuario Objetivo](#análisis-del-usuario-objetivo)
4. [Requerimientos del Sistema](#requerimientos-del-sistema)
5. [Arquitectura del Sistema](#arquitectura-del-sistema)
6. [Arquitectura de Navegación y UX](#arquitectura-de-navegación-y-ux)
7. [Instrucciones de Ejecución](#instrucciones-de-ejecución)


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

#### Necesidades Funcionales (Vinculadas al Backend)
- **Explorar catálogo de patrimonio y oficios:** Lectura dinámica de registros patrimoniales cargados de forma asíncrona desde la base de datos.
- **Consultar agenda de ferias y eventos:** Acceso a eventos filtrados activamente por mes y año en tiempo real desde el servidor.
- **Visualizar mapa cultural de la comuna:** Carga georreferenciada de marcadores de ferias y cultores recuperados dinámicamente desde el backend.
- **Proponer iniciativas culturales de forma sencilla:** Envío de propuestas ciudadanas con persistencia en la BD, asociadas estrictamente a un usuario autenticado.
- **Votar por propuestas de otros ciudadanos:** Interacción interactiva en tiempo real que previene votos duplicados y actualiza contadores en transacciones seguras de base de datos.
- **Postular a fondos culturales municipales:** Formulario de múltiples pasos que procesa y almacena datos de postulación, presupuestos y documentos adjuntos persistidos en la BD.
- **Calificar y comentar fichas patrimoniales:** Sistema de valoraciones (1-5 estrellas) y opiniones que recalculan de forma automatizada los promedios e indicadores en el backend.
- **Consultar indicadores de gestión cultural:** Acceso directo a KPIs y gráficos de gestión calculados en tiempo real a través del panel de transparencia.

---

### Rol 2: Gestor Municipal

#### Descripción General
El Gestor Municipal puede ser un funcionario de la Dirección de Cultura, Dirección de Desarrollo Comunitario (DIDECO) u oficina equivalente del municipio, responsable de administrar el contenido, gestionar fondos y monitorear la participación ciudadana. Accede a la plataforma con credenciales institucionales provistas por el municipio.

#### Características del Contexto
- Acceso principalmente desde un computador de escritorio o notebook.
- Conectividad estable.
- Nivel de alfabetización digital: media-alta.
- Tiene un tiempo disponible limitado debido a las múltiples responsabilidades de su cargo.

#### Necesidades Funcionales (Vinculadas al Backend)
- **Crear y editar fichas del catálogo patrimonial:** Operaciones CRUD completas y seguras (protegidas por token JWT de rol Gestor) sobre la tabla de Fichas.
- **Gestionar capas y marcadores del mapa:** Edición en caliente de descripciones y coordenadas que actualiza instantáneamente el visor georreferenciado.
- **Publicar y administrar eventos en la agenda:** Control total de creación y expiración de actividades culturales en el calendario general.
- **Crear convocatorias de fondos culturales:** Definición y apertura de convocatorias con presupuestos máximos, cupos y plazos administrados en el servidor.
- **Revisar y cambiar estado de postulaciones:** Modificación de estados en base de datos (aprobado/rechazado) para el seguimiento inmediato del ciudadano.
- **Moderar propuestas y comentarios ciudadanos:** Capacidad de supervisión y adición de comentarios formales de retroalimentación de gestión a las propuestas de la comunidad.
- **Configurar y actualizar indicadores de transparencia:** Panel para la bitácora pública de transparencia (anuncios) y control de visibilidad de las actualizaciones.
- **Obtener datos sobre participación e impacto cultural:** Acceso a APIs analíticas de KPI y de distribución para alimentar gráficos interactivos (Recharts) que asisten en la toma de decisiones.

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

---

# Arquitectura del Sistema

El proyecto está diseñado bajo una arquitectura de **Monorepo Dividido (Split Monorepo)**, es decir, un único repositorio central que desacopla la aplicación cliente del servidor de base de datos. Esta estrategia de estructuración facilita el mantenimiento, las pruebas independientes y la escalabilidad de cada capa de la aplicación, ya que es consistente, ordenado y permite una gestión simplificada de dependencias.

```mermaid
graph TD
    subgraph Cliente [Cliente: Híbrido Web/Móvil]
        App[Vite + React 19]
        Ionic[Ionic React UI Componentes]
        RQ[TanStack React Query]
        Ax[Axios HTTP Client]
    end

    subgraph Servidor [Servidor: API RESTful]
        Express[Node.js + Express Server]
        Auth[JWT Middleware verifyToken]
        Prisma[Prisma Client ORM]
    end

    subgraph Datos [Persistencia]
        DB[(Base de Datos SQL)]
    end

    App --> Ionic
    App --> RQ
    RQ --> Ax
    Ax -->|Peticiones HTTP + JWT Bearer Token| Express
    Express --> Auth
    Express --> Prisma
    Prisma --> DB
```

### 1. Cliente (Frontend)
El frontend se encuentra en la raíz del proyecto y consiste en una aplicación de página única (**SPA**) híbrida y responsiva orientada tanto a dispositivos móviles como a ordenadores de escritorio.
* **Vite + React 19:** Entorno de compilación ultrarrápido y biblioteca de UI declarativa basada en componentes funcionales.
* **Ionic Framework (React):** Provee componentes de interfaz nativos y adaptativos optimizados tanto para la web móvil como para aplicaciones nativas mediante Capacitor.
* **TanStack React Query:** Gestiona la sincronización, almacenamiento en caché (*caching*), expiración y mutación del estado remoto sin necesidad de redundancia de llamadas HTTP.
* **Axios:** Cliente HTTP para la comunicación con el servidor, configurado para adjuntar de manera automática el token JWT desde `localStorage` en cada cabecera.
* **Recharts:** Biblioteca de gráficos modular y responsiva para mostrar datos interactivos de transparencia y de la comunidad.

### 2. Servidor (Backend)
El backend se encuentra encapsulado en el directorio `/backend` del proyecto y provee una API REST que centraliza la lógica de negocio y seguridad.
* **Node.js + Express:** Servidor web ligero, rápido e implementado en TypeScript para garantizar consistencia de tipos estáticos en todo el flujo de trabajo.
* **JWT Authentication Middleware (`verifyToken`):** Intercepta las solicitudes protegidas y valida los tokens web de JSON firmados, otorgando accesos basados en el rol del usuario (`ciudadano` o `gestor`).
* **Prisma ORM:** Motor de mapeo objeto-relacional para interactuar con la base de datos de manera tipada y segura, facilitando las consultas de agregación y el manejo de relaciones entre tablas.

### 3. Persistencia (Base de Datos)
La persistencia de datos está estructurada de forma relacional en una base de datos SQL que cumple con los modelos definidos en `/backend/prisma/schema.prisma`.
* **Modelos Principales:**
  * **Autenticación y Perfil:** `Usuario` (RUT, Rol, Contraseña encriptada asíncronamente con `bcryptjs`).
  * **Participación Ciudadana:** `Propuesta` y `VotoPropuesta` con restricciones de integridad de clave compuesta única para prevenir votos duplicados.
  * **Patrimonio y Oficios:** `Ficha` (con ubicaciones y multimedia serializados en JSON) y `ValoracionFicha`.
  * **Agenda Comunal:** `Evento` que almacena geolocalizaciones y fechas de inicio/término.
  * **Administración y Transparencia:** `Fondo`, `Postulacion` y `PublicacionTransparencia`.

---

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
    ├── /ciudadano/fondos                           # Información de fondos y formulario de postulación 
    ├── /ciudadano/comunidad                       # Listado y votación de propuestas 
    └── /ciudadano/transparencia                    # Información de gastos y estadísticas municipales
```

**Módulo Gestor Municipal**
```
/
└── /gestor
    ├── /gestor/dashboard        # Panel inicial con métricas
    ├── /gestor/catálogo         # Administración del catálogo público
    ├── /gestor/agenda-y-mapa    # Administración de eventos 
    ├── /gestor/propuestas       # Gestión de propuestas 
    ├── /gestor/fondos           # Administración de fondos y convocatorias
    └── /gestor/transparencia    # Administración de transparencia y datos públicos
```

## Flujo de Navegación entre Funcionalidades

El flujo principal se basa en dos patrones según el rol del usuario:

- **Navegación Horizontal (Ciudadano):** Utiliza un Tab Bar superior estático para cambiar rápidamente entre los siete dominios principales (Inicio, Catálogo, Mapa, Agenda, Fondos, Comunidad, Transparencia). La navegación hacia vistas secundarias (ejemplo: ver el detalle de un artesano) utiliza Stack Navigation (empuja una nueva vista sobre la actual con un botón nativo de "Atrás" en la cabecera).
- **Navegación Vertical (Gestor):** Emplea un Sidebar simple (menú lateral) fijo a la izquierda. Al seleccionar un ítem, el área principal de contenido a la derecha se actualiza, facilitando la gestión de datos pesados sin perder el contexto del menú general.

## Diferenciación de Acceso según Roles 

El control de acceso se maneja mediante rutas protegidas (Protected Routes) en el router de React, evaluando el token de sesión y los permisos del usuario:
- **Acceso público (Sin autenticar):** Puede navegar libremente por `/ciudadano/inicio`, `/catalogo`, `/mapa` y `/agenda`. Si intenta interactuar (votar, postular), el flujo lo redirige automáticamente a `/auth/login` para iniciar sesión y acceder a estas funcionalidades.
- **Usuario Ciudadano (Autenticado):** Mantiene el acceso público y desbloquea permisos de escritura para crear propuestas, votar y comentar fichas dentro de la jerarquía de Fondos, Propuestas y Transparencia.
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
      /comunidad/nueva-propuesta
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
          └── [Paso 3] Confirmar
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

## Sistema de Soporte para Modo Oscuro y Adaptabilidad Visual

La aplicación incorpora una experiencia visual adaptativa completa diseñada para responder dinámicamente al contexto de uso del usuario:
* **Menú Desplegable Responsivo (Drawer):** En resoluciones móviles (< 992px), el menú superior colapsa en un botón de "hamburguesa". Al pulsarlo, emerge un panel lateral con desenfoque de fondo (*backdrop-filter: blur*), enfocando la interacción del usuario sin perder de vista la interfaz subyacente.
* **Propagación del Tema en CSS Variables:** La alternancia entre Modo Claro y Oscuro (`body.dark-theme`) se propaga instantáneamente por toda la aplicación a través de propiedades personalizadas de CSS (`variables.css`), controlando de forma uniforme colores de fondos, bordes, tipos de letra y campos de formularios de ambas capas (Ciudadano y Gestor).
* **Gráficos e Indicadores Reactivos:** El sistema emplea un MutationObserver en el componente de Transparencia para escuchar el cambio de clases del DOM e inyectar de manera reactiva colores de alto contraste a los elementos de Recharts (rejillas, Tooltips y etiquetas de ejes) en el Modo Oscuro.


# Instrucciones de Ejecución

Este proyecto ha sido desarrollado bajo un esquema full-stack (Frontend híbrido + Backend API) utilizando **Ionic Framework** con **React**, empaquetado con **Vite**, y un servidor **NodeJS + Express + Prisma ORM**.

## Pre-requisitos

Asegúrate de tener instalados los siguientes entornos en tu máquina:
* [Node.js](https://nodejs.org/) (Versión 18.x o superior recomendada)
* Git
* Un gestor de base de datos SQL compatible con Prisma (como PostgreSQL).

## Instalación y Configuración Inicial

1. **Clonar el repositorio**

```bash
git clone https://github.com/nachit0xd/Proyecto-de-Ingenieria-Web-y-Movil_ICI4247_Grupo19.git
cd Proyecto-de-Ingenieria-Web-y-Movil_ICI4247_Grupo19
```

2. **Instalar las dependencias**

Instala los paquetes en el cliente y en el servidor:
```bash
# Instalar dependencias del Frontend
npm install

# Instalar dependencias del Backend
cd backend
npm install
cd ..
```

3. **Configuración de Variables de Entorno (Backend)**

Navega a la carpeta `/backend` y crea tu archivo de configuración `.env` tomando como referencia el ejemplo provisto:
```bash
cd backend
cp .env.example .env
```
Edita el archivo `.env` configurando tus credenciales de conexión para la base de datos (`DATABASE_URL`) y la firma de tokens de seguridad (`JWT_SECRET`).

4. **Sincronización de Base de Datos y Datos de Semilla (Seed)**

Genera la base de datos estructurada con el esquema relacional de Prisma y ejecuta los datos iniciales de prueba:
```bash
npx prisma db push
npm run seed
cd ..
```

## Ejecución del Entorno de Desarrollo

Para optimizar el flujo de desarrollo, el proyecto incluye un script de ejecución concurrente. Levanta el servidor Express y el servidor de desarrollo de Vite de forma simultánea con un solo comando desde el directorio raíz:

```bash
npm run dev:all
```

Esto iniciará automáticamente:
* **Frontend (Vite):** Disponible en `http://localhost:5173`
* **Backend API (Express):** Disponible en `http://localhost:3000`

*(Nota: También se pueden ejecutar de forma independiente abriendo dos consolas distintas y corriendo `npm run dev` en el directorio raíz para el frontend, y `npm run dev` en la carpeta `/backend` para el servidor).*


## Prototipo de Diseño en Figma

Antes de la codificación de este proyecto, la arquitectura de la información, la interfaz de usuario (UI) y la experiencia de usuario (UX) fueron prototipados en Figma. El diseño contempla la separación de roles, flujos de tareas (como la creación de propuestas) y la coherencia visual entre dispositivos.

A partir de la entrega parcial 1, se han añadido nuevos prototipos de pantallas, como la pantalla de Fondos del Ciudadano y las pantallas del Gestor Municipal, con cambios que mejoran (respecto a la entrega pasada) la navegación entre pantallas del Ciudadano.

Se puede interactuar con el prototipo navegable aquí (nuevo link, prototipo actualizado):
[Enlace a Figma](https://www.figma.com/design/zbS9fxfxutZEDHJ8CJblVV/Proyecto-ING-Web-y-M%C3%B3vil-Entrega-Parcial-2?node-id=0-1&t=KLkTDE9nLrQaHELZ-1)
