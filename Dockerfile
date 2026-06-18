# Etapa 1: Construcción (Build)
FROM node:22-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Inyectar URL de la API (por defecto apunta a localhost para despliegue local)
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Etapa 2: Servidor estático (Nginx)
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos generados por Vite a la carpeta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
