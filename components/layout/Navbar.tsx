"use client"

import Link from "next/link"
import { Search, ShoppingBag, X, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/store/cart"
import { CartDrawer } from "@/components/cart/CartDrawer"

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Collections", href: "/shop?category=bracelets" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQ, setSearchQ] = useState("")
  const { count } = useCart()
  const cartCount = count()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQ.trim()
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-200 ${
          scrolled ? "border-b border-[#E8E8E8]" : "border-b border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-sans text-sm font-black tracking-[0.18em] uppercase text-black" aria-label="GURLY home">
            GURLY
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60 hover:text-black transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              id="nav-search-btn"
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center text-black/60 hover:text-black transition-colors"
            >
              <Search size={15} />
            </button>
            <button
              id="nav-cart-link"
              type="button"
              aria-label="Cart"
              className="w-9 h-9 flex items-center justify-center text-black/60 hover:text-black transition-colors relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={15} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[8px] font-black flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-black/60 hover:text-black transition-colors md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden border-t border-[#E8E8E8]"
            >
              <form onSubmit={submitSearch} className="max-w-[1400px] mx-auto px-6 md:px-10 h-11 flex items-center gap-3">
                <Search size={13} className="text-black/30 shrink-0" />
                <input
                  id="nav-search-input"
                  autoFocus
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products…"
                  className="flex-1 text-xs text-black outline-none bg-transparent placeholder-black/30 font-medium"
                />
                <button type="submit" className="text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors shrink-0">Go</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-30 bg-white pt-14 flex flex-col"
          >
            <nav className="flex flex-col px-6 pt-8 gap-6">
              {[...navLinks, { label: "Wishlist", href: "/wishlist" }, { label: "Account", href: "/account" }].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-black uppercase tracking-tight text-black border-b border-[#E8E8E8] pb-4"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
