'use client'

import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CartDrawer } from '../cart/CartDrawer'

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <CartDrawer />
    </div>
  )
}
