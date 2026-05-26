"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useSyncExternalStore } from "react"
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Tag, Settings, Boxes, FileText, Lock
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/inventory", label: "Inventory", Icon: Boxes },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/analytics", label: "Analytics", Icon: BarChart2 },
  { href: "/admin/reports", label: "Reports", Icon: FileText },
  { href: "/admin/coupons", label: "Coupons", Icon: Tag },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
]

const ADMIN_AUTH_KEY = "gurly_admin_auth"
const ADMIN_AUTH_EVENT = "gurly_admin_auth_change"

function subscribeAdminAuth(callback: () => void) {
  window.addEventListener("storage", callback)
  window.addEventListener(ADMIN_AUTH_EVENT, callback)

  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(ADMIN_AUTH_EVENT, callback)
  }
}

function getAdminAuthSnapshot() {
  return localStorage.getItem(ADMIN_AUTH_KEY) === "authenticated"
}

function getAdminAuthServerSnapshot() {
  return false
}

function notifyAdminAuthChanged() {
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT))
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthenticated = useSyncExternalStore(
    subscribeAdminAuth,
    getAdminAuthSnapshot,
    getAdminAuthServerSnapshot
  )
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Check custom environment password or fall back to secure default "gurlyadmin2026"
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "gurlyadmin2026"
    
    if (password === correctPassword) {
      localStorage.setItem(ADMIN_AUTH_KEY, "authenticated")
      notifyAdminAuthChanged()
      setError("")
    } else {
      setError("Incorrect administrator password. Please try again.")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_AUTH_KEY)
    notifyAdminAuthChanged()
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "var(--charcoal)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-sans)"
      }}>
        <div style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "400px",
          padding: "40px 32px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}>
          {/* Logo */}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "32px",
            color: "var(--white)",
            letterSpacing: "0.15em",
            marginBottom: "8px"
          }}>
            GURLY
          </h1>
          <p style={{
            fontSize: "11px",
            color: "var(--rose-light)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: "32px"
          }}>
            Protected Admin Gate
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <input
                type="password"
                placeholder="Enter Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 44px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "4px",
                  color: "var(--white)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--rose)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 255, 255, 0.12)"}
              />
              <Lock size={16} color="rgba(255, 255, 255, 0.4)" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            </div>

            {error && (
              <p style={{ fontSize: "12px", color: "#EF4444", textAlign: "left", margin: "0" }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-rose pulse-btn" style={{ width: "100%", padding: "14px", fontSize: "12px", marginTop: "8px" }}>
              Authenticate
            </button>
          </form>

          <Link href="/" style={{ display: "inline-block", fontSize: "12px", color: "rgba(255, 255, 255, 0.4)", marginTop: "24px", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--white)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}>
            ← Back to Storefront
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ position: "relative" }}>
        {/* Logo */}
        <div style={{ padding: "0 24px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Link href="/" style={{
            fontFamily: "var(--font-serif)",
            fontSize: "22px",
            fontWeight: "700",
            letterSpacing: "0.1em",
            color: "var(--white)",
            textTransform: "uppercase",
          }}>
            GURLY
          </Link>
          <p style={{ fontSize: "10px", color: "var(--rose-light)", letterSpacing: "0.1em", marginTop: "4px", textTransform: "uppercase" }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 0" }}>
          {navItems.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                id={`admin-nav-${label.toLowerCase()}`}
                className={`admin-nav-link ${active ? "active" : ""}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ position: "absolute", bottom: "24px", left: 0, right: 0, padding: "0 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", padding: "0", textAlign: "left", fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#EF4444"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
            Logout Securely
          </button>
          <Link href="/" style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "8px" }}>
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: "auto" }}>
        {children}
      </main>
    </div>
  )
}
