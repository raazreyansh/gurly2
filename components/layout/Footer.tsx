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

          {/* Founders */}
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--white)", marginBottom: "20px" }}>Founders</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--white)", fontWeight: "500", marginBottom: "4px" }}>Satyam Kumar</p>
                <p style={{ fontSize: "11px", color: "var(--rose-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Founder & CEO</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href="https://www.instagram.com/itss.satyaa/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--rose)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/satyaaaa" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--rose)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="https://github.com/raazreyansh" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--rose)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "var(--white)", fontWeight: "500", marginBottom: "4px" }}>Gulshan Kumar</p>
                <p style={{ fontSize: "11px", color: "var(--rose-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Co-Founder & COO</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a href="https://www.instagram.com/krvgulshan_2.1.2.4?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--rose)"} onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                </div>
              </div>
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
            <Link href="/about" style={{ transition: "color 0.2s" }}>About Us</Link>
            <Link href="/privacy" style={{ transition: "color 0.2s" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ transition: "color 0.2s" }}>Terms</Link>
            <Link href="/support" style={{ transition: "color 0.2s" }}>Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
