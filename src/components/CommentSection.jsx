import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { publicarComentario } from '../api/interacciones'
import CommentItem from './CommentItem'

export default function CommentSection({ videoId, comentarios, onChanged }) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [texto, setTexto] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  function goToLogin() {
    navigate('/login', { state: { from: `/videos/${videoId}` } })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!texto.trim()) return
    setSending(true)
    setError('')
    try {
      await publicarComentario(videoId, user.carne, texto.trim())
      setTexto('')
      await onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const total = (comentarios || []).reduce((acc, c) => acc + 1 + (c.respuestas?.length || 0), 0)

  return (
    <section className="comments-panel">
      <h2>Comentarios ({total})</h2>

      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            placeholder="Comparte tu opinión sobre este video…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            maxLength={500}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? 'Enviando…' : 'Comentar'}
          </button>
        </form>
      ) : (
        <div className="locked-box">
          🔒 Debes{' '}
          <button className="link-btn" onClick={goToLogin}>iniciar sesión</button>{' '}
          para comentar en este video.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {!comentarios || comentarios.length === 0 ? (
        <p className="empty-comments">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
      ) : (
        <div className="comment-list">
          {comentarios.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              videoId={videoId}
              onChanged={onChanged}
              onRequireLogin={goToLogin}
            />
          ))}
        </div>
      )}
    </section>
  )
}
