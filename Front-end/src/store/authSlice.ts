import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { http } from "../lib/http"

type AuthState = {
  access?: string | null
  refresh?: string | null
  user?: { username: string; email?: string } | null
  status: "idle" | "loading" | "error",
  error?: string | null    // ✅ added

}

const initialState: AuthState = {
  status: "idle",
  access: null,
  refresh: null,
  user: null,
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }) => {
    const { data } = await http.post("/api/auth/login/", { username, password })
    return { access: data.access, refresh: data.refresh, user: { username } }
  }
)

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }: { username: string; email: string; password: string }) => {
    await http.post("/api/auth/register/", { username, email, password })
    return true
  }
)

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.access = null
      state.refresh = null
      state.user = null
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      localStorage.removeItem("username")
    },
    loadFromStorage(state) {
      state.access = localStorage.getItem("access")
      state.refresh = localStorage.getItem("refresh")
      const username = localStorage.getItem("username")
      state.user = username ? { username } : null
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (s) => { s.status = "loading" })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "idle"
        s.access = a.payload.access
        s.refresh = a.payload.refresh
        s.user = a.payload.user
        localStorage.setItem("access", s.access || "")
        localStorage.setItem("refresh", s.refresh || "")
        localStorage.setItem("username", s.user?.username || "")
      })
      .addCase(login.rejected, (s) => { s.status = "error" })
      .addCase(register.pending, (s) => { s.status = "loading" })
      .addCase(register.fulfilled, (s) => { s.status = "idle" })
      .addCase(register.rejected, (s) => { s.status = "error" })
  },
})

export const { logout, loadFromStorage } = slice.actions
export default slice.reducer
