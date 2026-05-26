import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/home/Hero"
import { Categories } from "@/components/home/Categories"
import { FeaturedProducts } from "@/components/home/FeaturedProducts"
import { Suspense } from "react"
import { ArrowRight, Truck, RefreshCw, Shield, Headphones } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <Suspense fallback={
          <section className="section">
            <div className="container">
              <div className="product-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ aspectRatio: "3/4", borderRadius: "4px" }} />
                ))}
              </div>
            </div>
          </section>
        }>
          <FeaturedProducts />
        </Suspense>

        {/* Trust Banner */}
        <section style={{ background: "var(--white)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
          <div className="container">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "32px",
            }}>
              {[
                { Icon: Truck, title: "Free Shipping", desc: "On orders above ₹999" },
                { Icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free returns" },
                { Icon: Shield, title: "Secure Payment", desc: "100% secure checkout" },
                { Icon: Headphones, title: "24/7 Support", desc: "We're here to help" },
              ].map(({ Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--cream)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color="var(--rose)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--charcoal)" }}>{title}</p>
                    <p style={{ fontSize: "12px", color: "var(--muted)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marquee Banner */}
        <div style={{
          background: "var(--charcoal)",
          padding: "14px 0",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}>
          <div style={{
            display: "inline-flex",
            gap: "48px",
            animation: "marquee 20s linear infinite",
          }}>
            {Array(6).fill("✦ New Collection ✦ Free Shipping Over ₹999 ✦ Use code WELCOME10 for 10% off ✦ Premium Accessories").map((t, i) => (
              <span key={i} style={{ fontSize: "12px", letterSpacing: "0.1em", color: "var(--rose-light)", textTransform: "uppercase", fontWeight: "500" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <section className="section" style={{ background: "var(--cream-dark)", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: "600px" }}>
            <p className="section-subtitle">Limited Edition</p>
            <h2 className="section-title" style={{ marginBottom: "20px" }}>New Arrivals Every Week</h2>
            <p style={{ fontSize: "15px", color: "var(--charcoal-light)", marginBottom: "32px", lineHeight: "1.7" }}>
              Subscribe to be the first to know about new collections, exclusive drops, and special offers.
            </p>
            <Link href="/shop" className="btn btn-primary" style={{ gap: "10px" }}>
              Shop New Arrivals <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
