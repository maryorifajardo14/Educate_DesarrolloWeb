export function formatFecha(fecha) {
  if (!fecha) return ''
  const date = new Date(fecha.replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return fecha
  return date.toLocaleString('es-GT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}
