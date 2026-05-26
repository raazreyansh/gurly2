"use client"

import { useState, useEffect } from "react"
import { TrendingUp, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getDashboardMetrics, getAdminOrders } from "@/services/admin/analytics"

type RecentOrder = {
  id: string
  total?: number | null
  status?: string | null
  created_at: string
  email?: string | null
  profiles?: {
    full_name?: string | null
    email?: string | null
  } | null
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    revenue: 0,
    orders: 0,
    customers: 0,
    products: 0,
    conversion: 2.8,
    aov: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [metricsData, ordersData] = await Promise.all([
          getDashboardMetrics(),
          getAdminOrders(),
        ])
        if (metricsData) {
          setMetrics(metricsData)
        }
        if (ordersData) {
          setRecentOrders((ordersData as RecentOrder[]).slice(0, 5)) // Get the top 5 recent orders
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const stats = [
    { label: "Total Revenue", value: `₹${metrics.revenue.toLocaleString()}`, change: "+12.5%", up: true, Icon: TrendingUp, color: "var(--rose)" },
    { label: "Total Orders", value: String(metrics.orders), change: "+8.2%", up: true, Icon: ShoppingCart, color: "#3B82F6" },
    { label: "Customers", value: String(metrics.customers), change: "+24.1%", up: true, Icon: Users, color: "#10B981" },
    { label: "Products", value: String(metrics.products), change: "-2.4%", up: false, Icon: Package, color: "#8B5CF6" },
  ]

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>
            Welcome back! Here&apos;s what&apos;s happening with GURLY today.
          </p>
        </div>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--muted)" }}>
            <span className="spinner" style={{
              width: "14px",
              height: "14px",
              border: "2px solid var(--border)",
              borderTopColor: "var(--rose)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            Refreshing data...
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "40px" }} className="lg:grid-cols-4">
        {stats.map(({ label, value, change, up, Icon, color }) => (
          <div key={label} className="stat-card" style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
            position: "relative",
            overflow: "hidden"
          }}>
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
            {loading ? (
              <div className="skeleton" style={{ height: "32px", width: "100px", marginBottom: "8px", borderRadius: "4px" }} />
            ) : (
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)", marginBottom: "4px" }}>
                {value}
              </p>
            )}
            <p style={{ fontSize: "12px", color: "var(--muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="lg:grid-cols-3">
        {/* Recent Orders */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", gridColumn: "span 2" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "500", marginBottom: "20px" }}>
            Recent Orders
          </h2>
          
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "4px" }} />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ color: "var(--muted)", textAlign: "center", padding: "40px 0", fontSize: "13px" }}>
              <ShoppingCart size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <p>No orders yet</p>
              <p style={{ fontSize: "11px", marginTop: "4px" }}>Orders will appear here once customers start buying</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
                    <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Order ID</th>
                    <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Customer</th>
                    <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Total</th>
                    <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Status</th>
                    <th style={{ padding: "12px 8px", fontSize: "12px", fontWeight: "600", color: "var(--muted)", textTransform: "uppercase" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", fontSize: "13px" }}>
                      <td style={{ padding: "16px 8px", fontWeight: "500", color: "var(--charcoal)" }}>
                        #{order.id.slice(0, 8)}
                      </td>
                      <td style={{ padding: "16px 8px" }}>
                        <p style={{ fontWeight: "500", margin: 0 }}>{order.profiles?.full_name || "Guest User"}</p>
                        <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{order.profiles?.email || order.email || "no-email@gurly.com"}</p>
                      </td>
                      <td style={{ padding: "16px 8px", fontWeight: "600", color: "var(--charcoal)" }}>
                        ₹{order.total?.toLocaleString() ?? "0"}
                      </td>
                      <td style={{ padding: "16px 8px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "20px",
                          fontSize: "11px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.02em",
                          background: order.status === "paid" ? "#D1FAE5" : order.status === "pending" ? "#FEF3C7" : "#FEE2E2",
                          color: order.status === "paid" ? "#065F46" : order.status === "pending" ? "#92400E" : "#991B1B"
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "16px 8px", color: "var(--muted)" }}>
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
