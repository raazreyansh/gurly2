import Link from "next/link"

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=new-arrivals", label: "Gift Sets" },
]

const helpLinks = [
  { href: "/support", label: "Contact Us" },
  { href: "/support", label: "Shipping & Delivery" },
  { href: "/account/orders", label: "Track Order" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/wishlist", label: "Wishlist" },
]

const aboutLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/support", label: "Returns & Exchange" },
]

export function Footer() {
  return (
    <footer className="luxury-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-brand-title">
              GURLY
            </Link>
            <p className="footer-brand-text">Premium accessories for girls who love to shine beautifully.</p>
            <div className="footer-social-links" aria-label="Social links">
              <a className="footer-social-icon" href="https://instagram.com" target="_blank" rel="noreferrer">IG</a>
              <a className="footer-social-icon" href="https://pinterest.com" target="_blank" rel="noreferrer">PT</a>
              <a className="footer-social-icon" href="https://facebook.com" target="_blank" rel="noreferrer">FB</a>
            </div>
          </div>

          <div>
            <h3 className="footer-section-title">Shop</h3>
            <div className="footer-link-col">
              {shopLinks.map(({ href, label }) => (
                <Link key={`${label}-${href}`} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="footer-section-title">Customer Care</h3>
            <div className="footer-link-col">
              {helpLinks.map(({ href, label }) => (
                <Link key={`${label}-${href}`} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="footer-section-title">About GURLY</h3>
            <div className="footer-link-col">
              {aboutLinks.map(({ href, label }) => (
                <Link key={`${label}-${href}`} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>© 2026 GURLY. All rights reserved.</span>
          <div className="footer-bottom-links" aria-label="Secure payments">
            <span>VISA</span>
            <span>MC</span>
            <span>UPI</span>
            <span>RuPay</span>
            <span>LPI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
