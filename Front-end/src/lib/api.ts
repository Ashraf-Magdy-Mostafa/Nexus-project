
import data from '../mocks/products.json'

export type Product = {
  id: number
  title: string
  category: string
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

const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function fetchProducts(q: Query): Promise<{ items: Product[], total: number }> {
  await delay(400) // simulate network latency
  const page = q.page ?? 1
  const limit = q.limit ?? 20
  let items = [...(data as Product[])]

  // search
  if (q.search && q.search.trim()) {
    const s = q.search.toLowerCase()
    items = items.filter(p => p.title.toLowerCase().includes(s))
  }

  // category
  if (q.category && q.category !== 'All') {
    items = items.filter(p => p.category === q.category)
  }

  // sorting
  if (q.sortBy) {
    const dir = q.sortDir === 'desc' ? -1 : 1
    items.sort((a, b) => (a[q.sortBy!] > b[q.sortBy!] ? 1 : -1) * dir)
  }

  const total = items.length
  const start = (page - 1) * limit
  const end = start + limit
  const pageItems = items.slice(start, end)

  return { items: pageItems, total }
}
