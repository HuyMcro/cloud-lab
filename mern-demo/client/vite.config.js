import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Sửa dấu chấm . thành dấu xuyệt /

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: true,
    host: true
  }
})