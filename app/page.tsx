"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/product/ProductCard"
import { getProducts } from "@/services/products"
import type { Product } from "@/types/database"

const CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "Earrings", slug: "earrings" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Rings", slug: "rings" },
  { name: "Accessories", slug: "accessories" },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [active, setActive] = useState("all")
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    let mounted = true
    getProducts()
      .then((items) => { if (mounted) { setProducts(items ?? []); setIsLoading(false) } })
      .catch(() => { if (mounted) setIsLoading(false) })
    return () => { mounted = false }
  }, [])

  const hero = products.find((p) => p.featured) ?? products[0]
  const heroImage = hero?.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1600&q=90"

  const filtered = products.filter((p) => {
    if (active === "all") return true
    return p.categories?.slug?.toLowerCase() === active
  })

  return (
    <div className="bg-white min-h-screen text-black font-sans">
      <Navbar />

      <main className="pt-14">
        {/* ─── HERO: Full-bleed image, zero text articles ─── */}
        <section className="relative w-full h-[90vh] overflow-hidden">
          <img
            src={heroImage}
            alt="GURLY"
            className="w-full h-full object-cover object-center"
          />
          {/* Minimal wordmark overlay */}
          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 md:p-14 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none">
            <div className="pointer-events-auto">
              {hero && (
                <Link
                  href={`/product/${hero.slug ?? hero.id}`}
                  className="inline-flex items-center gap-3 bg-white text-black text-[10px] font-black uppercase tracking-widest px-5 py-3 hover:bg-black hover:text-white transition-colors"
                >
                  {hero.title} — ₹{hero.price.toLocaleString("en-IN")} →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ─── CATEGORY PILLS ─── */}
        <div className="border-b border-[#E8E8E8] overflow-x-auto">
          <div className="flex items-center gap-0 max-w-[1400px] mx-auto px-6 md:px-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActive(cat.slug)}
                className={`shrink-0 px-5 py-3.5 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${
                  active === cat.slug
                    ? "border-black text-black"
                    : "border-transparent text-black/40 hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ─── PRODUCT GRID ─── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCard key={`sk-${i}`} loading />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={p} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="py-32 text-center">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/30">Nothing here yet</p>
              <Link href="/admin/products/new" className="mt-6 inline-block bg-black text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-colors">
                Add Products
              </Link>
            </div>
          )}
        </section>

        {/* ─── NEWSLETTER: Bare single-line, no text articles ─── */}
        <section className="border-t border-[#E8E8E8] py-10 px-6 md:px-10">
          <div className="max-w-[480px] mx-auto text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4">
              New drops. Members first.
            </p>
            {subscribed ? (
              <p className="text-[11px] font-black uppercase tracking-widest text-black">You're in ✓</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.includes("@")) setSubscribed(true)
                }}
                className="flex"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 border border-black/20 px-4 py-3 text-xs outline-none focus:border-black transition-colors bg-transparent placeholder-black/30"
                />
                <button
                  type="submit"
                  className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-5 hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
