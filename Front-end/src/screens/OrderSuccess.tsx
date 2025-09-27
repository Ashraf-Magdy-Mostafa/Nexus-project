
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Header from '../components/Header'

function useQuery(){
  const { search } = useLocation()
  return Object.fromEntries(new URLSearchParams(search).entries())
}

export default function OrderSuccess(){
  const q = useQuery()
  const orderId = q.order || 'demo_' + Math.random().toString(36).slice(2)
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16 text-center">
        <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">✓</div>
          <h1 className="mb-2 text-2xl font-semibold">Order Confirmed</h1>
          <p className="text-gray-600">Thanks! Your payment was successful.</p>
          <p className="mt-2 text-sm text-gray-600">Order ID: <code>{orderId}</code></p>
          <Link to="/" className="mt-6 inline-block rounded-xl bg-black px-4 py-2 text-white">Back to Home</Link>
        </div>
      </main>
    </div>
  )
}
