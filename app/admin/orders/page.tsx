export const metadata = { title: "Orders" }

export default function AdminOrdersPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Orders</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Manage and process customer orders</p>
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "60px", textAlign: "center", color: "var(--muted)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px" }}>No orders yet</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>Orders will appear here once customers start buying</p>
      </div>
    </div>
  )
}
