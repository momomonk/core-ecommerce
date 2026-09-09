# ==========================================
# 1. Etapa de Construcción (Builder)
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para compilar TS)
RUN npm ci

# Copiar el código fuente completo
COPY . .

# Compilar la aplicación (genera la carpeta dist/)
RUN npm run build

# ==========================================
# 2. Etapa de Producción (Runner)
# ==========================================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar archivos esenciales para producción
COPY package*.json ./

# Instalar únicamente dependencias de producción para aligerar la imagen
RUN npm ci --only=production

# Copiar la compilación desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer el puerto (cambia el 3000 si tu auth-service usa otro puerto por defecto)
EXPOSE 3011

# Comando para ejecutar la aplicación compilada
CMD ["node", "dist/main"]