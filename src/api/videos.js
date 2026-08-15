import { apiFetch } from './client'

// SERIE II — Catálogo de videos

/** GET /api/videos — catálogo completo */
export function getVideos() {
  return apiFetch('/api/videos')
}

/** GET /api/videos/{id} — detalle de un video */
export function getVideoPorId(id) {
  return apiFetch(`/api/videos/${id}`)
}

/** GET /api/videos/categorias — listado de categorías disponibles */
export function getCategorias() {
  return apiFetch('/api/videos/categorias')
}

/** GET /api/videos/categoria/{nombreCategoria} — videos filtrados por categoría */
export function getVideosPorCategoria(nombreCategoria) {
  return apiFetch(`/api/videos/categoria/${encodeURIComponent(nombreCategoria)}`)
}
