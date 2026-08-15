// Reglas de negocio de la SERIE I aplicadas en el cliente,
// como primera línea de defensa antes de golpear la API.

export const CARNE_REGEX = /^\d{4}-\d{2}-\d{5}$/
export const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PASSWORD_REGEX = /^\d+$/

export function isCarneValido(carne) {
  return CARNE_REGEX.test((carne || '').trim())
}

export function isCorreoValido(correo) {
  return CORREO_REGEX.test((correo || '').trim())
}

export function isPasswordValida(password) {
  return PASSWORD_REGEX.test(password || '')
}

/**
 * Autoformatea lo que el usuario escribe en el input de carné
 * hacia la máscara 0000-00-00000, permitiendo solo dígitos.
 */
export function formatearCarneInput(value) {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11)
  const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 11)]
  return parts.filter(Boolean).join('-')
}

export function validarRegistro({ carne, estudiante, correo, password, confirmarPassword }) {
  const errores = {}

  if (!estudiante || !estudiante.trim()) {
    errores.estudiante = 'El nombre completo es obligatorio.'
  }

  if (!isCarneValido(carne)) {
    errores.carne = 'El carné debe tener el formato 0000-00-00000.'
  }

  if (!isCorreoValido(correo)) {
    errores.correo = 'Ingresa un correo válido (usuario@dominio.com).'
  }

  if (!isPasswordValida(password)) {
    errores.password = 'El PIN debe ser estrictamente numérico (sin letras ni espacios).'
  } else if (password.length < 4) {
    errores.password = 'El PIN debe tener al menos 4 dígitos.'
  }

  if (confirmarPassword !== undefined && password !== confirmarPassword) {
    errores.confirmarPassword = 'Los PIN no coinciden.'
  }

  return errores
}

export function validarLogin({ usuario, password }) {
  const errores = {}
  if (!usuario || !usuario.trim()) {
    errores.usuario = 'Ingresa tu carné o correo electrónico.'
  }
  if (!password) {
    errores.password = 'Ingresa tu PIN.'
  } else if (!isPasswordValida(password)) {
    errores.password = 'El PIN debe ser estrictamente numérico.'
  }
  return errores
}
