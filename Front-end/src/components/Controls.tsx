import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import {
  loadProducts,
  setCategory,
  setSearch,
  setSort,
  setView,
  setLimit,
} from '../store/productsSlice'

const categories = [
  'All',
  'Phones',
  'Laptops',
  'Audio',
  'Wearables',
  'Gaming',
  'Home',
  'Cameras',
]

export default function Controls() {
  const dispatch = useAppDispatch()
  const { category, search, sortBy, sortDir, view, limit, status } =
    useAppSelector((s) => s.products)

  useEffect(() => {
    dispatch(loadProducts())
  }, [category, search, sortBy, sortDir, limit, dispatch])

  return (
    <div className="container grid gap-4 py-6 md:grid-cols-12">
      <input
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="🔍 Search products..."
        className="md:col-span-4 rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
      />
      <select
        value={category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
        className="md:col-span-3 rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
      >
        <option disabled>📂 Category</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={`${sortBy ?? ''}:${sortDir ?? ''}`}
        onChange={(e) => {
          const [sb, sd] = e.target.value.split(':')
          dispatch(
            setSort({
              sortBy: sb ? (sb as any) : undefined,
              sortDir: sd ? (sd as any) : undefined,
            })
          )
        }}
        className="md:col-span-3 rounded-xl border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
      >
        <option value=":">↕️ Sort by</option>
        <optgroup label="Price">
          <option value="price:asc">Lowest first</option>
          <option value="price:desc">Highest first</option>
        </optgroup>
        <optgroup label="Rating">
          <option value="rating:desc">Top rated</option>
          <option value="rating:asc">Lowest rated</option>
        </optgroup>
      </select>
      <div className="md:col-span-2 flex gap-3">
        <select
          value={limit}
          onChange={(e) => dispatch(setLimit(parseInt(e.target.value)))}
          className="rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
          title="Items per page"
        >
          {[12, 20, 24, 30].map((n) => (
            <option key={n} value={n}>
              {n} per page
            </option>
          ))}
        </select>
        <select
          value={view}
          onChange={(e) => dispatch(setView(e.target.value as any))}
          className="rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
          title="Display mode"
        >
          <option value="pagination">📑 Pagination</option>
          <option value="infinite">∞ Infinite scroll</option>
        </select>
      </div>
      {status === 'loading' && (
        <div className="md:col-span-12 flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  )
}
