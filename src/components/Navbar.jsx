import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { initialsOf } from '../utils/format'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">▶</span>
          EducaTe
        </Link>

        <nav className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-chip" title={user.correo}>
                <span className="avatar">{initialsOf(user.estudiante)}</span>
                {user.estudiante}
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarme</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
