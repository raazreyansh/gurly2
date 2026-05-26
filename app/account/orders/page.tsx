import { getOrders } from "@/services/orders"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import type { Order } from "@/types/database"

export const metadata = { title: "My Orders" }

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: "#FFF8E1", color: "#F57F17" },
  confirmed: { bg: "#E3F2FD", color: "#1565C0" },
  shipped: { bg: "#E8EAF6", color: "#283593" },
  delivered: { bg: "#E8F5E9", color: "#2E7D32" },
  cancelled: { bg: "#FFEBEE", color: "#C62828" },
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
          <div className="container">
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>My Orders</h1>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px 80px" }}>
          {orders && orders.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px" }}>
              {orders.map((order: Order) => {
                const status = order.status ?? "pending"
                const colors = STATUS_COLORS[status] ?? STATUS_COLORS.pending
                return (
                  <Link key={order.id} href={`/order/${order.id}`} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={20} color="var(--rose)" />
                      </div>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--charcoal)" }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--charcoal)" }}>₹{order.total?.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px", background: colors.bg, color: colors.color, textTransform: "capitalize" }}>
                        {status}
                      </span>
                      <ChevronRight size={15} color="var(--muted)" />
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--muted)", maxWidth: "400px", margin: "0 auto" }}>
              <Package size={48} style={{ margin: "0 auto 20px", opacity: 0.2 }} />
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "12px", color: "var(--charcoal)" }}>No orders yet</h2>
              <p style={{ fontSize: "14px", marginBottom: "32px" }}>Start shopping to see your orders here.</p>
              <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
