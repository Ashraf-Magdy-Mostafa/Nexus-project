
import React, { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { selectItemsArray, selectSubtotal, clear } from '../store/cartSlice'
import Header from '../components/Header'
import { mockStripe } from '../payments/mockStripe'
import { mockPaypal } from '../payments/mockPaypal'
import type { PaymentMethod } from '../payments/types'

type Address = {
  fullName: string
  email: string
  phone: string
  line1: string
  city: string
  country: string
  zip: string
}

const loadAddress = (): Address => {
  try {
    const raw = localStorage.getItem('addr:v1')
    if (!raw) throw new Error('no addr')
    return JSON.parse(raw)
  } catch {
    return { fullName: '', email: '', phone: '', line1: '', city: '', country: 'Egypt', zip: '' }
  }
}

const saveAddress = (a: Address) => {
  try { localStorage.setItem('addr:v1', JSON.stringify(a)) } catch {}
}

export default function Checkout(){
  const items = useAppSelector(s => selectItemsArray(s.cart))
  const subtotal = useAppSelector(s => selectSubtotal(s.cart))
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const shipping = useMemo(()=> subtotal > 0 ? Math.max(0, 50 - Math.min(50, subtotal*0.02)) : 0, [subtotal])
  const total = subtotal + shipping

  const [addr, setAddr] = useState<Address>(loadAddress())
  const [pm, setPm] = useState<PaymentMethod>('stripe')
  const [status, setStatus] = useState<'idle'|'processing'|'error'>('idle')
  const [error, setError] = useState<string>('')

  const valid = addr.fullName && addr.email && addr.phone && addr.line1 && addr.city && addr.country && addr.zip

  async function handlePlaceOrder(){
    if (!valid || items.length === 0) return
    setStatus('processing'); setError('')

    // Save address
    saveAddress(addr)

    // Create payment intent with selected gateway (mock)
    try {
      const gateway = pm === 'stripe' ? mockStripe : mockPaypal
      const intent = await gateway.createPaymentIntent(Math.round(total*100), 'usd')
      const res = await gateway.confirmPayment(intent.id)
      if (res.status === 'succeeded') {
        dispatch(clear())
        navigate('/success?order=' + encodeURIComponent(intent.id))
      } else {
        setStatus('error')
        setError(res.error || 'Payment failed')
        return
      }
    } catch (e:any) {
      setStatus('error')
      setError(e?.message || 'Unexpected error')
      return
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-6">
        <nav className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:underline">Home</Link> <span>/</span> <span>Checkout</span>
        </nav>
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold">Shipping Details</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <input className="rounded-xl border px-3 py-2" placeholder="Full name" value={addr.fullName} onChange={e=>setAddr({...addr, fullName: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2" placeholder="Email" value={addr.email} onChange={e=>setAddr({...addr, email: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2" placeholder="Phone" value={addr.phone} onChange={e=>setAddr({...addr, phone: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2" placeholder="Address line" value={addr.line1} onChange={e=>setAddr({...addr, line1: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2" placeholder="City" value={addr.city} onChange={e=>setAddr({...addr, city: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2" placeholder="Country" value={addr.country} onChange={e=>setAddr({...addr, country: e.target.value})}/>
                <input className="rounded-xl border px-3 py-2 md:col-span-2" placeholder="ZIP / Postal code" value={addr.zip} onChange={e=>setAddr({...addr, zip: e.target.value})}/>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <h2 className="mb-4 text-lg font-semibold">Payment</h2>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <input type="radio" checked={pm==='stripe'} onChange={()=>setPm('stripe')} />
                  <span>Stripe (mock)</span>
                </label>
                <label className="flex items-center gap-2 rounded-xl border px-3 py-2">
                  <input type="radio" checked={pm==='paypal'} onChange={()=>setPm('paypal')} />
                  <span>PayPal (mock)</span>
                </label>
                <label className="flex items-center gap-2 rounded-xl border px-3 py-2 opacity-50 cursor-not-allowed" title="Coming soon">
                  <input type="radio" disabled />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                This is a demo. Replace the mock gateways in <code>src/payments/</code> with real SDKs/servers.
              </p>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
              <ul className="max-h-64 space-y-3 overflow-auto pr-1">
                {items.map(it => (
                  <li key={it.id} className="flex items-center gap-3">
                    <img src={it.thumbnail} className="h-12 w-16 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1 text-sm">{it.title}</p>
                      <p className="text-xs text-gray-600">Qty {it.qty}</p>
                    </div>
                    <div className="text-sm font-medium">${(it.price*it.qty).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-base"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button
                onClick={handlePlaceOrder}
                disabled={!valid || items.length===0 || status==='processing'}
                className="mt-4 w-full rounded-xl bg-black px-4 py-3 text-white disabled:opacity-50"
              >
                {status==='processing' ? 'Processing…' : 'Place Order'}
              </button>
              <Link to="/" className="mt-2 block text-center text-sm text-blue-600 hover:underline">Continue shopping</Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
