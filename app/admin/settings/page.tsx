export const metadata = { title: "Settings" }

export default function AdminSettingsPage() {
  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Settings</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Manage store configuration</p>
      <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {[
          { title: "Store Name", desc: "GURLY", field: "store-name" },
          { title: "Support Email", desc: "support@gurly.in", field: "support-email" },
          { title: "Currency", desc: "INR (₹)", field: "currency" },
        ].map(({ title, desc, field }) => (
          <div key={field} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "8px" }}>{title}</label>
            <input id={field} defaultValue={desc} className="input" />
          </div>
        ))}
        <button className="btn btn-primary" id="save-settings-btn">Save Settings</button>
      </div>
    </div>
  )
}
