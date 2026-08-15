import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LikeButton({ likes, liked, loading, onToggle, redirectPath }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  function handleClick() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: redirectPath } })
      return
    }
    onToggle()
  }

  return (
    <div className="like-row">
      <button
        className={`like-btn ${liked ? 'liked' : ''}`}
        onClick={handleClick}
        disabled={loading}
        title={isAuthenticated ? (liked ? 'Quitar me gusta' : 'Dar me gusta') : 'Inicia sesión para dar me gusta'}
      >
        <span className="heart">{liked ? '❤️' : '🤍'}</span>
        {likes}
      </button>
      {!isAuthenticated && (
        <span className="locked-hint">🔒 Inicia sesión para reaccionar</span>
      )}
    </div>
  )
}
