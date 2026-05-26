export const metadata = { title: "Customers" }

export default function AdminCustomersPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Customers</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Customer relationship management</p>
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "60px", textAlign: "center", color: "var(--muted)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px" }}>No customers yet</p>
        <p style={{ fontSize: "13px", marginTop: "8px" }}>Customer profiles will appear here after signup</p>
      </div>
    </div>
  )
}
