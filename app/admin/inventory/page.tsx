export const metadata = { title: "Inventory" }

export default function AdminInventoryPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Inventory</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Track and manage product stock levels</p>
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "60px", textAlign: "center", color: "var(--muted)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px" }}>Inventory tracking</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>Stock levels will display here once products are added</p>
      </div>
    </div>
  )
}
