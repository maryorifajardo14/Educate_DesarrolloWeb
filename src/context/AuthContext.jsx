import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'

const STORAGE_KEY = 'educate_auth_user'
const AuthContext = createContext(null)

/**
 * Normaliza la respuesta del backend (login o registro) a una forma
 * estable { carne, estudiante, correo }, sin importar variaciones
 * menores en el nombre de las propiedades que devuelva la API.
 */
function normalizarEstudiante(data, fallback = {}) {
  if (!data || typeof data !== 'object') return null
  const source = data.estudiante && typeof data.estudiante === 'object' ? data.estudiante : data

  const carne = source.carne || source.Carne || fallback.carne
  const nombre =
    (typeof source.estudiante === 'string' ? source.estudiante : null) ||
    source.nombre ||
    source.Estudiante ||
    fallback.estudiante
  const correo = source.correo || source.Correo || source.email || fallback.correo

  if (!carne) return null
  return { carne, estudiante: nombre || carne, correo: correo || '' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  async function login(usuario, password) {
    const data = await authApi.login({ usuario, password })
    const estudiante = normalizarEstudiante(data, { carne: usuario })
    setUser(estudiante)
    return estudiante
  }

  async function registrar({ carne, estudiante, correo, password }) {
    const data = await authApi.registrarEstudiante({ carne, estudiante, correo, password })
    const normalizado = normalizarEstudiante(data, { carne, estudiante, correo })
    setUser(normalizado)
    return normalizado
  }

  function logout() {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, registrar, logout }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
