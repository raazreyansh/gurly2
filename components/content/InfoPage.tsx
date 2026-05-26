import Link from "next/link"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

type InfoSection = {
  title: string
  body: string
}

type InfoPageProps = {
  eyebrow: string
  title: string
  description: string
  sections: InfoSection[]
}

export function InfoPage({ eyebrow, title, description, sections }: InfoPageProps) {
  return (
    <>
      <Navbar />
      <main>
        <section style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "48px 0" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--rose)", marginBottom: "12px" }}>
              {eyebrow}
            </p>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "36px", fontWeight: "500", marginBottom: "12px" }}>
              {title}
            </h1>
            <p style={{ fontSize: "15px", color: "var(--muted)", lineHeight: 1.8, maxWidth: "660px" }}>
              {description}
            </p>
          </div>
        </section>

        <section className="container" style={{ maxWidth: "900px", padding: "40px 24px 80px" }}>
          <div style={{ display: "grid", gap: "18px" }}>
            {sections.map((section) => (
              <article
                key={section.title}
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "24px",
                }}
              >
                <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px", color: "var(--charcoal)" }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: "14px", color: "var(--charcoal-light)", lineHeight: 1.8 }}>
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <div style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link href="/support" className="btn btn-primary">Contact Support</Link>
            <Link href="/shop" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
