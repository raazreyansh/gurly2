"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart2,
  Tag, Settings, Boxes, FileText
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
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
        <div style={{ position: "absolute", bottom: "24px", left: 0, right: 0, padding: "0 24px" }}>
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
