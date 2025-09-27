import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    port: parseInt(process.env.PORT || "5173"),
    host: "0.0.0.0",
    allowedHosts: [
      "motivated-spirit-production-5e5e.up.railway.app"
    ]
  }
})
