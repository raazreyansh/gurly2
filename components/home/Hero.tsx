"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - var(--nav-h))",
        background: "linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 50%, #EDD5C0 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,149,108,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,149,108,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "680px" }}>
          <span className="tag animate-fade-up" style={{ marginBottom: "24px", display: "inline-block" }}>
            ✦ New Collection 2025
          </span>

          <h1 className="animate-fade-up delay-1" style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: "500",
            lineHeight: "1.08",
            color: "var(--charcoal)",
            marginBottom: "24px",
          }}>
            Own Your{" "}
            <span style={{
              fontStyle: "italic",
              color: "var(--rose)",
            }}>
              Spark
            </span>
          </h1>

          <p className="animate-fade-up delay-2" style={{
            fontSize: "17px",
            lineHeight: "1.7",
            color: "var(--charcoal-light)",
            maxWidth: "480px",
            marginBottom: "40px",
          }}>
            Premium earrings, necklaces and accessories crafted for the woman who knows what she wants. Soft luxury, every day.
          </p>

          <div className="animate-fade-up delay-3" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/shop" className="btn btn-primary pulse-btn" id="hero-shop-btn" style={{ gap: "10px" }}>
              Shop the Collection
              <ArrowRight size={16} />
            </Link>
            <Link href="/shop?category=earrings" className="btn btn-outline" id="hero-earrings-btn">
              Explore Earrings
            </Link>
          </div>

          {/* Social Proof */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
            marginTop: "56px",
            flexWrap: "wrap",
          }}>
            {[
              { value: "10k+", label: "Happy customers" },
              { value: "500+", label: "Unique pieces" },
              { value: "4.9★", label: "Average rating" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "var(--charcoal)",
                }}>
                  {value}
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.04em" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
