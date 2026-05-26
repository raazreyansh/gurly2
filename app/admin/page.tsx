import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react"

export const metadata = { title: "Dashboard" }

const stats = [
  { label: "Total Revenue", value: "₹0", change: "+12.5%", up: true, Icon: TrendingUp, color: "var(--rose)" },
  { label: "Total Orders", value: "0", change: "+8.2%", up: true, Icon: ShoppingCart, color: "#3B82F6" },
  { label: "Customers", value: "0", change: "+24.1%", up: true, Icon: Users, color: "#10B981" },
  { label: "Products", value: "0", change: "-2.4%", up: false, Icon: Package, color: "#8B5CF6" },
]

export default function AdminDashboard() {
  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
          Welcome back! Here&apos;s what&apos;s happening with GURLY today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }} className="lg:grid-cols-4">
        {stats.map(({ label, value, change, up, Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: `${color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={20} color={color} />
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "12px", fontWeight: "600",
                color: up ? "#10B981" : "#EF4444",
              }}>
                {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {change}
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)", marginBottom: "4px" }}>
              {value}
            </p>
            <p style={{ fontSize: "12px", color: "var(--muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="lg:grid-cols-2">
        {/* Recent Orders */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            Recent Orders
          </h2>
          <div style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0", fontSize: "13px" }}>
            <ShoppingCart size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
            <p>No orders yet</p>
            <p style={{ fontSize: "11px", marginTop: "4px" }}>Orders will appear here once customers start buying</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            Quick Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { href: "/admin/products/new", label: "Add New Product", desc: "Create a product listing" },
              { href: "/admin/coupons", label: "Create Coupon", desc: "Set up discount codes" },
              { href: "/admin/inventory", label: "Update Inventory", desc: "Manage stock levels" },
              { href: "/admin/orders", label: "View Orders", desc: "Process pending orders" },
            ].map(({ href, label, desc }) => (
              <a
                key={href}
                href={href}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "var(--cream)",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                className="quick-action-hover"
              >
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "var(--charcoal)" }}>{label}</p>
                  <p style={{ fontSize: "11px", color: "var(--muted)" }}>{desc}</p>
                </div>
                <ArrowUpRight size={14} color="var(--muted)" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
