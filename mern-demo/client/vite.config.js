import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: true,
    host: true,
    // Cấu hình Proxy chuyển tiếp ngầm các request /api sang Backend Render
    proxy: {
      '/api': {
        target: 'https://mern-backend-236725.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})