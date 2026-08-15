import { apiFetch } from './client'

// SERIE I — Autenticación, Registro y Reglas de Validación

/**
 * Registra un nuevo estudiante.
 * POST /api/estudiantes/registrar
 * body: { carne, estudiante, correo, password }
 */
export function registrarEstudiante({ carne, estudiante, correo, password }) {
  return apiFetch('/api/estudiantes/registrar', {
    method: 'POST',
    body: { carne, estudiante, correo, password },
  })
}

/**
 * Inicia sesión. El campo "usuario" acepta carné o correo.
 * POST /api/login
 * body: { usuario, password }
 */
export function login({ usuario, password }) {
  return apiFetch('/api/login', {
    method: 'POST',
    body: { usuario, password },
  })
}
