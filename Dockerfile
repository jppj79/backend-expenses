# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias para aprovechar el cache de capas
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto (genera la carpeta /dist)
RUN npm run build

# Eliminamos las dependencias de desarrollo y dejamos solo las de producción
RUN npm prune --production

# ETAPA 2: Ejecución (Runner)
FROM node:20-alpine AS runner

WORKDIR /app

# Definimos el entorno como producción
ENV NODE_ENV=production

# Copiamos solo lo esencial desde la etapa de builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponemos el puerto (usando la variable del .env por defecto)
EXPOSE 3000

# Comando para arrancar la aplicación
CMD ["node", "dist/main"]