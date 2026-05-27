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
      <header className={`luxury-nav ${scrolled ? "luxury-nav-scrolled" : "luxury-nav-transparent"}`}>
        <div className="luxury-nav-inner">
          <Link href="/" className="luxury-logo" aria-label="GURLY home">
            GURLY
          </Link>

          <nav className="luxury-nav-links hidden md:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="mega-menu-link">
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
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
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

        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              className="luxury-search-panel"
              initial={{ opacity: 0, y: -15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -15, height: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu-panel" 
            data-testid="mobile-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {[...navItems, { label: "Wishlist", href: "/wishlist" }, { label: "Cart", href: "/cart" }, { label: "Account", href: "/account" }].map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mobile-bottom-nav md:hidden" aria-label="Mobile shortcuts">
        {mobileItems.map(({ label, href, Icon }) => (
          <Link key={href} href={href}>
            <Icon size={17} />
            <span>{label}</span>
          </Link>
        ))}
        <button type="button" onClick={() => setCartOpen(true)}>
          <div className="relative">
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose text-white text-[8px] flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

