# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación (genera la carpeta /dist)
RUN npm run build

# ==========================================
# Etapa 2: Producción (Runner)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar archivos esenciales para producción
COPY package*.json ./

# Instalar únicamente dependencias de producción
RUN npm ci --only=production

# Copiar los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto en el que corre NestJS
EXPOSE 3013

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/main"]