import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Publicado como "project site" en GitHub Pages:
// https://<usuario>.github.io/Educate_DesarrolloWeb/
// Por eso el base debe coincidir con el nombre del repositorio.
export default defineConfig({
  plugins: [react()],
  base: '/Educate_DesarrolloWeb/',
})
