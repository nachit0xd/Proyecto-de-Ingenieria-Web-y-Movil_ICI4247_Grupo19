# Documentación API REST - Cultura Municipal

Esta API proporciona todos los endpoints necesarios para gestionar la plataforma Cultura Municipal, incluyendo la autenticación segura mediante JWT y operaciones CRUD de las distintas entidades.

## URL Base
\`\`\`
http://localhost:3000/api
\`\`\`

---

## 1. Autenticación (\`/auth\`)

### 1.1 Registrar Usuario
- **Método**: \`POST\`
- **Endpoint**: \`/auth/register\`
- **Descripción**: Crea una nueva cuenta de usuario en la plataforma.
- **Body** (JSON):
  \`\`\`json
  {
    "nombre": "Juan Pérez",
    "email": "juan@correo.cl",
    "password": "mi_password_segura",
    "rol": "ciudadano"
  }
  \`\`\`
- **Respuestas**:
  - \`201 Created\`: Usuario registrado con éxito y devuelve el \`token\`.
  - \`400 Bad Request\`: El email ya está registrado.
  - \`500 Internal Server Error\`: Error de validación o servidor.

### 1.2 Iniciar Sesión
- **Método**: \`POST\`
- **Endpoint**: \`/auth/login\`
- **Descripción**: Valida las credenciales y genera un JWT.
- **Body** (JSON):
  \`\`\`json
  {
    "email": "juan@correo.cl",
    "password": "mi_password_segura"
  }
  \`\`\`
- **Respuestas**:
  - \`200 OK\`: Credenciales válidas. Retorna \`token\` JWT y datos del usuario.
  - \`401 Unauthorized\`: Contraseña incorrecta.
  - \`404 Not Found\`: Usuario no encontrado.

---

## 2. Comunidad (\`/comunidad\`)

### 2.1 Obtener Propuestas
- **Método**: \`GET\`
- **Endpoint**: \`/comunidad/propuestas\`
- **Descripción**: Obtiene la lista de propuestas ciudadanas registradas.
- **Cabeceras Requeridas**: Ninguna.
- **Respuestas**: \`200 OK\` (Lista JSON).

### 2.2 Votar por Propuesta
- **Método**: \`POST\`
- **Endpoint**: \`/comunidad/votar/:id\`
- **Descripción**: Añade un voto a una propuesta específica.
- **Cabeceras Requeridas**: \`Authorization: Bearer <token>\`
- **Respuestas**: \`200 OK\` (Propuesta actualizada), \`401 Unauthorized\` (Token inválido o faltante).

### 2.3 Actualizar Propuesta
- **Método**: \`PUT\`
- **Endpoint**: \`/comunidad/propuesta/:id\`
- **Descripción**: Actualiza el título, descripción o estado de una propuesta (Uso de Gestor).
- **Cabeceras Requeridas**: \`Authorization: Bearer <token>\`
- **Body** (JSON):
  \`\`\`json
  {
    "estado": "aprobado"
  }
  \`\`\`
- **Respuestas**: \`200 OK\` (Actualización exitosa).

### 2.4 Eliminar Propuesta
- **Método**: \`DELETE\`
- **Endpoint**: \`/comunidad/propuesta/:id\`
- **Descripción**: Elimina una propuesta del registro.
- **Cabeceras Requeridas**: \`Authorization: Bearer <token>\`
- **Respuestas**: 
  - \`200 OK\`: Propuesta eliminada.
  - \`404 Not Found\`: Propuesta no existe.

---

> **Nota de Seguridad**: Todas las rutas protegidas (aquellas que modifican datos o exigen interacción de usuario) validan el JWT utilizando el middleware `verifyToken`. Si se provee un token expirado, inválido o vacío, la API responderá con un error \`401 Unauthorized\`. Las contraseñas en base de datos están fuertemente protegidas mediante Hashes bcrypt.
