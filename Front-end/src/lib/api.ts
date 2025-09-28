import { http } from './http'

export type Product = {
  id: number
  title: string
  category: string | { id: number; name: string; slug: string }
  price: number
  rating: number
  thumbnail: string
}

export type Query = {
  category?: string
  sortBy?: 'price' | 'rating'
  sortDir?: 'asc' | 'desc'
  search?: string
  page?: number
  limit?: number
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function fetchProducts(q: Query): Promise<{ items: Product[], total: number }> {
  const params = new URLSearchParams()

  if (q.category && q.category !== 'All') params.append('category', q.category)
  if (q.search) params.append('search', q.search)
  if (q.sortBy) params.append('sortBy', q.sortBy)
  if (q.sortDir) params.append('sortDir', q.sortDir)
  if (q.page) params.append('page', String(q.page))
  if (q.limit) params.append('limit', String(q.limit))

  const response = await http.get(`/api/products/?${params.toString()}`)
  await delay(400)

  const items: Product[] = response.data.results
  const total: number = response.data.count ?? items.length

  return { items, total }
}
