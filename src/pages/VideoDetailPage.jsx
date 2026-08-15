import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getVideoPorId } from '../api/videos'
import { toggleLike } from '../api/interacciones'
import { useAuth } from '../context/AuthContext'
import LikeButton from '../components/LikeButton'
import CommentSection from '../components/CommentSection'

export default function VideoDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likeLoading, setLikeLoading] = useState(false)
  const [likeError, setLikeError] = useState('')

  const cargarVideo = useCallback(async () => {
    const data = await getVideoPorId(id)
    setVideo(data)
    return data
  }, [id])

  useEffect(() => {
    let cancelado = false
    setLoading(true)
    setError('')
    cargarVideo()
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })
    return () => {
      cancelado = true
    }
  }, [cargarVideo])

  async function handleToggleLike() {
    if (!isAuthenticated || likeLoading) return
    setLikeLoading(true)
    setLikeError('')
    try {
      await toggleLike(video.id, user.carne)
      await cargarVideo()
    } catch (err) {
      setLikeError(err.message)
    } finally {
      setLikeLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container state-box">
        <div className="spinner" />
        <p>Cargando video…</p>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container state-box">
        <div className="icon">⚠️</div>
        <h3>No se pudo cargar el video</h3>
        <p>{error || 'Video no encontrado.'}</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const liked = isAuthenticated && (video.usuariosLikes || []).includes(user.carne)

  return (
    <div className="container">
      <div className="detail-layout">
        <div>
          <div className="player-wrap">
            <video src={video.urlVideo} controls poster={video.poster} preload="metadata" />
          </div>

          <div className="detail-header">
            <span className="category-badge">{video.categoria}</span>
            <h1>{video.titulo}</h1>
            <div className="meta-row">
              <span>⏱ {video.duracion}</span>
            </div>
            <p className="description">{video.descripcion}</p>

            {likeError && <div className="alert alert-error" style={{ marginTop: 12 }}>{likeError}</div>}

            <LikeButton
              likes={video.likes ?? 0}
              liked={liked}
              loading={likeLoading}
              onToggle={handleToggleLike}
              redirectPath={`/videos/${video.id}`}
            />
          </div>
        </div>

        <CommentSection videoId={video.id} comentarios={video.comentarios} onChanged={cargarVideo} />
      </div>
    </div>
  )
}
