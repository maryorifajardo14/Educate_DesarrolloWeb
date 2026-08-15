import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import CatalogPage from './pages/CatalogPage'
import VideoDetailPage from './pages/VideoDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/videos/:id" element={<VideoDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="*" element={<CatalogPage />} />
        </Routes>
      </main>
      <footer className="footer">
        EducaTe · Catálogo de Videos Educativos · Maryori Rachael Fajardo Paredes · 1890-23-18949
      </footer>
    </>
  )
}
