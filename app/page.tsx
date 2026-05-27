"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ArrowRight, Gift, ShieldCheck, Sparkles, Star, Truck, Check, Eye } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { ProductCard } from "@/components/product/ProductCard"
import { getProducts } from "@/services/products"
import type { Product } from "@/types/database"
import { toast } from "sonner"

function CountUp({ end, suffix = "", duration = 1.5 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const endValue = end
    if (start === endValue) return

    const totalMiliseconds = duration * 1000
    const incrementTime = Math.max(Math.floor(totalMiliseconds / endValue), 30)
    
    const timer = setInterval(() => {
      start += Math.ceil(endValue / (totalMiliseconds / incrementTime))
      if (start >= endValue) {
        clearInterval(timer)
        setCount(endValue)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [end, duration])

  return <>{count.toLocaleString("en-IN")}{suffix}</>
}

const trust = [
  { Icon: ShieldCheck, title: "Skin Friendly Finish", copy: "Lead-free & hypoallergenic elements made for daily comfort." },
  { Icon: Gift, title: "Signature Keep Sake Wrapping", copy: "Delivered in premium luxury jewelry boxes, ready to gift." },
  { Icon: Truck, title: "Same-Day Express Dispatch", copy: "Complimentary shipping across India for orders over ₹999." },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const particlesRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let mounted = true
    getProducts()
      .then((items) => {
        if (mounted) {
          setProducts(items ?? [])
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (reduceMotion || !particlesRef.current) return
    const particles = particlesRef.current.querySelectorAll("span")
    gsap.to(particles, {
      y: "random(-22, 22)",
      x: "random(-12, 12)",
      opacity: "random(0.3, 0.8)",
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.08,
    })
  }, [reduceMotion, products])

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setMouse({
      x: (event.clientX - rect.left - rect.width / 2) / 36,
      y: (event.clientY - rect.top - rect.height / 2) / 36,
    })
  }

  // Filter products live based on selection
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "all") return true
    return product.categories?.slug?.toLowerCase() === activeCategory.toLowerCase()
  })

  const heroProduct = products.find((product) => product.featured) ?? products[0]
  const heroImage = heroProduct?.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900"

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }
    setSubscribed(true)
    toast.success("Successfully joined GURLY Private List! ✨", {
      description: "Welcome to exclusive early access and styling rewards.",
    })
  }

  return (
    <div className="storefront-shell bg-[#FAF8F5] min-h-screen text-[#111111] font-sans selection:bg-[#c9956c] selection:text-white">
      <Navbar />

      <main>
        {/* HERO SECTION: Split Screen Soft Radiance Design */}
        <section 
          className="relative min-h-[90vh] flex items-center pt-24 px-6 md:px-12 lg:px-24 bg-gradient-to-tr from-[#FAF8F5] via-[#FCFAF7] to-[#FDFBF7] overflow-hidden" 
          onMouseMove={handleMouseMove}
        >
          {/* Subtle Ambient Glow Background */}
          <div className="absolute top-1/4 right-1/4 w-[35rem] h-[35rem] rounded-full bg-radial-glow opacity-30 filter blur-[90px] pointer-events-none" />

          {/* Floating animated sparkles particles */}
          <div className="hero-particles" ref={particlesRef} aria-hidden="true">
            {Array.from({ length: 24 }).map((_, index) => (
              <span key={index} style={{ left: `${(index * 17) % 100}%`, top: `${(index * 31) % 90}%` }} className="bg-[#c9956c]" />
            ))}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            {/* Left Copy Block */}
            <motion.div 
              className="lg:col-span-7 flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#c9956c]/10 text-[#c9956c] text-[11px] font-bold tracking-widest uppercase mb-6">
                <Sparkles size={12} /> Curated Luxury Accessories
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-normal leading-[1.1] text-[#111111] mb-6">
                Sophisticated Sparkle. <br />
                <span className="italic text-[#c9956c]">Designed for You.</span>
              </h1>
              <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed mb-8">
                Indulge in a premium jewelry-store experience. Delicate studs, light-catching hoops, and luxury gift sets crafted to elevate your daily style with high perceived value.
              </p>
              
              {/* Main Call to Actions */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link 
                  href="#collection" 
                  className="px-8 py-3.5 bg-[#111111] hover:bg-[#c9956c] text-white text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/5 hover:-translate-y-0.5"
                >
                  Explore Collection <ArrowRight size={14} />
                </Link>
                <Link 
                  href="/shop" 
                  className="px-8 py-3.5 border border-[#111111]/25 hover:border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-widest rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  View All Pieces
                </Link>
              </div>

              {/* Verified Trust Stats */}
              <div className="flex gap-8 border-t border-[#111111]/10 pt-8 w-full max-w-md">
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-[#111111]"><CountUp end={12000} suffix="+" /></h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Happy Customers</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-[#111111]"><CountUp end={650} suffix="+" /></h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Unique Styles</p>
                </div>
                <div>
                  <h4 className="font-serif text-2xl font-semibold text-[#c9956c]">4.9 ★</h4>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Rating Average</p>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Product Stage Showcase */}
            <motion.div 
              className="lg:col-span-5 flex justify-center items-center relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-full max-w-[360px] aspect-[4/5] bg-white border border-[#111111]/5 rounded-sm p-4 shadow-2xl shadow-black/5" style={{ transform: `translate3d(${mouse.x * -1}px, ${mouse.y * -1}px, 0)`, transition: "transform 0.1s ease-out" }}>
                <div className="w-full h-full overflow-hidden relative group">
                  <img 
                    src={heroImage} 
                    alt="GURLY Hero Jewelry Piece" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90 transition-opacity" />
                  
                  {/* Overlay text */}
                  <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                    <span className="text-[9px] uppercase tracking-widest text-[#e3d2be] font-bold">Featured Masterpiece</span>
                    <h3 className="font-serif text-lg font-medium mt-1 mb-0.5">{heroProduct?.title ?? "Polished Hoop Earrings"}</h3>
                    <p className="text-xs font-semibold text-white/90">₹{(heroProduct?.price ?? 899).toLocaleString("en-IN")}</p>
                    {heroProduct && (
                      <Link 
                        href={`/product/${heroProduct.slug ?? heroProduct.id}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white border-b border-white/50 hover:border-white transition-all font-bold"
                      >
                        Buy Now <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST VALUE PROP STRIP */}
        <section className="bg-white border-y border-[#111111]/5 py-12 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {trust.map(({ Icon, title, copy }) => (
              <div key={title} className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4 hover:bg-[#FAF8F5]/50 transition-colors duration-300 rounded-sm">
                <div className="w-10 h-10 rounded-full bg-[#c9956c]/10 flex items-center justify-center text-[#c9956c] shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-[#111111]">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1.5">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE DYNAMIC CATALOG SECTION */}
        <section id="collection" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#c9956c] uppercase mb-3">Live Showroom</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-normal text-[#111111] mb-4">Explore the Collection</h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-lg leading-relaxed">
              Instantly view and filter handcrafted designs freshly synced from our workspace and Supabase database.
            </p>

            {/* Premium Pill Categorizer */}
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
              {[
                { name: "All Pieces", slug: "all" },
                { name: "Earrings", slug: "earrings" },
                { name: "Necklaces", slug: "necklaces" },
                { name: "Bracelets", slug: "bracelets" },
                { name: "Rings", slug: "rings" },
                { name: "Accessories", slug: "accessories" },
              ].map((category) => (
                <button
                  key={category.slug}
                  onClick={() => {
                    setActiveCategory(category.slug)
                    toast.info(`Filtering catalog: ${category.name}`, { duration: 1000 })
                  }}
                  className={`px-5 py-2 text-[10px] uppercase font-bold tracking-widest transition-all duration-300 rounded-full border ${
                    activeCategory === category.slug
                      ? "bg-[#111111] text-white border-[#111111] shadow-lg shadow-black/5"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Animated Product Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCard key={`skeleton-${index}`} loading={true} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                      key={product.id}
                      className="w-full"
                    >
                      <ProductCard product={product} priority={index < 4} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white border border-[#111111]/5 rounded-sm"
              >
                <span className="text-3xl">✨</span>
                <h3 className="font-serif text-lg font-medium text-[#111111] mt-3">No products available yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed mt-1">
                  We are currently restocking our catalog. Log in to the admin panel to publish new items immediately!
                </p>
                <Link href="/admin/products/new" className="mt-4 inline-flex px-6 py-2.5 bg-[#111111] text-white text-[10px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#c9956c] transition-all">
                  Create Product Listing
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* BRAND STATEMENT & DESIGN MANIFESTO */}
        <section className="bg-white border-y border-[#111111]/5 py-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#c9956c] uppercase mb-4">Design Philosophy</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight text-[#111111] max-w-2xl mb-8">
              Small accessories that deliver <span className="italic text-[#c9956c]">high perceived luxury.</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#c9956c] mb-8" />
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mb-6">
              Our curated boutique stands for pure aesthetic excellence. By decoupling heavy pricing models from state-of-the-art designs, GURLY offers you stunning earrings, rings, and accessories at standard-setting prices without sacrificing quality.
            </p>
            <p className="text-xs text-gray-400 italic">
              All metals used are fully hypoallergenic, nickel-free, and packaged under certified clean standards.
            </p>
          </div>
        </section>

        {/* ELEGANT GLASS NEWSLETTER SIGNUP */}
        <section className="py-24 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <div className="bg-white border border-[#111111]/5 rounded-sm p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-black/[0.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#c9956c]/5 filter blur-3xl pointer-events-none" />
            
            <div className="text-left md:max-w-md">
              <span className="text-[10px] font-extrabold tracking-widest text-[#c9956c] uppercase">Members Club</span>
              <h3 className="font-serif text-2xl font-normal text-[#111111] mt-2 mb-3">Join the Early Access List</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Be the first to receive notifications of new category drops, private discounts, and upcoming collection previews.
              </p>
            </div>

            <div className="w-full md:max-w-sm">
              {subscribed ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 px-6 py-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-sm text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check size={12} /></div>
                  Welcome! Watch your inbox for styling rewards.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                  <input
                    aria-label="Email address"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-gray-200 text-xs rounded-sm outline-none focus:border-[#111111] transition-all"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#111111] hover:bg-[#c9956c] text-white text-[10px] uppercase font-bold tracking-widest rounded-sm transition-colors duration-300"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
