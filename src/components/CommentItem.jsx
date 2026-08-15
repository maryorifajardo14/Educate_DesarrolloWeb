import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { responderComentario, eliminarComentario } from '../api/interacciones'
import { formatFecha, initialsOf } from '../utils/format'
import ConfirmModal from './ConfirmModal'

export default function CommentItem({ comment, videoId, isReply, onChanged, onRequireLogin }) {
  const { user, isAuthenticated } = useAuth()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [error, setError] = useState('')

  const isOwner = isAuthenticated && user?.carne === comment.carne

  async function handleReply(e) {
    e.preventDefault()
    if (!replyText.trim()) return
    setSending(true)
    setError('')
    try {
      await responderComentario(comment.id, user.carne, replyText.trim())
      setReplyText('')
      setShowReplyForm(false)
      await onChanged()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      await eliminarComentario(comment.id, user.carne)
      setConfirmOpen(false)
      await onChanged()
    } catch (err) {
      setError(err.message)
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="comment-item">
      <div className="comment-avatar">{initialsOf(comment.estudiante)}</div>
      <div className="comment-body">
        <div className="comment-bubble">
          <div className="author-row">
            <span className="author">{comment.estudiante}</span>
            <span className="date">{formatFecha(comment.fecha)}</span>
          </div>
          <p className="text">{comment.texto}</p>
        </div>

        {error && <div className="alert alert-error" style={{ marginTop: 8 }}>{error}</div>}

        <div className="comment-actions">
          {!isReply && (
            <button
              onClick={() => {
                if (!isAuthenticated) return onRequireLogin()
                setShowReplyForm((v) => !v)
              }}
            >
              Responder
            </button>
          )}
          {isOwner && (
            <button className="delete" onClick={() => setConfirmOpen(true)}>
              Eliminar
            </button>
          )}
        </div>

        {showReplyForm && (
          <form className="reply-form" onSubmit={handleReply}>
            <textarea
              placeholder="Escribe tu respuesta…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              maxLength={500}
              required
            />
            <button className="btn btn-primary btn-sm" type="submit" disabled={sending}>
              {sending ? 'Enviando…' : 'Enviar'}
            </button>
          </form>
        )}

        {!isReply && comment.respuestas?.length > 0 && (
          <div className="replies">
            {comment.respuestas.map((r) => (
              <CommentItem
                key={r.id}
                comment={r}
                videoId={videoId}
                isReply
                onChanged={onChanged}
                onRequireLogin={onRequireLogin}
              />
            ))}
          </div>
        )}
      </div>

      {confirmOpen && (
        <ConfirmModal
          title="Eliminar comentario"
          message="Esta acción no se puede deshacer. ¿Deseas continuar?"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  )
}
