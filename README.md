# EducaTe — Catálogo de Videos Educativos

Solución web para la gestión y visualización de un catálogo de videos educativos, construida en **React + Vite** y conectada a una API REST propia (Azure App Service). Los visitantes pueden navegar, filtrar, buscar y reproducir videos libremente; dar "Me gusta", comentar y responder está restringido a estudiantes registrados e identificados.

**Autora:** Maryori Rachael Fajardo Paredes — Carné 1890-23-18949 — mfajardop1@miumg.edu.gt

## Links de entrega

- 🔗 **Repositorio:** https://github.com/maryorifajardo14/Educate_DesarrolloWeb
- 🌐 **Sitio funcionando:** https://maryorifajardo14.github.io/Educate_DesarrolloWeb/

## Stack

- React 18 + Vite 5
- React Router (`HashRouter`, requerido por GitHub Pages)
- Fetch API (sin librerías externas de HTTP) contra el backend REST
- CSS propio (sin frameworks de UI)
- Despliegue automático con GitHub Actions → GitHub Pages en cada push a `main`

## Backend consumido

Base URL: `https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net`

| Serie | Endpoint | Uso en la app |
|---|---|---|
| I | `POST /api/estudiantes/registrar` | Registro de estudiantes |
| I | `POST /api/login` | Inicio de sesión (carné o correo) |
| II | `GET /api/videos` | Catálogo completo |
| II | `GET /api/videos/{id}` | Detalle / reproductor |
| II | `GET /api/videos/categorias` | Chips de filtro |
| II | `GET /api/videos/categoria/{nombre}` | Filtrado por categoría |
| III | `POST /api/interaccionvideo/{videoId}/like` | Toggle de "Me gusta" |
| III | `POST /api/interaccionvideo/{videoId}/comentario` | Comentario principal |
| III | `POST /api/interaccionvideo/comentario/{id}/responder` | Respuesta (1 nivel) |
| III | `DELETE /api/interaccionvideo/comentario/{id}?carne=` | Eliminar comentario propio |

## Estructura

```
src/
  api/            # capa de acceso a la API (client, auth, videos, interacciones)
  components/     # Navbar, VideoCard, LikeButton, CommentSection, CommentItem, ConfirmModal
  context/        # AuthContext (sesión persistida en localStorage)
  pages/          # CatalogPage, VideoDetailPage, LoginPage, RegisterPage
  utils/          # validators.js (reglas de negocio), format.js
```

## Reglas de negocio implementadas

- Carné con máscara `0000-00-00000` (validación + autoformateo mientras se escribe).
- Correo con formato estándar `usuario@dominio.com`.
- PIN estrictamente numérico.
- Login acepta carné **o** correo en el mismo campo.
- Like en modalidad toggle (dar / quitar).
- Comentarios con un único nivel de respuestas anidadas.
- Solo el autor de un comentario puede eliminarlo; el 403 del backend se muestra como mensaje de error.
- Botones de like/comentario bloqueados (con candado y redirección a `/login`) para visitantes no autenticados.

## Ejecutar en local

Requiere [Node.js](https://nodejs.org/) 18+.

```bash
npm install
npm run dev
```

La app corre en `http://localhost:5173`. La URL del backend se configura en `.env` (`VITE_API_URL`), ya apunta al backend en producción.

## Build de producción

```bash
npm run build
npm run preview
```

## Despliegue

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila y publica el sitio en GitHub Pages automáticamente en cada push a `main`. Requiere que, una sola vez, en **Settings → Pages** del repositorio, la fuente ("Build and deployment → Source") esté configurada como **GitHub Actions**.
