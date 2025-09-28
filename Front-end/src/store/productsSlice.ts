
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { fetchProducts, type Product, type Query } from '../lib/api'

export type ViewMode = 'pagination' | 'infinite'

export interface ProductsState {
  items: Product[]
  total: number
  page: number
  limit: number
  status: 'idle' | 'loading' | 'failed'
  error?: string
  category: string
  sortBy?: 'price' | 'rating'
  sortDir?: 'asc' | 'desc'
  search: string
  view: ViewMode
  hasMore: boolean
}

const initialState: ProductsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  status: 'idle',
  category: 'All',
  search: '',
  view: 'pagination',
  hasMore: true
}

export const loadProducts = createAsyncThunk(
  'products/load',
  async (_: void, { getState }) => {
    const s = (getState() as RootState).products
    const q: Query = {
      page: s.page,
      limit: s.limit,
      category: s.category,
      search: s.search,
      sortBy: s.sortBy,
      sortDir: s.sortDir
    }
    const res = await fetchProducts(q)
    return res
  }
)

export const loadMore = createAsyncThunk(
  'products/loadMore',
  async (_: void, { getState }) => {
    const s = (getState() as RootState).products
    const q: Query = {
      page: s.page + 1,
      limit: s.limit,
      category: s.category,
      search: s.search,
      sortBy: s.sortBy,
      sortDir: s.sortDir
    }
    const res = await fetchProducts(q)
    return res
  }
)

const slice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload
      state.page = 1
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload
      state.page = 1
    },
    setSort(state, action: PayloadAction<{ sortBy?: 'price' | 'rating', sortDir?: 'asc' | 'desc' }>) {
      state.sortBy = action.payload.sortBy
      state.sortDir = action.payload.sortDir
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setView(state, action: PayloadAction<ViewMode>) {
      state.view = action.payload
      state.items = []
      state.page = 1
      state.hasMore = true
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload
      state.page = 1
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload.items
        state.total = action.payload.total
        state.hasMore = state.items.length < state.total
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(loadMore.fulfilled, (state, action) => {
        state.page += 1
        state.items = state.items.concat(action.payload.items)
        state.total = action.payload.total
        state.hasMore = state.items.length < state.total
      })
  }
})

export const { setCategory, setSearch, setSort, setPage, setView, setLimit } = slice.actions
export default slice.reducer
