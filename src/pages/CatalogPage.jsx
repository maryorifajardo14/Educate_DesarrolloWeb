import { useEffect, useMemo, useState } from 'react'
import { getVideos, getVideosPorCategoria, getCategorias } from '../api/videos'
import VideoCard from '../components/VideoCard'

export default function CatalogPage() {
  const [videos, setVideos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategorias().then(setCategorias).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelado = false
    setLoading(true)
    setError('')

    const request =
      categoriaActiva === 'Todas' ? getVideos() : getVideosPorCategoria(categoriaActiva)

    request
      .then((data) => {
        if (!cancelado) setVideos(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
      .finally(() => {
        if (!cancelado) setLoading(false)
      })

    return () => {
      cancelado = true
    }
  }, [categoriaActiva])

  const videosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return videos
    return videos.filter((v) => v.titulo?.toLowerCase().includes(q))
  }, [videos, busqueda])

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Aprende a tu ritmo con nuestro catálogo educativo</h1>
          <p>Explora clases en video de Desarrollo Web, Bases de Datos, Seguridad y más. Da like y comenta cuando inicies sesión.</p>

          <div className="search-bar">
            <span className="search-icon">🔎</span>
            <input
              type="text"
              placeholder="Buscar por título…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="filters-row">
          <button
            className={`chip ${categoriaActiva === 'Todas' ? 'active' : ''}`}
            onClick={() => setCategoriaActiva('Todas')}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              className={`chip ${categoriaActiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="results-count">
            {videosFiltrados.length} {videosFiltrados.length === 1 ? 'video encontrado' : 'videos encontrados'}
          </p>
        )}

        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>Cargando catálogo…</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-box">
            <div className="icon">⚠️</div>
            <h3>No se pudo cargar el catálogo</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && videosFiltrados.length === 0 && (
          <div className="state-box">
            <div className="icon">🔍</div>
            <h3>Sin resultados</h3>
            <p>No encontramos videos que coincidan con tu búsqueda.</p>
          </div>
        )}

        {!loading && !error && videosFiltrados.length > 0 && (
          <div className="video-grid">
            {videosFiltrados.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
