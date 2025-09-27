
import React, { useEffect, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import ProductCard from './ProductCard'
import { loadMore, loadProducts, setPage } from '../store/productsSlice'

export default function Grid() {
  const dispatch = useAppDispatch()
  const { items, total, page, limit, status, view, hasMore } = useAppSelector(s => s.products)

  const totalPages = useMemo(()=> Math.max(1, Math.ceil(total/limit)), [total, limit])

  // Infinite scroll observer
  const sentinel = useRef<HTMLDivElement | null>(null)
  useEffect(()=>{
    if (view !== 'infinite') return
    if (!sentinel.current) return
    const el = sentinel.current
    const io = new IntersectionObserver((entries)=>{
      if (entries[0].isIntersecting && hasMore && status !== 'loading') {
        dispatch(loadMore())
      }
    }, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [dispatch, view, hasMore, status])

  // fetch first page when switching to pagination
  useEffect(()=>{
    if (view === 'pagination') dispatch(loadProducts())
  }, [view, dispatch])

  return (
    <div className="container pb-12">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map(p => <ProductCard key={p.id} p={p} />)}
        {status === 'loading' && Array.from({length:6}).map((_,i)=>(
          <div key={i} className="h-64 rounded-2xl border p-3">
            <div className="skeleton h-32 w-full mb-3"></div>
            <div className="skeleton h-4 w-3/4 mb-2"></div>
            <div className="skeleton h-4 w-1/2 mb-2"></div>
            <div className="skeleton h-6 w-1/3"></div>
          </div>
        ))}
      </div>

      {view === 'pagination' && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={()=>dispatch(setPage(Math.max(1, page-1))) && dispatch(loadProducts())}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            disabled={page<=1}
          >Prev</button>
          <span className="text-sm">Page {page} / {totalPages}</span>
          <button
            onClick={()=>dispatch(setPage(Math.min(totalPages, page+1))) && dispatch(loadProducts())}
            className="rounded-xl border px-3 py-2 text-sm disabled:opacity-50"
            disabled={page>=totalPages}
          >Next</button>
        </div>
      )}

      {view === 'infinite' && <div ref={sentinel} className="mt-6 h-10 w-full" />}
    </div>
  )
}
