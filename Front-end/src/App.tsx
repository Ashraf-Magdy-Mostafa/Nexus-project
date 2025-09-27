
import React from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import Grid from './components/Grid'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Controls />
        <Grid />
      </main>
      <CartDrawer />
      <footer className="border-t bg-white">
        <div className="container flex flex-wrap items-center justify-between gap-2 py-6 text-sm text-gray-600">
          <p>© 2025 ProDev Catalog. Educational demo.</p>
          <p>Switch between Pagination & Infinite Scroll in the controls.</p>
        </div>
      </footer>
    </div>
  )
}
