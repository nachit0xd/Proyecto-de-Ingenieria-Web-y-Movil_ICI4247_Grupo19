# Proyecto de Ingeniería Web y Móvil: "Fomento de la cultura y el patrimonio local"

**Integrantes:** Nicolas Soto, Agustin Tapia, Ignacio Carrillo, Julian Toro

**Curso:** ICI 4247-1

**Grupo:** 19

# Tabla de Contenidos

1. [Introducción al proyecto](#introducción-al-proyecto)
2. [Justificación del Problema](#justificación-del-problema)
3. [Análisis del Usuario Objetivo](#análisis-del-usuario-objetivo)
4. [Requerimientos del Sistema](#requerimientos-del-sistema)

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

## Requerimientos No Funcionales


