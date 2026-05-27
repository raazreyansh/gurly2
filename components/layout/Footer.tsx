"use client"

import Link from "next/link"
import { Globe, MessageCircle, Mail } from "lucide-react"

const brandLinks = [
  { href: "/about", label: "About GURLY", Icon: Globe },
  { href: "/support", label: "Support", Icon: MessageCircle },
  { href: "mailto:support@gurly.in", label: "Email support", Icon: Mail },
]

const shopLinks = [
  { href: "/shop?category=new-arrivals", label: "New Arrivals" },
  { href: "/shop?category=earrings", label: "Earrings" },
  { href: "/shop?category=necklaces", label: "Necklaces" },
  { href: "/shop?category=bracelets", label: "Bracelets" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop", label: "Sale" },
]

const accountLinks = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Orders" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/support", label: "Returns" },
  { href: "/account/orders", label: "Track Order" },
]

export function Footer() {
  return (
    <footer className="bg-[#03170F] text-[#F7F4EB] border-t border-[#DFBA73]/15 py-20 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 text-left">
          {/* Brand Column */}
          <div className="space-y-5 lg:col-span-1">
            <h2 className="font-serif text-3xl font-light tracking-[0.15em] text-[#F7F4EB]">
              GURLY<span className="text-[#DFBA73]">.</span>
            </h2>
            <p className="text-[10px] uppercase tracking-wider text-[#C8C5B9] leading-relaxed">
              Premium jewelry and sovereign ornaments curated for modern patrons. Own your spark.
            </p>
            <div className="flex gap-3">
              {brandLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 border border-[#DFBA73]/10 hover:border-[#DFBA73] hover:text-[#DFBA73] flex items-center justify-center transition-colors"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase">Shop</h3>
            <div className="flex flex-col gap-2.5 text-xs text-[#C8C5B9]">
              {shopLinks.map(({ href, label }) => (
                <Link key={label} href={href} className="hover:text-white transition-colors uppercase tracking-widest font-bold">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account Column */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase">Account</h3>
            <div className="flex flex-col gap-2.5 text-xs text-[#C8C5B9]">
              {accountLinks.map(({ href, label }) => (
                <Link key={label} href={href} className="hover:text-white transition-colors uppercase tracking-widest font-bold">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Founders Column */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase">Founders</h3>
            <div className="space-y-4">
              <div className="bg-[#041C12] border border-[#DFBA73]/10 p-4 rounded-none text-left">
                <p className="text-xs font-extrabold text-[#F7F4EB] uppercase tracking-wider">Satyam Kumar</p>
                <p className="text-[9px] text-[#C8C5B9] mt-0.5 font-bold uppercase tracking-widest text-[#DFBA73]">Founder & CEO</p>
                <div className="flex gap-3 mt-2.5">
                  <a href="https://www.instagram.com/itss.satyaa/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#C8C5B9] hover:text-[#DFBA73] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                  <a href="https://linkedin.com/in/satyaaaa" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#C8C5B9] hover:text-[#DFBA73] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <a href="https://github.com/raazreyansh" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-[#C8C5B9] hover:text-[#DFBA73] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </a>
                </div>
              </div>
              <div className="bg-[#041C12] border border-[#DFBA73]/10 p-4 rounded-none text-left">
                <p className="text-xs font-extrabold text-[#F7F4EB] uppercase tracking-wider">Gulshan Kumar</p>
                <p className="text-[9px] text-[#C8C5B9] mt-0.5 font-bold uppercase tracking-widest text-[#DFBA73]">Co-Founder & COO</p>
                <div className="flex gap-3 mt-2.5">
                  <a href="https://www.instagram.com/krvgulshan_2.1.2.4?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#C8C5B9] hover:text-[#DFBA73] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase">Stay In Touch</h3>
            <p className="text-xs text-[#C8C5B9] leading-relaxed uppercase tracking-wider font-bold">
              Join our sovereign collection drops & private luxury rewards ledger.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem("email") as HTMLInputElement).value
                await fetch("/api/newsletter", { method: "POST", body: JSON.stringify({ email }) })
                form.reset()
              }}
              className="flex flex-col gap-2.5"
            >
              <input
                name="email"
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                required
                className="w-full bg-[#041C12] border border-[#DFBA73]/20 text-xs font-extrabold uppercase tracking-widest px-4 py-3 text-[#F7F4EB] outline-none focus:border-[#DFBA73] rounded-none placeholder-[#44524B]"
              />
              <button type="submit" className="w-full py-3 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[9px] uppercase font-extrabold tracking-widest transition-colors duration-300 rounded-none">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#DFBA73]/15 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-extrabold tracking-widest text-[#C8C5B9] uppercase">
          <p>© 2026 GURLY. Crafted for distinction.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/support" className="hover:text-white transition-colors">Customer Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
