'use client'

import Link from 'next/link'
import { Search, Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { openCart, items } = useCartStore()
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-pearl/80 backdrop-blur-md border-b border-neutral-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.15em] font-medium text-brandBlack">
          <Link href="/shop" className="hover:opacity-70 transition">Shop All</Link>
          <Link href="/shop?category=earrings" className="hover:opacity-70 transition">Earrings</Link>
          <Link href="/shop?category=necklaces" className="hover:opacity-70 transition">Necklaces</Link>
        </nav>

        <Link
          href="/"
          className="font-serif text-3xl tracking-widest text-brandBlack lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          GURLY
        </Link>

        <div className="flex items-center gap-6 text-brandBlack">
          <button className="hover:opacity-70 transition">
            <Search size={18} strokeWidth={1.5} />
          </button>
          <Link href="/wishlist" className="hover:opacity-70 transition hidden sm:block">
            <Heart size={18} strokeWidth={1.5} />
          </Link>
          <button onClick={openCart} className="hover:opacity-70 transition flex items-center gap-2">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span className="text-[11px] font-medium">{totalItems}</span>
          </button>
        </div>

      </div>
    </header>
  )
}
