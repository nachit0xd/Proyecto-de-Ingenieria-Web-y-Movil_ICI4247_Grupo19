FROM node:22-alpine

WORKDIR /app

# Instalar dependencias necesarias para Prisma en Alpine
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
