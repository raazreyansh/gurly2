import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-100 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
        
        <div className="lg:col-span-1">
          <Link href="/" className="font-serif text-3xl tracking-widest text-black">
            GURLY
          </Link>
          <p className="mt-6 text-sm text-neutral-500 leading-relaxed max-w-xs">
            Premium accessories and contemporary jewelry crafted for modern feminine expression.
          </p>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-black mb-6">Shop</h3>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link href="/shop" className="hover:text-black transition">All Products</Link></li>
            <li><Link href="/shop?category=earrings" className="hover:text-black transition">Earrings</Link></li>
            <li><Link href="/shop?category=necklaces" className="hover:text-black transition">Necklaces</Link></li>
            <li><Link href="/shop?category=bracelets" className="hover:text-black transition">Bracelets</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-black mb-6">Support</h3>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li><Link href="/contact" className="hover:text-black transition">Contact Us</Link></li>
            <li><Link href="/shipping" className="hover:text-black transition">Shipping & Returns</Link></li>
            <li><Link href="/faq" className="hover:text-black transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] uppercase tracking-[0.15em] font-semibold text-black mb-6">Newsletter</h3>
          <p className="text-sm text-neutral-500 mb-4">Join for exclusive drops and private sales.</p>
          <div className="flex border-b border-black pb-2">
            <input type="email" placeholder="Email address" className="w-full text-sm outline-none placeholder-neutral-400" />
            <button className="text-[11px] uppercase tracking-[0.1em] font-semibold text-black whitespace-nowrap">Subscribe</button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400">
        <p>&copy; {new Date().getFullYear()} GURLY. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
