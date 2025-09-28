import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import ProductCard from './ProductCard'
import { loadMore, loadProducts, setPage } from '../store/productsSlice'

function Spinner() {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
    </div>
  )
}

export default function Grid() {
  const dispatch = useAppDispatch()
  const { items, total, page, limit, status, view, hasMore } = useAppSelector(
    (s) => s.products
  )
  console.log(import.meta.env.VITE_API_URL)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  )

  // ⏳ Track fetch error after 5s if still loading
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    if (status === 'loading') {
      setFetchError(false)
      timer = setTimeout(() => {
        setFetchError(true)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [status])

  // Infinite scroll observer
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (view !== 'infinite') return
    if (!sentinel.current) return
    const el = sentinel.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && status !== 'loading') {
          dispatch(loadMore())
        }
      },
      { rootMargin: '300px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [dispatch, view, hasMore, status])

  // fetch first page when switching view
  useEffect(() => {
    if (view === 'pagination' || view === 'infinite') {
      dispatch(loadProducts())
    }
  }, [view, dispatch])

  // ✅ Top-level check: if no items → show error
  if (items.length === 0) {
    return (
      <div className="container pb-12">
        <div className="py-12 text-center text-red-600">
          ⚠️ Cannot fetch products or no products available.
          <div className="mt-4">
            <button
              onClick={() => dispatch(loadProducts())}
              className="rounded border border-red-600 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Else → render the normal grid
  return (
    <div className="container pb-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}

        {/* Skeleton loaders only for pagination */}
        {status === 'loading' &&
          view === 'pagination' &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border p-3">
              <div className="skeleton mb-3 h-32 w-full"></div>
              <div className="skeleton mb-2 h-4 w-3/4"></div>
              <div className="skeleton mb-2 h-4 w-1/2"></div>
              <div className="skeleton h-6 w-1/3"></div>
            </div>
          ))}
      </div>

      {/* Pagination controls */}
      {view === 'pagination' && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => {
              dispatch(setPage(Math.max(1, page - 1)))
              dispatch(loadProducts())
            }}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => {
              dispatch(setPage(Math.min(totalPages, page + 1)))
              dispatch(loadProducts())
            }}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Infinite scroll sentinel + spinner */}
      {view === 'infinite' && <div ref={sentinel} className="mt-6 h-10 w-full" />}
      {view === 'infinite' && status === 'loading' && <Spinner />}

      {/* Extra timeout failsafe message */}
      {fetchError && (
        <div className="mt-4 text-center text-sm text-red-600">
          ⚠️ Fetch taking too long. Please try again.
        </div>
      )}
    </div>
  )
}
