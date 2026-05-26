import { getDashboardMetrics } from "@/services/admin/analytics"
import { TrendingUp, ShoppingCart, Users, Package, Target } from "lucide-react"

export const metadata = { title: "Analytics" }

export default async function AdminAnalyticsPage() {
  const metrics = await getDashboardMetrics()

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Analytics</h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>Business performance overview</p>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginBottom: "32px" }} className="lg:grid-cols-3">
        {[
          { label: "Total Revenue", value: `₹${metrics.revenue.toLocaleString("en-IN")}`, Icon: TrendingUp, color: "var(--rose)" },
          { label: "Total Orders", value: metrics.orders.toString(), Icon: ShoppingCart, color: "#3B82F6" },
          { label: "Total Customers", value: metrics.customers.toString(), Icon: Users, color: "#10B981" },
          { label: "Products Listed", value: metrics.products.toString(), Icon: Package, color: "#8B5CF6" },
          { label: "Avg. Order Value", value: `₹${metrics.aov.toFixed(0)}`, Icon: Target, color: "#F59E0B" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={18} color={color} />
              </div>
              <p style={{ fontSize: "12px", color: "var(--muted)", fontWeight: "500" }}>{label}</p>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Empty Chart placeholder */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "40px", textAlign: "center", color: "var(--muted)" }}>
        <TrendingUp size={48} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", marginBottom: "8px" }}>Revenue Chart</p>
        <p style={{ fontSize: "13px" }}>Connect Supabase and start processing orders to see revenue data here.</p>
      </div>
    </div>
  )
}
