import Link from "next/link"

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=accessories", label: "Accessories" },
]

const helpLinks = [
  { href: "/support", label: "Help" },
  { href: "/support", label: "Returns" },
  { href: "/account/orders", label: "Track Order" },
  { href: "/privacy", label: "Privacy" },
]

export function Footer() {
  return (
    <footer className="border-t border-[#E8E8E8] bg-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="font-sans text-xs font-black tracking-[0.18em] uppercase text-black shrink-0">
          GURLY
        </Link>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {[...shopLinks, ...helpLinks].map(({ href, label }) => (
            <Link key={`${label}-${href}`} href={href} className="text-[11px] font-medium text-black/50 hover:text-black transition-colors uppercase tracking-wide">
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-[10px] text-black/30 font-medium uppercase tracking-wider shrink-0">
          © 2026 GURLY
        </p>
      </div>
    </footer>
  )
}
