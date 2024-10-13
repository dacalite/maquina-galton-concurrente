# Usamos una imagen base de Node.js
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos necesarios para ejecutar el frontend
COPY package*.json ./
COPY . .

# Instalamos las dependencias de Node.js
RUN npm install

# Exponemos el puerto del frontend (el puerto de Vite)
EXPOSE 5173

# Comando para iniciar la aplicación frontend en modo desarrollo
ENTRYPOINT ["npm", "run", "dev"]
