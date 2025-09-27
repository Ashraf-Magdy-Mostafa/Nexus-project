
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../lib/api'

export type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  qty: number
}

type CartState = {
  items: Record<number, CartItem>
}

const load = (): CartState => {
  try {
    const raw = localStorage.getItem('cart:v1')
    if (!raw) return { items: {} }
    return JSON.parse(raw) as CartState
  } catch { return { items: {} } }
}

const save = (state: CartState) => {
  try { localStorage.setItem('cart:v1', JSON.stringify(state)) } catch {}
}

const initialState: CartState = load()

const slice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Product>) {
      const p = action.payload
      const ex = state.items[p.id]
      if (ex) ex.qty += 1
      else state.items[p.id] = { id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail, qty: 1 }
      save(state)
    },
    removeItem(state, action: PayloadAction<number>) {
      delete state.items[action.payload]
      save(state)
    },
    inc(state, action: PayloadAction<number>) {
      const it = state.items[action.payload]; if (it) it.qty += 1
      save(state)
    },
    dec(state, action: PayloadAction<number>) {
      const it = state.items[action.payload]; if (it) { it.qty = Math.max(1, it.qty - 1) }
      save(state)
    },
    clear(state) {
      state.items = {}
      save(state)
    }
  }
})

export const { addItem, removeItem, inc, dec, clear } = slice.actions
export default slice.reducer

// selectors
export const selectItemsArray = (s: CartState) => Object.values(s.items)
export const selectCount = (s: CartState) => Object.values(s.items).reduce((n, it) => n + it.qty, 0)
export const selectSubtotal = (s: CartState) => Object.values(s.items).reduce((sum, it) => sum + it.price * it.qty, 0)
