
import React from 'react'
import type { Product } from '../lib/api'
import { useAppDispatch } from '../hooks'
import { addItem } from '../store/cartSlice'

export default function ProductCard({ p }: { p: Product }) {
  const dispatch = useAppDispatch()
  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      <img src={p.thumbnail} alt={p.title} className="h-40 w-full object-cover" />
      <div className="space-y-1 p-3">
        <h3 className="line-clamp-1 font-medium">{p.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{p.category}</span>
          <span>⭐ {p.rating}</span>
        </div>
        <div className="pt-1 text-lg font-semibold">${p.price.toFixed(2)}</div>
        <button
          onClick={()=>dispatch(addItem(p))}
          className="mt-2 w-full rounded-xl border px-3 py-2 text-sm transition hover:bg-gray-50"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
