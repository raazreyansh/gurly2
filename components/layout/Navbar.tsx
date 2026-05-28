'use client'

import Link from 'next/link'
import { Search, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'

const navItems = [
  { label: 'SHOP', href: '/shop' },
  { label: 'NEW IN', href: '/shop' },
  { label: 'BESTSELLERS', href: '/shop' },
  { label: 'ABOUT', href: '/about' },
]

export default function Navbar() {
  const { toggleCart, items } = useCartStore()
  const cartCount = items.reduce((acc, curr) => acc + curr.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-8">
        <Link
          href="/"
          className="font-serif text-3xl tracking-wider text-black font-medium"
        >
          GURLY.
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] tracking-[0.3em] text-neutral-700 transition hover:text-black font-semibold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6 text-black">
          <button className="hover:opacity-70 transition">
            <Search className="h-4 w-4" />
          </button>
          <Link href="/account" className="hover:opacity-70 transition">
            <User className="h-4 w-4" />
          </Link>

          <button
            onClick={toggleCart}
            className="relative hover:opacity-70 transition"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
