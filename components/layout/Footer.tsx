"use client"

import Link from "next/link"
import { Globe, MessageCircle, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer style={{
      background: "var(--charcoal)",
      color: "rgba(255,255,255,0.7)",
      padding: "64px 0 32px",
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "48px",
          marginBottom: "48px",
        }}>
          {/* Brand */}
          <div>
            <h2 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              color: "var(--white)",
              marginBottom: "16px",
            }}>
              GURLY
            </h2>
            <p style={{ fontSize: "13px", lineHeight: "1.8", maxWidth: "220px" }}>
              Premium accessories curated for the modern woman. Own your spark.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
            {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--rose)"
                    e.currentTarget.style.color = "var(--rose)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)"
                  }}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--white)", marginBottom: "20px" }}>Shop</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["New Arrivals", "Earrings", "Necklaces", "Bracelets", "Accessories", "Sale"].map((item) => (
                <Link key={item} href="/shop" style={{ fontSize: "13px", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--white)", marginBottom: "20px" }}>Account</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {["My Account", "Orders", "Wishlist", "Returns", "Track Order"].map((item) => (
                <Link key={item} href="/account" style={{ fontSize: "13px", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--rose-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--white)", marginBottom: "20px" }}>Stay in the loop</h3>
            <p style={{ fontSize: "13px", marginBottom: "16px" }}>Get new arrivals & exclusive offers delivered to your inbox.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem("email") as HTMLInputElement).value
                await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })
                form.reset()
              }}
              style={{ display: "flex", gap: "8px" }}
            >
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "2px",
                  color: "var(--white)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                }}
              />
              <button type="submit" className="btn btn-rose" style={{ padding: "10px 16px", fontSize: "11px" }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <p style={{ fontSize: "12px" }}>© 2025 GURLY. All rights reserved.</p>
          <div style={{ display: "flex", gap: "24px", fontSize: "12px" }}>
            <Link href="/privacy" style={{ transition: "color 0.2s" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ transition: "color 0.2s" }}>Terms</Link>
            <Link href="/support" style={{ transition: "color 0.2s" }}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
