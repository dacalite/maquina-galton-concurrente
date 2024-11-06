# 📊 Galton Board - Simulación Interactiva de Producción en Paralelo (Actualizado con RabbitMQ)

Bienvenido a la documentación del proyecto **Galton Board**, una simulación que combina la física de un **Tablero de Galton** con un enfoque de **producción paralela y distribuida**. El proyecto visualiza el proceso de producción de los componentes del tablero, como **clavos, contenedores y bolas**, a través de animaciones y simula su comportamiento físico en el tablero.


## 🎥 Demo del Proyecto

¡Mira una breve demo del proyecto en acción!



https://github.com/user-attachments/assets/4c7adf79-89eb-4830-bcd6-df8b6f9ed889




## 🚀 Tecnologías Utilizadas

### 🌐 **Frontend**:
- **React**: Framework para la creación de interfaces interactivas.
- **Tailwind CSS**: Herramienta de estilos basada en utilidades para lograr un diseño limpio y moderno.
- **Lottie**: Para las animaciones de las fábricas y los flujos de producción, dando vida a las estaciones de trabajo.
- **Matter.js**: Biblioteca de físicas utilizada para la simulación realista de las bolas que caen en el tablero de Galton.

### 🔧 **Backend**:
- **Spring Boot**: Framework para el desarrollo de aplicaciones Java con soporte para la inyección de dependencias y una arquitectura orientada a microservicios.
- **Java Concurrent API**: Usada para implementar la ejecución paralela de las fábricas y la gestión de recursos compartidos.
- **ScheduledExecutorService**: Para el control eficiente del scheduling y ejecución de tareas en paralelo.
- **CountDownLatch** y **AtomicInteger**: Para la correcta sincronización entre hilos y la prevención de condiciones de carrera.
- **RabbitMQ**: Para la gestión de productores y consumidores así como la cola de producción y ensamblaje de manera más profesional.

### 🐳 **Docker**:
- **Docker**: Utilizado para contenerizar tanto el backend como el frontend, asegurando la portabilidad y consistencia en cualquier entorno.
- **Docker Compose**: Permite levantar tanto el frontend como el backend de manera sencilla y simultánea.


## 📁 Estructura del Proyecto

```bash
/galton-board
    ├── /frontend      # Código del frontend (React, Tailwind, Matter.js)
    │   ├── Dockerfile # Contenedor del frontend
    ├── /backend       # Código del backend (Spring Boot, Java)
    │   ├── Dockerfile # Contenedor del backend
    ├── docker-compose.yml # Configuración para levantar frontend y backend
```


## 🛠️ Modos de Ejecución

### 1. 🐳 **Ejecutar mediante Docker Hub**
La imagen preconstruida se encuentra en Docker Hub y puede descargarse fácilmente:

```bash
docker pull dacalite/aplicacion-galton:latest
docker run -p 8080:8080 -p 5173:5173 dacalite/aplicacion-galton:latest
```

La aplicación estará disponible en `http://localhost:5173`.

### 2. 🔧 **Ejecutar con Docker Compose**
Ejecuta el proyecto completo (frontend y backend) desde la raíz del proyecto:

```bash
docker-compose up
```

Esto levantará los servicios del frontend en el puerto 5173 y del backend en el puerto 8080.


## 📦 Repositorio en Docker Hub

Puedes descargar la imagen del proyecto desde Docker Hub:

[🔗 Enlace al repositorio de Docker Hub](https://hub.docker.com/repository/docker/dacalite/aplicacion-galton/general)

---

Este proyecto es una integración completa de **animaciones**, **simulación física** y **procesamiento en paralelo**, todo empaquetado en contenedores de Docker para facilitar su uso y despliegue. ¡Gracias por visitar el proyecto y espero que lo disfrutes! 😄
