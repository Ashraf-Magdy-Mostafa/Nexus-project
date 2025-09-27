import React from 'react'
import { logout } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectCount } from '../store/cartSlice'
import { toggleCart } from '../store/uiSlice'

export default function Header() {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector((s) => !!s.auth.access)
  const count = useAppSelector((s) => selectCount(s.cart))

  return (
    <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur shadow-sm transition">
      <div className="container flex items-center justify-between py-3">
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          ProDev<span className="text-blue-600">Catalog</span>
        </h1>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => dispatch(logout())}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 hover:bg-blue-50 hover:scale-105"
            >
              Login
            </a>
          )}
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:scale-105"
            aria-label="Open cart"
          >
            🛒 Cart
            {count > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white shadow animate-bounce">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
