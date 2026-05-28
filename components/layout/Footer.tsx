import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 text-black py-20 px-8 lg:px-20">
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        
        {/* Brand statement */}
        <div className="space-y-6">
          <Link href="/" className="font-serif text-3xl tracking-wider font-semibold">
            GURLY.
          </Link>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
            GURLY was founded with a singular, elegant vision: to curate modern, premium fashion accessories that bring out your innate brilliance. Every piece in our collection is chosen with deliberate care to ensure it embodies timeless charm and premium quality.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h3 className="text-xs tracking-[0.2em] font-semibold text-neutral-400 uppercase">Shop</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/shop" className="text-neutral-600 hover:text-black transition">All Collections</Link></li>
            <li><Link href="/shop" className="text-neutral-600 hover:text-black transition">New Arrivals</Link></li>
            <li><Link href="/shop" className="text-neutral-600 hover:text-black transition">Bestsellers</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-xs tracking-[0.2em] font-semibold text-neutral-400 uppercase">Information</h3>
          <ul className="space-y-2 text-xs">
            <li><Link href="/about" className="text-neutral-600 hover:text-black transition">About Our House</Link></li>
            <li><Link href="/privacy" className="text-neutral-600 hover:text-black transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-neutral-600 hover:text-black transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-4">
          <h3 className="text-xs tracking-[0.2em] font-semibold text-neutral-400 uppercase">Customer Care</h3>
          <ul className="space-y-2 text-xs text-neutral-600">
            <li>Email: care@gurly.com</li>
            <li>Hours: Mon - Fri | 10AM - 6PM</li>
          </ul>
        </div>

      </div>

      {/* Founders & Socials section */}
      <div className="mx-auto max-w-[1600px] border-t border-neutral-200 mt-16 pt-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between text-black">
          <div>
            <p className="text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
              FOUNDERS
            </p>
            <div className="mt-4 space-y-2 text-xs font-semibold uppercase tracking-wider text-neutral-600">
              <p>Satyam Kumar — Founder</p>
              <p>Gulshan Kumar — Co-Founder</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-[10px] font-bold tracking-[0.25em] uppercase text-neutral-500">
            <a
              href="https://www.instagram.com/itss.satyaa/?hl=en"
              target="_blank"
              className="hover:text-black transition"
            >
              INSTAGRAM
            </a>
            <a
              href="https://github.com/raazreyansh"
              target="_blank"
              className="hover:text-black transition"
            >
              GITHUB
            </a>
            <a
              href="https://www.linkedin.com/in/satyaaaa"
              target="_blank"
              className="hover:text-black transition"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] border-t border-neutral-200 mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-neutral-400 font-semibold tracking-widest uppercase">
        <p>© {new Date().getFullYear()} GURLY. All rights reserved.</p>
        <p className="mt-4 sm:mt-0">Crafted with deliberate care</p>
      </div>
    </footer>
  )
}
