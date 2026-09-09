# Usar exactamente la misma versión de Node que tienes localmente
FROM node:20.20.2-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias dentro del contenedor
RUN npm install

# Copiar el resto del código del proyecto
COPY . .

# Exponer el puerto en el que corre React (CoreUI usa el 3000 por defecto)
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo y Vite expuesta al exterior
CMD ["npm", "start", "--", "--host"]