export const metadata = { title: "Reports" }

export default function AdminReportsPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Reports</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Export and analyze business data</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {["Sales Report", "Customer Report", "Inventory Report", "Coupon Usage"].map((r) => (
          <div key={r} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>{r}</p>
            <button className="btn btn-outline" style={{ padding: "8px 16px", fontSize: "11px" }}>Export CSV</button>
          </div>
        ))}
      </div>
    </div>
  )
}
