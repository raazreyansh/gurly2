import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"

export const metadata = { title: "Wishlist" }

export default function WishlistPage() {
  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
          <div className="container">
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Wishlist</h1>
          </div>
        </div>
        <div className="container" style={{ padding: "80px 24px", textAlign: "center" }}>
          <Heart size={48} style={{ margin: "0 auto 20px", opacity: 0.15 }} />
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "12px" }}>Your wishlist is empty</h2>
          <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "15px" }}>Save pieces you love to buy later.</p>
          <Link href="/shop" className="btn btn-primary" style={{ gap: "8px" }}>
            <ShoppingBag size={15} /> Browse Products
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
