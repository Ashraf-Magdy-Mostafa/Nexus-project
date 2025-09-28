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
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await http.post("/api/auth/login/", { username, password })
      return { access: data.access, refresh: data.refresh, user: { username } }
    } catch (err: any) {
      let message = "Login failed. Please check your credentials."
      if (err.response?.data?.detail) {
        message = err.response.data.detail
      } else if (err.message) {
        message = err.message
      }
      return rejectWithValue(message)
    }
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
      .addCase(login.pending, (s) => {
        s.status = "loading"
        s.error = null
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = "idle"
        s.error = null
        s.access = a.payload.access
        s.refresh = a.payload.refresh
        s.user = a.payload.user
        localStorage.setItem("access", s.access || "")
        localStorage.setItem("refresh", s.refresh || "")
        localStorage.setItem("username", s.user?.username || "")
      })
      .addCase(login.rejected, (s, a) => {
        s.status = "error"
        s.error = (a.payload as string) || "Login failed"
      })
      .addCase(register.pending, (s) => {
        s.status = "loading"
        s.error = null
      })
      .addCase(register.fulfilled, (s) => {
        s.status = "idle"
        s.error = null
      })
      .addCase(register.rejected, (s, a) => {
        s.status = "error"
        s.error = (a.payload as string) || "Registration failed"
      })
  }
  ,
})

export const { logout, loadFromStorage } = slice.actions
export default slice.reducer
