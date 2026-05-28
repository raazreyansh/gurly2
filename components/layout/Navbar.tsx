"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Gift, Heart, Home, Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react"
import { useCart } from "@/store/cart"
import { CartDrawer } from "@/components/cart/CartDrawer"

const desktopLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Collections", href: "/shop?category=bracelets" },
  { label: "Gift Sets", href: "/shop?category=new-arrivals" },
  { label: "About", href: "/about" },
]

const mobileLinks = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Shop", href: "/shop", Icon: Sparkles },
  { label: "Gift Sets", href: "/shop?category=new-arrivals", Icon: Gift },
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
    const handler = () => setScrolled(window.scrollY > 18)
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
      <header className={`luxury-nav ${scrolled ? "luxury-nav-scrolled" : ""}`}>
        <div className="luxury-nav-inner">
          <Link href="/" className="luxury-logo" aria-label="GURLY home">
            GURLY
          </Link>

          <nav className="luxury-nav-links hidden md:flex" aria-label="Primary navigation">
            {desktopLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="luxury-nav-actions">
            <button
              id="nav-search-btn"
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen((value) => !value)}
              className="nav-icon-button"
            >
              <Search size={18} />
            </button>
            <Link href="/wishlist" id="nav-wishlist-link" aria-label="Wishlist" className="nav-icon-button hidden sm:inline-flex">
              <Heart size={18} />
            </Link>
            <button
              id="nav-cart-link"
              type="button"
              aria-label="Cart"
              className="nav-icon-button nav-cart-button"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span>{cartCount}</span>}
            </button>
            <Link href="/account" id="nav-account-link" aria-label="Account" className="nav-icon-button hidden sm:inline-flex">
              <User size={18} />
            </Link>
            <button
              type="button"
              className="nav-icon-button md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="luxury-search-panel">
            <form onSubmit={submitSearch} className="luxury-search-form">
              <Search size={17} />
              <input
                id="nav-search-input"
                autoFocus
                value={searchQ}
                onChange={(event) => setSearchQ(event.target.value)}
                placeholder="Search earrings, necklaces, gift sets..."
              />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu-panel"
            data-testid="mobile-menu"
          >
            <nav className="mobile-menu-links">
              {[...desktopLinks, { label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }, { label: "Account", href: "/account" }].map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mobile-bottom-nav md:hidden" aria-label="Mobile shortcuts">
        {mobileLinks.map(({ label, href, Icon }) => (
          <Link key={href} href={href}>
            <Icon size={17} />
            <span>{label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={17} />
          <span>Cart</span>
        </button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
