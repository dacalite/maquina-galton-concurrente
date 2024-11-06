# Usamos una imagen base de OpenJDK
FROM openjdk:17-jdk-slim AS base

# Instalar Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos necesarios para ejecutar el frontend
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copiamos el resto de los archivos del frontend
COPY frontend/ ./

# Copiamos el archivo JAR en el contenedor
WORKDIR /app/backend
COPY backend/target/maquinagalton-0.0.1-SNAPSHOT.jar ./

# Exponemos los puertos del backend, frontend y RabbitMQ
EXPOSE 8080
EXPOSE 5173
EXPOSE 5672
EXPOSE 15672

# Comando para ejecutar el backend y el frontend cuando el contenedor arranca
CMD ["sh", "-c", "java -Djava.security.egd=file:/dev/urandom -jar /app/backend/maquinagalton-0.0.1-SNAPSHOT.jar & npm run dev --prefix /app/frontend"]
