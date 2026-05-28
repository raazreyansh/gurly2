'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

export function Navbar() {
  const { openCart, items } = useCartStore()
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-black">
          <Link href="/shop" className="hover:opacity-60 transition">Shop All</Link>
          <Link href="/shop?category=earrings" className="hover:opacity-60 transition">Earrings</Link>
          <Link href="/shop?category=necklaces" className="hover:opacity-60 transition">Necklaces</Link>
        </nav>

        <Link
          href="/"
          className="font-serif text-3xl tracking-widest text-black lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          GURLY
        </Link>

        <div className="flex items-center gap-6 text-black">
          <button className="hover:opacity-60 transition">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <Link href="/wishlist" className="hover:opacity-60 transition hidden sm:block">
            <Heart size={18} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} className="hover:opacity-60 transition flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="text-[11px] font-medium">{totalItems}</span>
          </button>
        </div>

      </div>
    </header>
  )
}
