import axios from "axios"

export const http = axios.create({
  baseURL: "http://localhost:8000",
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
