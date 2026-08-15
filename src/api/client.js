// Cliente HTTP centralizado para consumir la API REST del backend.
// Base URL configurable vía variable de entorno (ver .env / .env.example).
export const API_URL = import.meta.env.VITE_API_URL || 'https://backvideo-hpevgdenh7hygvfm.canadacentral-01.azurewebsites.net'

/**
 * Extrae un mensaje de error legible del cuerpo de la respuesta,
 * sin importar qué nombre de campo use el backend (mensaje, message, error, title...).
 */
async function extractErrorMessage(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    try {
      body = await response.text()
    } catch {
      body = null
    }
  }

  if (body && typeof body === 'object') {
    const msg =
      body.mensaje || body.message || body.error || body.title || body.detail
    if (msg) return msg
    // Errores de validación estilo ASP.NET: { errors: { Campo: ["mensaje"] } }
    if (body.errors && typeof body.errors === 'object') {
      const first = Object.values(body.errors).flat()[0]
      if (first) return first
    }
  }
  if (typeof body === 'string' && body.trim()) return body

  switch (response.status) {
    case 400:
      return 'La solicitud contiene datos inválidos.'
    case 401:
      return 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
    case 403:
      return 'No tienes permiso para realizar esta acción.'
    case 404:
      return 'El recurso solicitado no existe.'
    case 409:
      return 'El registro ya existe (carné o correo duplicado).'
    default:
      return `Ocurrió un error inesperado (código ${response.status}).`
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Wrapper de fetch: arma la URL, serializa JSON, y normaliza errores.
 */
export async function apiFetch(path, { method = 'GET', body, params } = {}) {
  let url = `${API_URL}${path}`

  if (params && Object.keys(params).length) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null)
    ).toString()
    if (qs) url += `?${qs}`
  }

  let response
  try {
    response = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (networkError) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.',
      0
    )
  }

  if (!response.ok) {
    const message = await extractErrorMessage(response)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return null

  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
