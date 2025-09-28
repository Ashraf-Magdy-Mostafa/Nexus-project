import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { register } from '../store/authSlice'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const status = useAppSelector(s => s.auth.status)
  const error = useAppSelector(s => s.auth.error)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(register({ username, email, password })).unwrap()
      navigate('/login')
    } catch (e) { }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-semibold">Register</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm">Username</label>
            <input
              className="w-full rounded border p-2"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              className="w-full rounded border p-2"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Password</label>
            <input
              className="w-full rounded border p-2"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {status === 'error' && (
            <p className="text-sm text-red-600">{String(error)}</p>
          )}
          <button
            disabled={status === 'loading'}
            className="w-full rounded bg-black px-4 py-2 text-white"
          >
            {status === 'loading' ? 'Creating...' : 'Create account'}
          </button>
          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
