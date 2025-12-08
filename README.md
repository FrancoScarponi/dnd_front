# DnDManager-frontend

## Descripción

Este proyecto constituye la aplicación **Frontend** de la WebApp "DnDManager", desarrollada con **React**, **Redux Toolkit** y **Firebase Authentication**.

La aplicación se conecta a la API backend correspondiente y permite a los usuarios:

- Autenticarse mediante Firebase (email/password y/o proveedores externos)
- Visualizar y gestionar sus campañas de DnD
- Crear y administrar personajes por campaña
- Consultar información proveniente de la API de “DnD5e” (Clases, Razas, Estadísticas, Traits, Habilidades, Items, etc.)
- Interactuar con el estado de cada personaje y sus actualizaciones por sesión

El frontend funciona como **SPA (Single Page Application)** y maneja el estado global mediante Redux Toolkit, además de proveer protección de rutas basada en la sesión activa del usuario.

---

## Tecnologías

- **React**
- **Redux Toolkit** (Slices)
- **Firebase Authentication**
- **React Router**
- **TypeScript** 
- **Vite** 
- **TailwindCSS**

