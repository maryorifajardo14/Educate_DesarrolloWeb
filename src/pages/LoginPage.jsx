import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validarLogin } from '../utils/validators'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [form, setForm] = useState({ usuario: '', password: '' })
  const [errores, setErrores] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    setErrores((er) => ({ ...er, [name]: undefined }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const val = validarLogin(form)
    setErrores(val)
    if (Object.keys(val).length) return

    setLoading(true)
    setApiError('')
    try {
      await login(form.usuario.trim(), form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Bienvenido de vuelta</h2>
        <p className="subtitle">Inicia sesión para dar like y comentar en los videos.</p>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="usuario">Carné o correo electrónico</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="1890-20-11489 o correo@dominio.com"
              value={form.usuario}
              onChange={handleChange}
              className={errores.usuario ? 'invalid' : ''}
            />
            {errores.usuario && <p className="error-text">{errores.usuario}</p>}
          </div>

          <div className="field">
            <label htmlFor="password">PIN</label>
            <input
              id="password"
              name="password"
              type="password"
              inputMode="numeric"
              placeholder="Solo números"
              value={form.password}
              onChange={handleChange}
              className={errores.password ? 'invalid' : ''}
            />
            {errores.password && <p className="error-text">{errores.password}</p>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-footer-text">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
