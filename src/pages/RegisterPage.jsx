import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validarRegistro, formatearCarneInput } from '../utils/validators'

const initialForm = { carne: '', estudiante: '', correo: '', password: '', confirmarPassword: '' }

export default function RegisterPage() {
  const { registrar } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
  const [errores, setErrores] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    const finalValue = name === 'carne' ? formatearCarneInput(value) : value
    setForm((f) => ({ ...f, [name]: finalValue }))
    setErrores((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const val = validarRegistro(form)
    setErrores(val)
    if (Object.keys(val).length) return

    setLoading(true)
    setApiError('')
    try {
      await registrar({
        carne: form.carne,
        estudiante: form.estudiante.trim().toUpperCase(),
        correo: form.correo.trim().toLowerCase(),
        password: form.password,
      })
      navigate('/', { replace: true })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Crea tu cuenta</h2>
        <p className="subtitle">Regístrate para dar like y comentar en el catálogo educativo.</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="estudiante">Nombre completo</label>
            <input
              id="estudiante"
              name="estudiante"
              type="text"
              placeholder="JUAN PEREZ"
              value={form.estudiante}
              onChange={handleChange}
              className={errores.estudiante ? 'invalid' : ''}
            />
            {errores.estudiante && <p className="error-text">{errores.estudiante}</p>}
          </div>

          <div className="field">
            <label htmlFor="carne">Carné</label>
            <input
              id="carne"
              name="carne"
              type="text"
              placeholder="0000-00-00000"
              value={form.carne}
              onChange={handleChange}
              maxLength={13}
              className={errores.carne ? 'invalid' : ''}
            />
            {errores.carne ? (
              <p className="error-text">{errores.carne}</p>
            ) : (
              <p className="hint">Formato: 0000-00-00000</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              placeholder="usuario@dominio.com"
              value={form.correo}
              onChange={handleChange}
              className={errores.correo ? 'invalid' : ''}
            />
            {errores.correo && <p className="error-text">{errores.correo}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">PIN (solo números)</label>
            <input
              id="password"
              name="password"
              type="password"
              inputMode="numeric"
              placeholder="Mínimo 4 dígitos"
              value={form.password}
              onChange={handleChange}
              className={errores.password ? 'invalid' : ''}
            />
            {errores.password && <p className="error-text">{errores.password}</p>}
          </div>

          <div className="field">
            <label htmlFor="confirmarPassword">Confirmar PIN</label>
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              inputMode="numeric"
              placeholder="Repite tu PIN"
              value={form.confirmarPassword}
              onChange={handleChange}
              className={errores.confirmarPassword ? 'invalid' : ''}
            />
            {errores.confirmarPassword && <p className="error-text">{errores.confirmarPassword}</p>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
