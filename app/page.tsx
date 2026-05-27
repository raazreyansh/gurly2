"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ArrowRight, Gift, ShieldCheck, Sparkles, Star, Truck, Check } from "lucide-react"
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
  { Icon: ShieldCheck, title: "Hypoallergenic Craftsmanship", copy: "Lead-free elements refined in double skin-friendly polish." },
  { Icon: Gift, title: "Signature Keepsake Wrapping", copy: "Arrives in velvet lined, gold embossed cases, ready to gift." },
  { Icon: Truck, title: "Express Sovereign Delivery", copy: "Complimentary secure courier across India for orders over ₹999." },
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
    toast.success("Joined GURLY Sovereign Ledger! ✨", {
      description: "Welcome to early private sales and exclusive rewards.",
      style: {
        background: "#041C12",
        color: "#F7F4EB",
        border: "1px solid #DFBA73",
        borderRadius: "0px"
      }
    })
  }

  return (
    <div className="storefront-shell bg-[#041C12] min-h-screen text-[#F7F4EB] font-sans selection:bg-[#DFBA73] selection:text-black">
      <Navbar />

      <main>
        {/* EMERALD ROYALIST: Exquisite Split Hero Section */}
        <section 
          className="relative min-h-[95vh] flex items-center pt-28 pb-16 px-6 md:px-12 lg:px-24 bg-[#03170F] overflow-hidden" 
          onMouseMove={handleMouseMove}
        >
          {/* Champagne Gold Radial Aura Backdrop */}
          <div className="absolute top-[-10%] right-[-10%] w-[45rem] h-[45rem] rounded-full bg-radial-glow opacity-15 filter blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(223, 186, 115, 0.12) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-radial-glow opacity-10 filter blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(223, 186, 115, 0.08) 0%, transparent 70%)" }} />

          {/* Floating animated gold dust particles */}
          <div className="hero-particles" ref={particlesRef} aria-hidden="true">
            {Array.from({ length: 20 }).map((_, index) => (
              <span 
                key={index} 
                style={{ 
                  left: `${(index * 19) % 100}%`, 
                  top: `${(index * 29) % 90}%`,
                  background: "#DFBA73",
                  width: "1.5px",
                  height: "1.5px",
                  borderRadius: "50%",
                  position: "absolute"
                }} 
              />
            ))}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center relative z-10">
            {/* Left Fine Editorial Text Column */}
            <motion.div 
              className="lg:col-span-7 flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-[#DFBA73]/10 border border-[#DFBA73]/20 text-[#DFBA73] text-[9px] font-extrabold tracking-[0.25em] uppercase mb-8">
                <Sparkles size={10} className="animate-pulse" /> EMERALD ROYALIST COLLECTION
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] text-[#F7F4EB] tracking-tight mb-8">
                Sovereign <br />
                <span className="font-sans font-light italic text-[#DFBA73]">Craft.</span>
              </h1>
              
              <p className="text-xs md:text-sm text-[#C8C5B9] max-w-lg leading-relaxed mb-10 uppercase tracking-wide">
                Indulge in classic jewelry of unmatched heritage distinction. Delicate double gold profiles, rich emerald velvet layers, and fine materials curated for absolute beauty.
              </p>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-4 mb-14 w-full sm:w-auto">
                <Link 
                  href="#showroom" 
                  className="px-8 py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-none transition-all duration-300 flex items-center gap-2"
                >
                  Enter Showcase <ArrowRight size={12} />
                </Link>
                <Link 
                  href="/shop" 
                  className="px-8 py-4 border border-[#F7F4EB]/20 hover:border-[#DFBA73] text-[#F7F4EB] hover:text-[#DFBA73] text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-none transition-all duration-300"
                >
                  View Catalog
                </Link>
              </div>

              {/* Royal Sovereign Statistics */}
              <div className="flex gap-12 border-t border-[#F7F4EB]/10 pt-10 w-full max-w-lg">
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#F7F4EB]"><CountUp end={15000} suffix="+" /></h4>
                  <p className="text-[8px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Patrons Served</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#F7F4EB]"><CountUp end={820} suffix="+" /></h4>
                  <p className="text-[8px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Exquisite Pieces</p>
                </div>
                <div>
                  <h4 className="font-serif text-3xl font-light text-[#DFBA73]">4.95 ★</h4>
                  <p className="text-[8px] text-[#A6A498] uppercase font-extrabold tracking-widest mt-2">Patron Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right Showcase Frame */}
            <motion.div 
              className="lg:col-span-5 flex justify-center items-center relative"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            >
              <div 
                className="relative w-full max-w-[370px] aspect-[4/5] bg-[#03170F] border border-[#DFBA73]/20 rounded-none p-6 shadow-2xl" 
                style={{ 
                  transform: `translate3d(${mouse.x * -1}px, ${mouse.y * -1}px, 0)`, 
                  transition: "transform 0.1s ease-out" 
                }}
              >
                {/* Double Gold Borders (Regal Heritage Design) */}
                <div className="absolute inset-2 border border-[#DFBA73]/10 pointer-events-none" />
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#DFBA73]" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#DFBA73]" />

                <div className="w-full h-full overflow-hidden relative group bg-[#02100A]">
                  <img 
                    src={heroImage} 
                    alt="GURLY Hero Masterpiece" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041C12] via-transparent to-transparent opacity-90" />
                  
                  {/* Gold Label */}
                  <div className="absolute top-4 right-4 bg-[#DFBA73] text-[#041C12] text-[8px] font-extrabold px-2.5 py-1 tracking-widest uppercase">
                    SOVEREIGN
                  </div>

                  {/* Overlay content */}
                  <div className="absolute bottom-6 left-6 right-6 text-left">
                    <span className="text-[8px] uppercase tracking-[0.25em] text-[#DFBA73] font-extrabold">Masterpiece Edition</span>
                    <h3 className="font-serif text-2xl font-light text-[#F7F4EB] mt-2 mb-1">{heroProduct?.title ?? "Aurelia Pearl Drop"}</h3>
                    <p className="text-xs font-mono text-[#DFBA73]">₹{(heroProduct?.price ?? 1499).toLocaleString("en-IN")}</p>
                    
                    {heroProduct && (
                      <Link 
                        href={`/product/${heroProduct.slug ?? heroProduct.id}`}
                        className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#DFBA73] border-b border-[#DFBA73]/30 hover:border-[#DFBA73] transition-all font-extrabold pb-0.5"
                      >
                        Acquire Piece <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TRUST BANNER - Regal Dark Glass */}
        <section className="bg-[#03170F] border-y border-[#DFBA73]/10 py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {trust.map(({ Icon, title, copy }) => (
              <div key={title} className="flex gap-5 p-6 bg-[#041C12]/50 border border-[#DFBA73]/5 rounded-none hover:border-[#DFBA73]/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-none bg-[#DFBA73]/10 flex items-center justify-center text-[#DFBA73] shrink-0 border border-[#DFBA73]/20">
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <h3 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#F7F4EB]">{title}</h3>
                  <p className="text-xs text-[#C8C5B9] leading-relaxed mt-2">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHOWCASE SECTION */}
        <section id="showroom" className="py-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[9px] font-extrabold tracking-[0.35em] text-[#DFBA73] uppercase mb-4">SOVEREIGN WORKSPACE DIAL</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#F7F4EB] mb-5 tracking-tight">The Showcase</h2>
            <div className="w-12 h-[1px] bg-[#DFBA73] mb-6" />
            <p className="text-xs text-[#C8C5B9] max-w-lg leading-relaxed uppercase tracking-wider">
              Explore dynamic designs synchronized perfectly in real-time from our secure database ledger.
            </p>

            {/* Emerald Category Filter Bar */}
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
                    toast.success(`Active filter: ${category.name}`, {
                      duration: 1000,
                      style: {
                        background: "#041C12",
                        color: "#F7F4EB",
                        border: "1px solid #DFBA73",
                        borderRadius: "0px"
                      }
                    })
                  }}
                  className={`px-6 py-2.5 text-[9px] uppercase font-extrabold tracking-[0.2em] transition-all duration-300 rounded-none border ${
                    activeCategory === category.slug
                      ? "bg-[#DFBA73] text-[#041C12] border-[#DFBA73]"
                      : "bg-[#03170F] text-[#C8C5B9] border-[#DFBA73]/10 hover:border-[#DFBA73]/30 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid */}
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
                      transition={{ duration: 0.4 }}
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
                className="text-center py-24 bg-[#03170F] border border-[#DFBA73]/15 rounded-none"
              >
                <span className="text-4xl">👑</span>
                <h3 className="font-serif text-xl font-light text-[#F7F4EB] mt-4">Showcase currently empty</h3>
                <p className="text-xs text-[#C8C5B9] max-w-sm mx-auto leading-relaxed mt-2 uppercase tracking-wide">
                  Use your newly authenticated admin panel to add luxury listings instantly.
                </p>
                <Link href="/admin/products/new" className="mt-6 inline-flex px-8 py-3.5 bg-[#DFBA73] text-[#041C12] text-[9px] uppercase font-extrabold tracking-widest hover:bg-[#F7F4EB] transition-all">
                  Create Product Listing
                </Link>
              </motion.div>
            )}
          </div>
        </section>

        {/* DESIGN MANIFESTO STATEMENT */}
        <section className="bg-[#03170F] border-y border-[#DFBA73]/10 py-28 px-6 md:px-12 lg:px-24 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[20rem] rounded-full bg-[#DFBA73] opacity-5 filter blur-[120px] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative z-10">
            <span className="text-[9px] font-extrabold tracking-[0.3em] text-[#DFBA73] uppercase mb-4">THE SOVEREIGN MANIFESTO</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light leading-tight text-[#F7F4EB] max-w-3xl mb-8">
              Exquisite ornaments crafted for <span className="italic font-normal text-[#DFBA73]">exalted lifestyle value.</span>
            </h2>
            <div className="w-12 h-[1px] bg-[#DFBA73] mb-8" />
            <p className="text-xs md:text-sm text-[#C8C5B9] leading-relaxed max-w-2xl mb-8 uppercase tracking-wider">
              We reject artificial price inflating systems. By sourcing clean-certified, hypoallergenic materials and directly dispatching from our heritage workspace, GURLY delivers classical luxury with absolute clarity.
            </p>
            <p className="text-[9px] text-[#C8C5B9] tracking-widest font-extrabold uppercase bg-[#041C12] border border-[#DFBA73]/20 px-4 py-2">
              🏆 100% HYPOALLERGENIC • CERTIFIED LEAD-FREE • LIFETIME POLISH WARRANTY
            </p>
          </div>
        </section>

        {/* NEWSLETTER CIRCLE */}
        <section className="py-28 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
          <div className="bg-[#03170F] border border-[#DFBA73]/15 rounded-none p-10 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#DFBA73]/5 filter blur-3xl pointer-events-none" />
            
            <div className="text-left lg:max-w-md">
              <span className="text-[8px] font-extrabold tracking-[0.3em] text-[#DFBA73] uppercase">THE SOVEREIGN LEDGER</span>
              <h3 className="font-serif text-3xl font-light text-[#F7F4EB] mt-3 mb-4">Join the Circle</h3>
              <p className="text-xs text-[#C8C5B9] leading-relaxed uppercase tracking-wider">
                Unlock early seasonal release journals, royal styling rewards, and private ledger collection drops.
              </p>
            </div>

            <div className="w-full lg:max-w-sm">
              {subscribed ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-3 px-6 py-5 bg-[#DFBA73]/10 text-[#DFBA73] border border-[#DFBA73]/20 rounded-none text-[10px] font-extrabold tracking-widest uppercase justify-center"
                >
                  <div className="w-5 h-5 rounded-none bg-[#DFBA73] text-[#041C12] flex items-center justify-center"><Check size={11} /></div>
                  Registered Sovereign Patron
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
                  <input
                    aria-label="Email address"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="ENTER YOUR PATRON EMAIL"
                    className="w-full px-5 py-4 bg-[#041C12] border border-[#DFBA73]/20 text-xs rounded-none text-[#F7F4EB] outline-none focus:border-[#DFBA73] transition-all font-extrabold tracking-widest placeholder-[#44524B]"
                  />
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[9px] uppercase font-extrabold tracking-[0.25em] rounded-none transition-colors duration-300"
                  >
                    Subscribe to circle
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
