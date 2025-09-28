import axios from "axios"

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem("auth.tokens")
  if (raw) {
    try {
      const { access } = JSON.parse(raw)
      if (access) config.headers.Authorization = `Bearer ${access}`
    } catch { }
  }
  return config
})
