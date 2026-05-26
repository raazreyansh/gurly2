export function Empty({ message = "No data yet", submessage }: { message?: string; submessage?: string }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--muted)" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--cream-dark)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <span style={{ fontSize: "20px" }}>✦</span>
      </div>
      <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", color: "var(--charcoal)", marginBottom: "8px" }}>{message}</p>
      {submessage && <p style={{ fontSize: "13px" }}>{submessage}</p>}
    </div>
  )
}
