import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Heart } from "lucide-react"

export const metadata = {
  title: "Wishlist",
  description: "Your saved GURLY jewelry pieces.",
}

export default function WishlistPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-14">
        <div className="border-b border-[#E8E8E8]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-6">
            <h1 className="text-xl font-black uppercase tracking-tight">Wishlist</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="text-center">
            <Heart size={28} className="mx-auto mb-6 text-black/20" />
            <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-8">Nothing saved yet</p>
            <Link
              href="/shop"
              className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
