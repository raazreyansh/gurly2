"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Package, Bell, User, ChevronRight } from "lucide-react"

export default function AccountPage() {
  const menu = [
    { href: "/account/orders", label: "My Orders", desc: "View and track your orders", Icon: Package },
    { href: "/account/notifications", label: "Notifications", desc: "Stay updated on your orders", Icon: Bell },
    { href: "/account", label: "Profile Settings", desc: "Update your personal info", Icon: User },
  ]

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{
                width: "60px", height: "60px", borderRadius: "50%",
                background: "var(--rose-light)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <User size={24} color="var(--rose-dark)" />
              </div>
              <div>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: "500" }}>My Account</h1>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>Manage your GURLY experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px 80px" }}>
          <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {menu.map(({ href, label, desc, Icon }) => (
              <Link key={href} href={href} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px 24px",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--rose)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)" }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} color="var(--rose)" />
                  </div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: "500", color: "var(--charcoal)" }}>{label}</p>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>{desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--muted)" />
              </Link>
            ))}

            <button className="btn btn-outline" id="signout-btn" style={{ marginTop: "12px", color: "#EF4444", borderColor: "#EF4444" }}
              onClick={async () => {
                const { supabase } = await import("@/lib/supabase/client")
                await supabase.auth.signOut()
                window.location.href = "/"
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
