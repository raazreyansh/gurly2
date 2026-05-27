"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import gsap from "gsap"
import { ArrowRight, Gift, Search, ShieldCheck, Star, Truck } from "lucide-react"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { ProductCard } from "@/components/product/ProductCard"
import { getProducts } from "@/services/products"
import type { Product } from "@/types/database"

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

function DecimalCountUp({ end, suffix = "", duration = 1.2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0.0)

  useEffect(() => {
    let start = 0.0
    const endValue = end
    const totalMiliseconds = duration * 1000
    const incrementTime = 40
    const steps = totalMiliseconds / incrementTime
    const stepValue = endValue / steps

    const timer = setInterval(() => {
      start += stepValue
      if (start >= endValue) {
        clearInterval(timer)
        setCount(endValue)
      } else {
        setCount(Number(start.toFixed(1)))
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [end, duration])

  return <>{count.toFixed(1)}{suffix}</>
}

const storeRooms = [
  {
    id: "category-earrings",
    title: "Dream Earrings",
    href: "/shop?category=earrings",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900",
    copy: "Pearl hoops, crystal drops, and light-catching studs for everyday shine.",
  },
  {
    id: "category-bracelets",
    title: "Everyday Glow",
    href: "/shop?category=bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900",
    copy: "Bracelets and hair accessories that bring soft sparkle into daily looks.",
  },
  {
    id: "category-necklaces",
    title: "Luxury Collection",
    href: "/shop?category=necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900",
    copy: "Layered chains and delicate pendants designed for premium gifting.",
  },
  {
    id: "category-gifts",
    title: "Gift Studio",
    href: "/shop?category=new-arrivals",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900",
    copy: "Curated accessory sets wrapped for birthdays, bridesmaids, and celebrations.",
  },
]

const community = [
  {
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700",
    caption: "Pearl drops for every brunch plan.",
    name: "Aanya",
  },
  {
    image: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=700",
    caption: "Gift-ready sparkle, styled in seconds.",
    name: "Mira",
  },
  {
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=700",
    caption: "Bracelets stacked for a clean evening glow.",
    name: "Riya",
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700",
    caption: "Hair accessories with a premium finish.",
    name: "Isha",
  },
]

const trust = [
  { Icon: ShieldCheck, title: "Skin friendly", copy: "Lead-free finishes and smooth everyday wear." },
  { Icon: Gift, title: "Gift ready", copy: "Packed with premium wrapping and a soft keepsake feel." },
  { Icon: Truck, title: "Fast dispatch", copy: "Free shipping over Rs. 999 on accessory orders." },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const particlesRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let mounted = true
    getProducts({ limit: 8 })
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
      y: "random(-18, 18)",
      x: "random(-10, 10)",
      opacity: "random(0.25, 0.75)",
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.08,
    })
  }, [reduceMotion])

  const trendingProducts = products.slice(0, 8)
  const bestsellers = products.slice(0, 6)
  const heroProduct = products.find((product) => product.categories?.slug === "earrings") ?? products[0]
  const heroImage = heroProduct?.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=900"

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    setMouse({
      x: (event.clientX - rect.left - rect.width / 2) / 32,
      y: (event.clientY - rect.top - rect.height / 2) / 32,
    })
  }

  // Orchestrated motion transitions for premium entrance feel
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  } as const

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  } as const

  return (
    <div className="storefront-shell">
      <Navbar />

      <main>
        <section className="luxury-hero" onMouseMove={handleMouseMove} style={{ overflow: "hidden" }}>
          <div className="hero-particles" ref={particlesRef} aria-hidden="true">
            {Array.from({ length: 28 }).map((_, index) => (
              <span key={index} style={{ left: `${(index * 13) % 100}%`, top: `${(index * 29) % 92}%` }} />
            ))}
          </div>

          <motion.div 
            className="hero-copy" 
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={childVariants} style={{ display: "inline-block" }}>
              Own Your Spark
            </motion.h1>
            <motion.p variants={childVariants}>
              Premium accessories designed to shine every day.
            </motion.p>
            <motion.div className="hero-actions" variants={childVariants}>
              <Link href="/shop?category=earrings" id="hero-shop-btn" className="store-button store-button-dark liquid-shine">
                Shop Earrings <ArrowRight size={16} />
              </Link>
              <Link href="/shop" id="hero-explore-btn" className="store-button store-button-light">
                Explore Collection
              </Link>
            </motion.div>
            
            <motion.div className="hero-counters" aria-label="Store highlights" variants={childVariants}>
              <div className="counter-pill">
                <strong><CountUp end={10000} suffix="+" /></strong>
                <span>Customers</span>
              </div>
              <div className="counter-pill">
                <strong><CountUp end={500} suffix="+" /></strong>
                <span>Pieces</span>
              </div>
              <div className="counter-pill">
                <strong><DecimalCountUp end={4.9} /></strong>
                <span>Rating ★</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-product-stage"
            style={{ transform: `translate3d(${mouse.x * -1}px, ${mouse.y * -1}px, 0)` }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
          >
            <div className="hero-product-glow" />
            <Link href={`/product/${heroProduct?.slug ?? heroProduct?.id}`} className="block">
              <motion.div 
                className="floating-earrings cursor-pointer hover:border-rose-light" 
                animate={reduceMotion ? undefined : { y: [0, -18, 0] }} 
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.03 }}
              >
                <img src={heroImage} alt="Floating earrings hero product" loading="eager" />
                <div>
                  <span>Hero piece</span>
                  <strong>{heroProduct?.title ?? "Gold Hoop Earrings"}</strong>
                  <p>₹{(heroProduct?.price ?? 899).toLocaleString("en-IN")}</p>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="hero-campaign"
            style={{ transform: `translate3d(${mouse.x * 0.55}px, ${mouse.y * 0.55}px, 0)` }}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
          >
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900" alt="GURLY earrings campaign visual" loading="eager" />
            <div>
              <span>Girls Accessories</span>
              <strong>Earrings first. Spark always.</strong>
            </div>
          </motion.div>
        </section>

        <section className="store-section trending-section" aria-labelledby="trending-heading">
          <div className="section-heading-row">
            <div>
              <p className="store-label">Fresh drops</p>
              <h2 id="trending-heading">Trending Now</h2>
            </div>
            <Link href="/shop" className="text-link">View all <ArrowRight size={15} /></Link>
          </div>
          
          <div className="horizontal-product-rail">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="rail-card">
                  <ProductCard loading={true} />
                </div>
              ))
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product, index) => (
                <div key={product.id} className="rail-card">
                  <ProductCard product={product} priority={index < 4} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", padding: "40px 0" }}>
                <p>No products found.</p>
              </div>
            )}
          </div>
        </section>

        <section className="store-section store-rooms-section" aria-labelledby="rooms-heading">
          <div className="centered-section-heading">
            <p className="store-label">Discover by mood</p>
            <h2 id="rooms-heading">Shop the Store</h2>
            <p>Immersive rooms for earrings, bracelets, necklaces, and gift sets curated with jewelry-store elegance.</p>
          </div>
          <div className="store-room-grid">
            {storeRooms.map((room) => (
              <Link href={room.href} id={room.id} key={room.title} className="store-room-card">
                <img src={room.image} alt={room.title} loading="lazy" />
                <div>
                  <span>{room.title}</span>
                  <p>{room.copy}</p>
                  <strong>Explore products</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="store-section bestsellers-section" aria-labelledby="bestsellers-heading">
          <div className="section-heading-row">
            <div>
              <p className="store-label">Highest loved</p>
              <h2 id="bestsellers-heading">Bestsellers</h2>
            </div>
            <div className="rating-pill"><Star size={15} fill="currentColor" /> 4.9 average rating</div>
          </div>
          
          <div className="bestseller-carousel">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCard key={`skeleton-best-${index}`} loading={true} />
              ))
            ) : bestsellers.length > 0 ? (
              bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", padding: "40px 0" }}>
                <p>No bestsellers found.</p>
              </div>
            )}
          </div>
        </section>

        <section className="community-section" aria-labelledby="community-heading">
          <div className="centered-section-heading">
            <p className="store-label">Styled by customers</p>
            <h2 id="community-heading">Community Spark</h2>
          </div>
          <div className="community-grid">
            {community.map((item) => (
              <figure key={item.name}>
                <img src={item.image} alt={`${item.name} styling GURLY accessories`} loading="lazy" />
                <figcaption>
                  <strong>{item.name}</strong>
                  <span>{item.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="brand-story-strip" aria-label="Brand story">
          <div>
            <p className="store-label">Brand story</p>
            <h2>Small accessories. High perceived value.</h2>
          </div>
          <p>
            GURLY curates girls accessories with a jewelry-store standard: polished finishes, gift-first packaging, and pieces designed to move from everyday styling to celebration looks.
          </p>
          <div className="trust-grid">
            {trust.map(({ Icon, title, copy }) => (
              <article key={title}>
                <Icon size={18} />
                <strong>{title}</strong>
                <span>{copy}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-glass" aria-labelledby="newsletter-heading">
          <div>
            <p className="store-label">Private list</p>
            <h2 id="newsletter-heading">Early Access</h2>
            <p>Join the first-access list for earrings drops, gift sets, and members-only styling rewards.</p>
          </div>
          <form onSubmit={(event) => event.preventDefault()}>
            <Search size={17} />
            <input aria-label="Email address" type="email" placeholder="your@email.com" />
            <button type="submit">Join</button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}
