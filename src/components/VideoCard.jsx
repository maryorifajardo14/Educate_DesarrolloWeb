import { useNavigate } from 'react-router-dom'

export default function VideoCard({ video }) {
  const navigate = useNavigate()
  const totalComentarios =
    (video.comentarios || []).reduce((acc, c) => acc + 1 + (c.respuestas?.length || 0), 0)

  return (
    <article className="video-card" onClick={() => navigate(`/videos/${video.id}`)}>
      <div className="video-card-poster">
        <img src={video.poster} alt={video.titulo} loading="lazy" />
        <div className="play-badge"><span>▶</span></div>
        {video.duracion && <span className="duration-badge">{video.duracion}</span>}
      </div>
      <div className="video-card-body">
        <span className="category-badge">{video.categoria}</span>
        <h3>{video.titulo}</h3>
        <p>{video.descripcion}</p>
        <div className="video-card-footer">
          <span className="stat">❤️ {video.likes ?? 0}</span>
          <span className="stat">💬 {totalComentarios}</span>
        </div>
      </div>
    </article>
  )
}
