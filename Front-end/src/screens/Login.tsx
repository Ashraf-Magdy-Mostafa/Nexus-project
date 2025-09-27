
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { login } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(s => s.auth.status)
  const error = useAppSelector(s => s.auth.error)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ username, password })).unwrap()
      navigate('/')
    } catch (e) { }
  }

  return (
    <div className="container mx-auto max-w-md py-10">
      <h1 className="mb-6 text-2xl font-semibold">Login</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm">Username</label>
          <input className="w-full rounded border p-2" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input className="w-full rounded border p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {status === 'error' && <p className="text-sm text-red-600">{String(error)}</p>}
        <button disabled={status === 'loading'} className="rounded bg-black px-4 py-2 text-white">
          {status === 'loading' ? 'Signing in...' : 'Login'}
        </button>
        <p className="text-sm">No account? <Link to="/register" className="text-blue-600 underline">Register</Link></p>
      </form>
    </div>
  )
}
