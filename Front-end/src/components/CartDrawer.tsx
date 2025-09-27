
import React from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectItemsArray, selectCount, selectSubtotal, inc, dec, removeItem, clear } from '../store/cartSlice'
import { closeCart } from '../store/uiSlice'
import { Link, useNavigate } from 'react-router-dom'

export default function CartDrawer(){
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const open = useAppSelector(s => s.ui.cartOpen)
  const items = useAppSelector(s => selectItemsArray(s.cart))
  const count = useAppSelector(s => selectCount(s.cart))
  const subtotal = useAppSelector(s => selectSubtotal(s.cart))

  function goCheckout(){
    dispatch(closeCart())
    navigate('/checkout')
  }

  return (
    <>
      <div
        className={
          'fixed inset-0 z-40 bg-black/30 transition-opacity ' +
          (open ? 'opacity-100 visible' : 'opacity-0 invisible')
        }
        onClick={()=>dispatch(closeCart())}
      />
      <aside
        className={
          'fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-xl transition-transform ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Your Cart ({count})</h2>
          <button onClick={()=>dispatch(closeCart())} className="rounded-lg border px-3 py-1 text-sm">Close</button>
        </div>
        <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto p-4">
          {items.length === 0 && <p className="text-sm text-gray-600">Your cart is empty.</p>}
          <ul className="space-y-3">
            {items.map(it => (
              <li key={it.id} className="flex gap-3 rounded-xl border p-3">
                <img src={it.thumbnail} alt={it.title} className="h-16 w-20 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-1 text-sm font-medium">{it.title}</h4>
                  <div className="text-sm text-gray-600">${it.price.toFixed(2)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={()=>dispatch(dec(it.id))} className="rounded border px-2">-</button>
                    <span className="w-6 text-center">{it.qty}</span>
                    <button onClick={()=>dispatch(inc(it.id))} className="rounded border px-2">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={()=>dispatch(removeItem(it.id))} className="text-sm text-red-600 hover:underline">Remove</button>
                  <div className="text-sm font-semibold">${(it.price*it.qty).toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>dispatch(clear())} className="w-1/3 rounded-xl border px-3 py-2 text-sm">Clear</button>
            <button onClick={goCheckout} className="w-2/3 rounded-xl bg-black px-3 py-2 text-sm text-white">Checkout</button>
          </div>
        </div>
      </aside>
    </>
  )
}
