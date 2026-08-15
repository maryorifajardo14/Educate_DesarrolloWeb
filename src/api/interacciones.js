import { apiFetch } from './client'

// SERIE III — Likes, comentarios e hilos de respuesta

/**
 * Toggle de "Me gusta". Si el estudiante ya dio like, lo remueve.
 * POST /api/interaccionvideo/{videoId}/like
 * body: { carne }
 */
export function toggleLike(videoId, carne) {
  return apiFetch(`/api/interaccionvideo/${videoId}/like`, {
    method: 'POST',
    body: { carne },
  })
}

/**
 * Publica un comentario principal asociado al video.
 * POST /api/interaccionvideo/{videoId}/comentario
 * body: { carne, texto }
 */
export function publicarComentario(videoId, carne, texto) {
  return apiFetch(`/api/interaccionvideo/${videoId}/comentario`, {
    method: 'POST',
    body: { carne, texto },
  })
}

/**
 * Responde a un comentario existente (1 solo nivel de anidamiento).
 * POST /api/interaccionvideo/comentario/{comentarioId}/responder
 * body: { carne, texto }
 */
export function responderComentario(comentarioId, carne, texto) {
  return apiFetch(`/api/interaccionvideo/comentario/${comentarioId}/responder`, {
    method: 'POST',
    body: { carne, texto },
  })
}

/**
 * Elimina un comentario propio. El backend devuelve 403 si no es el autor.
 * DELETE /api/interaccionvideo/comentario/{comentarioId}?carne=...
 */
export function eliminarComentario(comentarioId, carne) {
  return apiFetch(`/api/interaccionvideo/comentario/${comentarioId}`, {
    method: 'DELETE',
    params: { carne },
  })
}
