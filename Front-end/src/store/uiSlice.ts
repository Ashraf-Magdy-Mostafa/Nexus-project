
import { createSlice } from '@reduxjs/toolkit'

type UIState = {
  cartOpen: boolean
}

const initialState: UIState = { cartOpen: false }

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart(s){ s.cartOpen = true },
    closeCart(s){ s.cartOpen = false },
    toggleCart(s){ s.cartOpen = !s.cartOpen }
  }
})

export const { openCart, closeCart, toggleCart } = slice.actions
export default slice.reducer
