Tu Familia Organizada - Backend

Backend del proyecto "Tu Familia Organizada", una aplicación pensada para ayudar a las familias a gestionar las comunicaciones y tareas escolares de forma organizada, clara y accesible.

Descripción general del proyecto

Este backend permite:
- Registrar padres y asociarlos a una familia.
- Crear perfiles para padres e hijos.
- Crear, editar, eliminar y completar tareas escolares.
- Asignar tareas a uno o varios hijos, y a un padre responsable.
- Subir fotos de perfil.
- Ver las tareas en diferentes vistas: lista y calendario.
- Enviar resúmenes diarios y semanales por email, agrupando las tareas por hijo.

Estructura del proyecto
Backend (Node.js + Express)
│
├── Autenticación (JWT)
├── Familia y usuarios (Padres e Hijos)
├── Tareas (CRUD + filtros + completadas)
├── Vistas (Lista y Calendario)
├── Subida de imágenes (Multer)
├── Emails de notificación (diarios y semanales con Nodemailer)
└── Despliegue en Render + MongoDB Atlas

Tecnologías utilizadas
- Node.js
- Express
- MongoDB Atlas + Mongoose
- JWT (autenticación)
- Bcrypt.js (encriptación de contraseñas)
- Nodemailer (envío de correos)
- Multer (subida de imágenes)
- Render (despliegue en producción)
- Postman (testeo manual de endpoints)

Deploy en producción
URL del backend:
https://pbf-backend.onrender.com