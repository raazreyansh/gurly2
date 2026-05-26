import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { CheckCircle2, Package, ArrowRight } from "lucide-react"

export const metadata = { title: "Order Placed!" }

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "60px 24px", maxWidth: "480px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "#E8F5E9", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 24px",
          }}>
            <CheckCircle2 size={40} color="#2E7D32" />
          </div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: "500", marginBottom: "12px" }}>
            Order Placed!
          </h1>
          <p style={{ fontSize: "15px", color: "var(--charcoal-light)", lineHeight: "1.7", marginBottom: "32px" }}>
            Thank you for shopping with GURLY. You&apos;ll receive a confirmation email shortly with your order details.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/account/orders" className="btn btn-primary" style={{ gap: "8px" }}>
              <Package size={15} /> Track Orders
            </Link>
            <Link href="/shop" className="btn btn-outline" style={{ gap: "8px" }}>
              Continue Shopping <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
