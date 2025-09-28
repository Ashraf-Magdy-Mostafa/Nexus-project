
import React from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import Grid from './components/Grid'
import CartDrawer from './components/CartDrawer'

export default function App() {
  return (
    <div className="min-h-screen">

      <main>
        <Controls />
        <Grid />
      </main>
      <CartDrawer />
    </div>
  )
}
