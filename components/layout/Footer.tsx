"use client"

import Link from "next/link"
import { Globe, MessageCircle, Mail } from "lucide-react"

const brandLinks = [
  { href: "/about", label: "About GURLY", Icon: Globe },
  { href: "/support", label: "Support", Icon: MessageCircle },
  { href: "mailto:support@gurly.in", label: "Email support", Icon: Mail },
]

const shopLinks = [
  { href: "/shop?category=new-arrivals", label: "New Arrivals" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop", label: "Sale" },
]

const accountLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/support", label: "Returns" },
  { href: "/account/orders", label: "Track Order" },
]

export function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <h2 className="footer-brand-title">GURLY</h2>
            <p className="footer-brand-text">
              Premium jewelry and accessories curated for the modern woman. Own your spark.
            </p>
            <div className="footer-social-links">
              {brandLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="footer-social-icon"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="footer-section-title">Shop</h3>
            <div className="footer-link-col">
              {shopLinks.map(({ href, label }) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account Column */}
          <div>
            <h3 className="footer-section-title">Account</h3>
            <div className="footer-link-col">
              {accountLinks.map(({ href, label }) => (
                <Link key={label} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Founders Column */}
          <div>
            <h3 className="footer-section-title">Founders</h3>
            <div className="space-y-4">
              <div className="footer-founder-card">
                <p className="footer-founder-name">Satyam Kumar</p>
                <p className="footer-founder-title">Founder & CEO</p>
                <div className="footer-founder-socials">
                  <a href="https://www.instagram.com/itss.satyaa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/satyaaaa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="https://github.com/raazreyansh" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                </div>
              </div>
              <div className="footer-founder-card">
                <p className="footer-founder-name">Gulshan Kumar</p>
                <p className="footer-founder-title">Co-Founder & COO</p>
                <div className="footer-founder-socials">
                  <a href="https://www.instagram.com/krvgulshan_2.1.2.4?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="footer-section-title">Stay in the loop</h3>
            <p className="footer-brand-text mb-4">Get new luxury arrivals & private sales delivered to your inbox.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem("email") as HTMLInputElement).value
                await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })
                form.reset()
              }}
              className="flex gap-2"
            >
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="footer-newsletter-input"
              />
              <button type="submit" className="store-button store-button-dark" style={{ minHeight: "44px" }}>
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© 2026 GURLY. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/about">About Us</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/support">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
