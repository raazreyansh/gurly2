import Link from "next/link"
import { Bell, ChevronLeft, Package, Tag } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export const metadata = { title: "Notifications | GURLY" }

const notifications = [
  {
    title: "Order updates",
    body: "Shipping, delivery, and return updates for your purchases will appear here.",
    Icon: Package,
  },
  {
    title: "Offers",
    body: "Exclusive coupon and sale alerts are shown here when available.",
    Icon: Tag,
  },
]

export default function AccountNotificationsPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
          <div className="container">
            <Link href="/account" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted)", marginBottom: "16px" }}>
              <ChevronLeft size={14} /> Back to account
            </Link>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Notifications</h1>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>
              Customer order alerts and account updates.
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px 80px" }}>
          <div style={{ maxWidth: "760px", display: "grid", gap: "14px" }}>
            {notifications.map(({ title, body, Icon }) => (
              <article key={title} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", display: "flex", gap: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "8px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                  <Icon size={18} color="var(--rose)" />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px" }}>{title}</h2>
                  <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.7 }}>{body}</p>
                </div>
              </article>
            ))}
          </div>

          <div style={{ maxWidth: "760px", marginTop: "20px", background: "rgba(201,149,108,0.06)", border: "1px solid rgba(201,149,108,0.2)", borderRadius: "8px", padding: "18px", display: "flex", gap: "12px", alignItems: "center" }}>
            <Bell size={18} color="var(--rose)" />
            <p style={{ fontSize: "13px", color: "var(--charcoal-light)" }}>You are all caught up.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
