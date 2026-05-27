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
    <div className="storefront-shell bg-[#0C0C0C] min-h-screen text-[#FEFDF0] font-sans selection:bg-[#FFE600] selection:text-black">
      <Navbar />

      <main>
        {/* NANO BANANA PRO: Ultra-Premium Split Hero Section */}
        <section 
          className="relative min-h-[95vh] flex items-center pt-28 pb-16 px-6 md:px-12 lg:px-24 bg-[#0A0A0A] overflow-hidden" 
          onMouseMove={handleMouseMove}
        >
          {/* Glowing Buttery Banana Radiance Backdrop */}
          <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-radial-glow opacity-25 filter blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255, 230, 0, 0.15) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-radial-glow opacity-15 filter blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255, 230, 0, 0.1) 0%, transparent 70%)" }} />

          {/* Floating animated luxury particles */}
          <div className="hero-particles" ref={particlesRef} aria-hidden="true">
            {Array.from({ length: 20 }).map((_, index) => (
              <span 
                key={index} 
                style={{ 
                  left: `${(index * 19) % 100}%`, 
                  top: `${(index * 29) % 90}%`,
                  background: "#FFE600",
                  width: "2px",
                  height: "2px",
                  borderRadius: "50%",
                  position: "absolute"
                }} 
              />
            ))}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">
            {/* Left High-End Editorial Copy Block */}
            <motion.div 
              className="lg:col-span-7 flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FFE600]/10 border border-[#FFE600]/20 text-[#FFE600] text-[10px] font-extrabold tracking-[0.2em] uppercase mb-8">
                <Sparkles size={11} className="animate-pulse" /> NANO BANANA PRO EDITION
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] text-[#FEFDF0] tracking-tight mb-8">
                Luminous <br />
                <span className="font-sans font-light italic text-[#FFE600]">Luxury.</span>
              </h1>
              
              <p className="text-sm md:text-base text-[#D4D2C5] max-w-lg leading-relaxed mb-10">
                Indulge in a new dimension of luxury accessories. Crisp minimalist silhouettes, radiant gold elements, and flawless details curated for maximum perceived style with zero compromise.
              </p>
              
              {/* Main Call to Actions */}
              <div className="flex flex-wrap gap-4 mb-14 w-full sm:w-auto">
                <Link 
                  href="#showroom" 
                  className="px-8 py-4 bg-[#FFE600] hover:bg-white text-black text-[11px] font-extrabold uppercase tracking-[0.15em] rounded-none transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[#FFE600]/10 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Enter Showroom <ArrowRight size={13} />
                </Link>
                <Link 
                  href="/shop" 
                  className="px-8 py-4 border border-[#FEFDF0]/20 hover:border-[#FFE600] text-[#FEFDF0] hover:text-[#FFE600] text-[11px] font-extrabold uppercase tracking-[0.15em] rounded-none transition-all duration-300 hover:-translate-y-0.5"
                >
                  View Catalog
                </Link>
              </div>

              {/* High Contrast Luxury Statistics */}
              <div className="flex gap-12 border-t border-[#FEFDF0]/10 pt-10 w-full max-w-lg">
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#FEFDF0]"><CountUp end={12000} suffix="+" /></h4>
                  <p className="text-[9px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Global Members</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#FEFDF0]"><CountUp end={650} suffix="+" /></h4>
                  <p className="text-[9px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Bespoke Pieces</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#FFE600]">4.9 ★</h4>
                  <p className="text-[9px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Trust Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right Interactive Product Stage Showcase */}
            <motion.div 
              className="lg:col-span-5 flex justify-center items-center relative"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.25 }}
            >
              <div 
                className="relative w-full max-w-[370px] aspect-[4/5] bg-[#161616] border border-[#FEFDF0]/5 rounded-none p-5 shadow-3xl shadow-black/80" 
                style={{ 
                  transform: `translate3d(${mouse.x * -1}px, ${mouse.y * -1}px, 0)`, 
                  transition: "transform 0.1s ease-out" 
                }}
              >
                {/* Yellow Accent Corner Tags */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#FFE600]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#FFE600]" />

                <div className="w-full h-full overflow-hidden relative group bg-[#0A0A0A]">
                  <img 
                    src={heroImage} 
                    alt="GURLY Hero Masterpiece" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95" />
                  
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 bg-[#FFE600] text-black text-[9px] font-extrabold px-2 py-1 tracking-wider uppercase">
                    LIMITED
                  </div>

                  {/* Overlay text */}
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#FFE600] font-extrabold">Nano Seeding Selection</span>
                    <h3 className="font-serif text-2xl font-light text-[#FEFDF0] mt-2 mb-1">{heroProduct?.title ?? "Aurelia Pearl Drop"}</h3>
                    <p className="text-sm font-light text-[#D4D2C5]">₹{(heroProduct?.price ?? 1499).toLocaleString("en-IN")}</p>
                    
                    {heroProduct && (
                      <Link 
                        href={`/product/${heroProduct.slug ?? heroProduct.id}`}
                        className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#FFE600] border-b border-[#FFE600]/30 hover:border-[#FFE600] transition-all font-extrabold pb-0.5"
                      >
                        Order Piece <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST VALUE PROP STRIP - Dark Premium Glass */}
        <section className="bg-[#0E0E0E] border-y border-[#FEFDF0]/5 py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {trust.map(({ Icon, title, copy }) => (
              <div key={title} className="flex gap-5 p-6 bg-[#121212]/40 border border-[#FEFDF0]/5 rounded-none hover:border-[#FFE600]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-none bg-[#FFE600]/10 flex items-center justify-center text-[#FFE600] shrink-0 border border-[#FFE600]/20">
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-extrabold tracking-[0.15em] uppercase text-[#FEFDF0]">{title}</h3>
                  <p className="text-xs text-[#A6A498] leading-relaxed mt-2">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERACTIVE DYNAMIC SHOWROOM SECTION */}
        <section id="showroom" className="py-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[10px] font-extrabold tracking-[0.3em] text-[#FFE600] uppercase mb-4">LIVE WORKSPACE SYNCHRONIZER</span>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-[#FEFDF0] mb-5 tracking-tight">The Showcase</h2>
            <div className="w-10 h-[1.5px] bg-[#FFE600] mb-6" />
            <p className="text-xs md:text-sm text-[#A6A498] max-w-lg leading-relaxed">
              Explore elegant designs fully synchronized in real-time from our database backend. No latency. Zero static lag.
            </p>

            {/* Banana Premium Categorizer */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-10 max-w-3xl">
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
                    toast.success(`Active filter: ${category.name}`, { duration: 1000 })
                  }}
                  className={`px-6 py-2.5 text-[9px] uppercase font-extrabold tracking-[0.2em] transition-all duration-300 rounded-none border ${
                    activeCategory === category.slug
                      ? "bg-[#FFE600] text-black border-[#FFE600] shadow-lg shadow-[#FFE600]/10"
                      : "bg-[#141414] text-[#D4D2C5] border-[#FEFDF0]/5 hover:border-[#FFE600]/30 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Product Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductCard key={`skeleton-${index}`} loading={true} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
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
                className="text-center py-24 bg-[#111111] border border-[#FEFDF0]/5 rounded-none"
              >
                <span className="text-4xl">💎</span>
                <h3 className="font-serif text-xl font-light text-[#FEFDF0] mt-4">Showroom currently empty</h3>
                <p className="text-xs text-[#A6A498] max-w-sm mx-auto leading-relaxed mt-2">
                  All old products have been purged. Use your newly authenticated admin panel to add luxury listings instantly.
                </p>
                <Link href="/admin/products/new" className="mt-6 inline-flex px-8 py-3.5 bg-[#FFE600] text-black text-[10px] uppercase font-extrabold tracking-widest hover:bg-white transition-all">
                  Create Product Listing
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* NANO BANANA PRO: Design Manifesto Statement */}
        <section className="bg-[#121212] border-y border-[#FEFDF0]/5 py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[20rem] rounded-full bg-[#FFE600] opacity-5 filter blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
            <span className="text-[10px] font-extrabold tracking-[0.25em] text-[#FFE600] uppercase mb-4">THE GURLY PHILOSOPHY</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-[#FEFDF0] max-w-3xl mb-8">
              Bespoke luxury accessories that deliver <span className="italic font-normal text-[#FFE600]">premium lifestyle value.</span>
            </h2>
            <div className="w-12 h-[1.5px] bg-[#FFE600] mb-8" />
            <p className="text-sm text-[#D4D2C5] leading-relaxed max-w-2xl mb-8">
              We reject astronomical markup models. By streamlining production lines and sourcing only clean-certified, hypoallergenic materials, GURLY delivers magnificent statement pieces directly from our workspace to your door.
            </p>
            <p className="text-[10px] text-[#A6A498] tracking-widest font-extrabold uppercase bg-[#181818] border border-[#FEFDF0]/5 px-4 py-2">
              🏆 100% HYPOALLERGENIC • LEAD-FREE • LIFETIME GUARENTEE
            </p>
          </div>
        </section>

        {/* HIGH-CONTRAST GLASS NEWSLETTER ENCLOSURE */}
        <section className="py-28 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <div className="bg-[#141414] border border-[#FEFDF0]/5 rounded-none p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FFE600]/5 filter blur-3xl pointer-events-none" />
            
            <div className="text-left lg:max-w-md">
              <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#FFE600] uppercase">THE PRIVATE REGISTER</span>
              <h3 className="font-serif text-3xl font-light text-[#FEFDF0] mt-3 mb-4">Join the Circle</h3>
              <p className="text-xs text-[#A6A498] leading-relaxed">
                Unlock seasonal collection releases, bespoke styling advice, and early entry to future product drops.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              {subscribed ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 px-6 py-5 bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/20 rounded-none text-xs font-extrabold tracking-wider uppercase justify-center"
                >
                  <div className="w-6 h-6 rounded-none bg-[#FFE600] text-black flex items-center justify-center"><Check size={12} /></div>
                  Registered successfully!
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2.5 w-full">
                  <input
                    aria-label="Email address"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ENTER YOUR EMAIL"
                    className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#FEFDF0]/10 text-xs rounded-none text-[#FEFDF0] outline-none focus:border-[#FFE600] transition-all font-extrabold tracking-widest placeholder-[#666]"
                  />
                  <button 
                    type="submit"
                    className="px-8 py-4 bg-[#FFE600] hover:bg-white text-black text-[10px] uppercase font-extrabold tracking-[0.2em] rounded-none transition-colors duration-300"
                  >
                    Subscribe
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
