"use client"

import Link from "next/link"
import { Gift, Heart, Home, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/store/cart"
import { CartDrawer } from "@/components/cart/CartDrawer"

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Collections", href: "/shop?category=bracelets" },
  { label: "Gift Sets", href: "/shop?category=new-arrivals" },
  { label: "About", href: "/about" },
]

const mobileItems = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Shop", href: "/shop", Icon: Sparkles },
  { label: "Gifts", href: "/shop?category=new-arrivals", Icon: Gift },
  { label: "Wishlist", href: "/wishlist", Icon: Heart },
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
    const handler = () => setScrolled(window.scrollY > 30)
    handler()
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const q = searchQ.trim()
    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-[#041C12] border-b border-[#DFBA73]/15 py-4 shadow-xl" 
          : "bg-transparent border-b border-[#F7F4EB]/5 py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-normal tracking-[0.15em] text-[#F7F4EB] hover:text-[#DFBA73] transition-colors" aria-label="GURLY home">
            GURLY<span className="text-[#DFBA73]">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[9px] font-extrabold uppercase tracking-[0.25em]" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[#C8C5B9] hover:text-[#DFBA73] transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-[#F7F4EB]">
            <button
              id="nav-search-btn"
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((value) => !value)}
              className="w-10 h-10 hover:text-[#DFBA73] flex items-center justify-center transition-colors"
            >
              <Search size={16} />
            </button>
            <Link href="/wishlist" id="nav-wishlist-link" aria-label="Wishlist" className="w-10 h-10 hover:text-[#DFBA73] hidden sm:flex items-center justify-center transition-colors">
              <Heart size={16} />
            </Link>
            <button
              id="nav-cart-link"
              type="button"
              aria-label="Cart"
              className="w-10 h-10 hover:text-[#DFBA73] flex items-center justify-center transition-colors relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-[#DFBA73] text-[#041C12] text-[8px] font-extrabold flex items-center justify-center rounded-none"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <Link href="/account" id="nav-account-link" aria-label="Account" className="w-10 h-10 hover:text-[#DFBA73] hidden sm:flex items-center justify-center transition-colors">
              <User size={16} />
            </Link>
            <button
              type="button"
              className="w-10 h-10 hover:text-[#DFBA73] flex md:hidden items-center justify-center transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Panel */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              className="w-full bg-[#03170F] border-b border-[#DFBA73]/30 shadow-2xl py-4 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={submitSearch} className="max-w-3xl mx-auto px-6 flex items-center gap-3">
                <Search size={15} className="text-[#DFBA73]" />
                <input
                  id="nav-search-input"
                  autoFocus
                  value={searchQ}
                  onChange={(event) => setSearchQ(event.target.value)}
                  placeholder="SEARCH JEWELRY, BRACELETS, Sovereign Collections..."
                  className="w-full bg-transparent text-[10px] font-extrabold uppercase tracking-widest text-[#F7F4EB] outline-none placeholder-[#263D34]"
                />
                <button type="submit" className="text-[9px] font-extrabold tracking-widest uppercase text-[#DFBA73] hover:text-white transition-colors">SEARCH</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="md:hidden fixed top-[73px] left-0 right-0 bottom-0 bg-[#041C12]/98 border-t border-[#DFBA73]/15 flex flex-col p-6 z-30" 
            data-testid="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-6 text-xs font-extrabold uppercase tracking-[0.25em] pt-8">
              {[...navItems, { label: "Wishlist", href: "/wishlist" }, { label: "Account", href: "/account" }].map((item) => (
                <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setMenuOpen(false)} className="text-[#F7F4EB] hover:text-[#DFBA73] border-b border-[#F7F4EB]/5 pb-3">
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Shortcuts */}
      <div className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#03170F]/95 border-t border-[#DFBA73]/15 h-16 flex items-center justify-around text-[#F7F4EB]" aria-label="Mobile shortcuts">
        {mobileItems.map(({ label, href, Icon }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 hover:text-[#DFBA73] transition-colors">
            <Icon size={16} />
            <span className="text-[8px] font-extrabold uppercase tracking-wider">{label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setCartOpen(true)} className="flex flex-col items-center gap-1 hover:text-[#DFBA73] transition-colors relative">
          <div className="relative">
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-[#DFBA73] text-[#041C12] text-[7px] flex items-center justify-center font-extrabold">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[8px] font-extrabold uppercase tracking-wider">Cart</span>
        </button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
