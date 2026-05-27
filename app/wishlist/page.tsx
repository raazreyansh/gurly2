import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"

export const metadata = { 
  title: "My Wishlist",
  description: "View your saved luxury earrings, necklaces, bracelets and premium GURLY jewelry items."
}

export default function WishlistPage() {
  return (
    <div className="storefront-shell bg-[#041C12] text-[#F7F4EB] flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Luxury Header */}
        <div className="py-16 bg-[#03170F] border-b border-[#DFBA73]/15">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-left">
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-2">SAVED PIECES</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#F7F4EB]">Wishlist</h1>
          </div>
        </div>

        {/* Empty state container */}
        <div className="max-w-7xl mx-auto py-24 px-6 md:px-12 flex items-center justify-center">
          <div className="bg-[#03170F] border border-[#DFBA73]/15 max-w-lg w-full text-center p-16 rounded-none">
            <div className="w-16 h-16 bg-[#DFBA73]/10 rounded-none flex items-center justify-center mx-auto mb-8">
              <Heart size={24} className="text-[#DFBA73]" />
            </div>
            
            <h2 className="font-serif text-3xl font-light mb-4">Your wishlist is empty</h2>
            <p className="text-xs text-[#C8C5B9] leading-relaxed uppercase tracking-wider mb-10 max-w-xs mx-auto">
              Save premium pieces you love during your discovery to view or buy them later.
            </p>
            
            <Link href="/shop" className="px-8 py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-[0.2em] transition-colors duration-300 rounded-none inline-flex items-center justify-center gap-2">
              <ShoppingBag size={13} /> BROWSE PRODUCTS
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
