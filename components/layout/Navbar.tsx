"use client"

import Link from "next/link"
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/store/cart"

const navItems = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?category=new-arrivals" },
  { label: "Earrings", href: "/shop?category=earrings" },
  { label: "Necklaces", href: "/shop?category=necklaces" },
  { label: "Bracelets", href: "/shop?category=bracelets" },
  { label: "Accessories", href: "/shop?category=accessories" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ] = useState("")
  const { items } = useCart()
  const cartCount = items.reduce((a, b) => a + b.quantity, 0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "var(--nav-h)",
          background: scrolled ? "rgba(253,246,238,0.95)" : "var(--cream)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
          transition: "all 0.3s ease",
        }}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "26px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "var(--charcoal)",
              textTransform: "uppercase",
            }}
          >
            GURLY
          </Link>

          {/* Nav Links */}
          <nav style={{ marginLeft: "48px", gap: "32px", alignItems: "center" }} className="hidden md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--charcoal-light)",
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal-light)")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              id="nav-search-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: "none", border: "none", color: "var(--charcoal-light)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal-light)")}
            >
              <Search size={18} />
            </button>
            <Link
              href="/wishlist"
              id="nav-wishlist-link"
              aria-label="Wishlist"
              style={{ color: "var(--charcoal-light)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal-light)")}
            >
              <Heart size={18} />
            </Link>
            <Link
              href="/cart"
              id="nav-cart-link"
              aria-label="Cart"
              style={{ position: "relative", color: "var(--charcoal-light)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal-light)")}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="badge" style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "9px" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              id="nav-account-link"
              aria-label="Account"
              style={{ color: "var(--charcoal-light)", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--charcoal-light)")}
            >
              <User size={18} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "none", border: "none", color: "var(--charcoal)" }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--white)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
            boxShadow: "var(--shadow-md)",
          }}>
            <div className="container">
              <form onSubmit={(e) => { e.preventDefault(); window.location.href = `/search?q=${searchQ}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Search size={16} color="var(--muted)" />
                  <input
                    id="nav-search-input"
                    autoFocus
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Search earrings, necklaces, accessories..."
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "15px",
                      fontFamily: "var(--font-sans)",
                      background: "transparent",
                      color: "var(--charcoal)",
                    }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: "8px 20px", fontSize: "12px" }}>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: "var(--nav-h)",
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--cream)",
          zIndex: 99,
          padding: "32px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }} data-testid="mobile-menu">
          {[
            ...navItems,
            { label: "Wishlist", href: "/wishlist" },
            { label: "Cart", href: "/cart" },
            { label: "Account", href: "/account" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "24px",
                fontWeight: "400",
                color: "var(--charcoal)",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
