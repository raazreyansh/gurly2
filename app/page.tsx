"use client"

import { useState, useEffect, useRef } from "react"
import {
  ShoppingBag, Heart, Search, ArrowRight, Eye, Sparkles,
  Award, ShieldCheck, Gift, Truck, Star, X, Check, ShoppingCart
} from "lucide-react"
import { getProducts } from "@/services/products"
import { useCart } from "@/store/cart"
import { toast } from "sonner"
import Link from "next/link"

// Safe luxury audio chime helper using Web Audio API (Zero dependencies, guaranteed silent fallback)
function playSoftChime(frequency = 880) {
  if (typeof window === "undefined") return
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const audioCtx = new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    
    osc.type = "sine"
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + 0.12)
    
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6)
    
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    
    osc.start()
    osc.stop(audioCtx.currentTime + 0.7)
  } catch (e) {
    // Silently bypass if audio permissions block auto-trigger
  }
}

// Curated luxurious default boutique items
const BOUTIQUE_FALLBACK_PRODUCTS = [
  {
    id: "prod-1",
    title: "Dreamer Periwinkle Hoops",
    slug: "dreamer-periwinkle-hoops",
    description: "Delicate liquid earrings dipped in 18k white gold and crowned with deep periwinkle crystals.",
    price: 1899,
    compare_at_price: 2499,
    images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800"],
    mood: "Dreamy",
    category: "Earrings",
    rating: 5,
    story: "Handcrafted to mirror droplets of dew reflecting the periwinkle sky of early morning dawn."
  },
  {
    id: "prod-2",
    title: "Aurora White Choker",
    slug: "aurora-white-choker",
    description: "Sleek sterling silver statement choker with iridescent light-capturing periwinkle pearls.",
    price: 2999,
    compare_at_price: 3899,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"],
    mood: "Elegant",
    category: "Necklaces",
    rating: 5,
    story: "A statement piece created to cascade light directly onto the collarbones with every gesture."
  },
  {
    id: "prod-3",
    title: "Liquid Rose Gold Band",
    slug: "liquid-rose-gold-band",
    description: "Micro-pave crystal ring meticulously layered with liquid metallic rose gold plating.",
    price: 1499,
    compare_at_price: 1999,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800"],
    mood: "Luxury",
    category: "Rings",
    rating: 4.8,
    story: "A warm glowing embrace of rose gold light, crafted for layering with minimal grace."
  },
  {
    id: "prod-4",
    title: "Minimal Silk Threadlet",
    slug: "minimal-silk-threadlet",
    description: "Delicately twisted periwinkle silk thread bracelet with single rose gold floating bead.",
    price: 999,
    compare_at_price: 1299,
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"],
    mood: "Minimal",
    category: "Bracelets",
    rating: 5,
    story: "So weightless and subtle, designed to feel like a whisper of color resting on the wrist."
  }
]

export default function LuxuryBoutiqueHome() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [selectedMood, setSelectedMood] = useState("✨ Elegant")
  const [hoveredAccessory, setHoveredAccessory] = useState<string | null>("earrings")
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorHovering, setCursorHovering] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [flyingSparkles, setFlyingSparkles] = useState<{ id: number; x: number; y: number }[]>([])
  const [active360Product, setActive360Product] = useState<string | null>(null)
  const [rotationAngle, setRotationAngle] = useState(0)
  
  // Checkout Form Details
  const [address, setAddress] = useState({ name: "", street: "", city: "", zip: "", card: "", expiry: "", cvv: "" })

  const { items, add, remove, clear } = useCart()
  const cartCount = items.reduce((a, b) => a + b.quantity, 0)
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    setMounted(true)
    async function loadLiveProducts() {
      try {
        const live = await getProducts()
        if (live && live.length > 0) {
          setProducts(live)
        } else {
          setProducts(BOUTIQUE_FALLBACK_PRODUCTS)
        }
      } catch {
        setProducts(BOUTIQUE_FALLBACK_PRODUCTS)
      }
    }
    loadLiveProducts()

    // Smooth Cursor Coordinates tracker
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
      // Smooth Hero Parallax Reactivity
      const xOffset = (e.clientX - window.innerWidth / 2) / 45
      const yOffset = (e.clientY - window.innerHeight / 2) / 45
      setParallax({ x: xOffset, y: yOffset })
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Dynamic 360-degree rotation simulator
  useEffect(() => {
    if (active360Product) {
      const interval = setInterval(() => {
        setRotationAngle(a => (a + 15) % 360)
      }, 120)
      return () => clearInterval(interval)
    }
  }, [active360Product])

  if (!mounted) return null

  // Sparks fly dynamic animation trigger
  const triggerSparklesFly = (e: React.MouseEvent) => {
    playSoftChime(980)
    const newSparkle = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }
    setFlyingSparkles(prev => [...prev, newSparkle])
    setTimeout(() => {
      setFlyingSparkles(prev => prev.filter(s => s.id !== newSparkle.id))
    }, 1000)
  }

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    triggerSparklesFly(e)
    add({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1
    })
    toast.success(`${product.title} added to your luxury glass tray!`)
  }

  // Mood filter products list
  const filteredProducts = products.filter(p => {
    const moodName = selectedMood.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]| /g, "").toLowerCase()
    const productMood = (p.mood || "elegant").toLowerCase()
    return productMood.includes(moodName) || moodName === "all"
  })

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }} className="custom-cursor-active">
      
      {/* ──────────────────── LUXURY FLOATING CURSOR ──────────────────── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0,
        width: cursorHovering ? "40px" : "18px",
        height: cursorHovering ? "40px" : "18px",
        borderRadius: "50%",
        border: "1px solid var(--rose-gold)",
        pointerEvents: "none",
        zIndex: 9999,
        transform: `translate(${cursor.x - (cursorHovering ? 20 : 9)}px, ${cursor.y - (cursorHovering ? 20 : 9)}px)`,
        boxShadow: cursorHovering ? "0 0 20px rgba(244,63,94,0.3)" : "none",
        background: cursorHovering ? "rgba(253,164,175,0.08)" : "transparent",
        transition: "width 0.25s, height 0.25s, background-color 0.25s, transform 0.05s ease-out",
        display: "none"
      }} className="lg:block" />

      {/* ──────────────────── FLYING SPARKLES DRAWER EFFECT ──────────────────── */}
      {flyingSparkles.map(sparkle => (
        <div key={sparkle.id} style={{
          position: "fixed",
          left: sparkle.x,
          top: sparkle.y,
          zIndex: 9999,
          pointerEvents: "none",
          animation: "flyToCart 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}>
          <Sparkles color="var(--rose-gold)" size={24} style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ))}

      {/* ──────────────────── FLOATING AURORA HALO SYSTEM ──────────────────── */}
      <div className="aurora-bg">
        <div className="aurora-orb orb-1" />
        <div className="aurora-orb orb-2" />
        <div className="aurora-orb orb-3" />
      </div>

      {/* ──────────────────── HEADER / FLOATING NAV ──────────────────── */}
      <header className="glass-tray" style={{
        position: "sticky",
        top: "16px",
        margin: "0 auto",
        zIndex: 999,
        height: "76px",
        maxWidth: "96%",
        borderRadius: "40px",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        border: "1px solid rgba(255, 255, 255, 0.45)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {/* Logo */}
          <Link href="/" onClick={() => playSoftChime(660)} style={{
            fontFamily: "var(--font-serif)",
            fontSize: "24px",
            fontWeight: "700",
            letterSpacing: "0.15em",
            color: "var(--charcoal)",
            textTransform: "uppercase"
          }}>
            GURLY
          </Link>

          {/* Links */}
          <nav style={{ gap: "28px", display: "flex", alignItems: "center" }} className="hidden md:flex">
            {["Earrings", "Collections", "New Drops", "About Us"].map(link => (
              <Link key={link} href="/shop" className="mega-menu-link" style={{
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--charcoal-light)"
              }}
              onMouseEnter={() => { setCursorHovering(true); playSoftChime(1000) }}
              onMouseLeave={() => setCursorHovering(false)}>
                {link}
              </Link>
            ))}
          </nav>
        </div>

        {/* Buttons / Cart Indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <button style={{ background: "none", border: "none", color: "var(--charcoal)" }}
            onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}>
            <Search size={18} />
          </button>
          
          <button style={{ background: "none", border: "none", color: "var(--charcoal)" }}
            onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}>
            <Heart size={18} />
          </button>

          <button
            onClick={() => { playSoftChime(800); setCartOpen(true) }}
            onMouseEnter={() => setCursorHovering(true)}
            onMouseLeave={() => setCursorHovering(false)}
            style={{
              background: "rgba(15, 23, 42, 0.04)",
              border: "none",
              padding: "10px 18px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--charcoal)"
            }}
          >
            <ShoppingBag size={18} color="var(--rose-gold)" />
            <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.05em" }}>CART</span>
            {cartCount > 0 && (
              <span style={{
                background: "var(--rose-gold)",
                color: "white",
                fontSize: "10px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700"
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ──────────────────── HERO: FULLSCREEN IMMERSIVE HERO ──────────────────── */}
      <section style={{
        minHeight: "calc(100vh - 110px)",
        padding: "40px 32px 100px",
        display: "flex",
        alignItems: "center",
        position: "relative",
        zIndex: 1
      }}>
        <div className="container lg:grid-cols-12" style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "40px",
          alignItems: "center",
        }}>
          
          {/* LEFT: Headline & Metrics */}
          <div className="lg:col-span-5" style={{
            transform: `translate(${parallax.x * 0.4}px, ${parallax.y * 0.4}px)`,
            transition: "transform 0.1s ease-out"
          }}>
            <span style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--rose-gold)",
              display: "inline-block",
              marginBottom: "16px"
            }}>
              ✨ Immersion Collection
            </span>
            <h1 style={{
              fontSize: "clamp(40px, 6vw, 68px)",
              fontFamily: "var(--font-serif)",
              color: "var(--charcoal)",
              lineHeight: "1.1",
              marginBottom: "24px"
            }}>
              Elegance <br />
              <span style={{ fontStyle: "italic", fontWeight: "400", color: "var(--periwinkle-mid)" }}>Suspended</span>
            </h1>
            <p style={{
              fontSize: "15px",
              color: "var(--charcoal-light)",
              marginBottom: "36px",
              maxWidth: "400px",
              lineHeight: "1.7"
            }}>
              Redefining luxury through periwinkle pearls and liquid silver. Discover zero-gravity earrings sculpted for dynamic light reflections.
            </p>

            <div style={{ display: "flex", gap: "16px", marginBottom: "50px" }}>
              <Link href="/shop" onClick={() => playSoftChime(900)}
                onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}
                className="btn btn-primary pulse-btn" style={{ borderRadius: "30px", gap: "10px" }}>
                Shop Earrings <ArrowRight size={14} />
              </Link>
              <Link href="/shop" onClick={() => playSoftChime(700)}
                onMouseEnter={() => setCursorHovering(true)} onMouseLeave={() => setCursorHovering(false)}
                className="btn btn-outline" style={{ borderRadius: "30px" }}>
                Explore Luxury
              </Link>
            </div>

            {/* Hero metrics */}
            <div style={{ display: "flex", gap: "40px", borderTop: "1px solid rgba(15,23,42,0.06)", paddingTop: "32px" }}>
              {[
                { count: "12K+", label: "Happy Shoppers" },
                { count: "480+", label: "Boutique Pieces" },
                { count: "5★", label: "Elite Rating" }
              ].map(stat => (
                <div key={stat.label}>
                  <p className="stat-counter" style={{ fontSize: "28px", fontWeight: "700", fontFamily: "var(--font-serif)" }}>
                    {stat.count}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "2px" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CENTER: Floating Premium Earrings */}
          <div className="lg:col-span-4" style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            transform: `translate(${parallax.x * -0.8}px, ${parallax.y * -0.8}px)`,
            transition: "transform 0.15s ease-out"
          }}>
            {/* Liquid Glow Halo Background */}
            <div style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)",
              filter: "blur(20px)",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              animation: "spin 15s linear infinite"
            }} />
            
            {/* Big floating high-resolution product mockup */}
            <div
              onMouseEnter={() => { setCursorHovering(true); playSoftChime(1100) }}
              onMouseLeave={() => setCursorHovering(false)}
              style={{
                width: "260px",
                height: "360px",
                borderRadius: "140px",
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.7)",
                padding: "24px",
                boxShadow: "0 40px 80px rgba(99,102,241,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                animation: "floatOrb 6s ease-in-out infinite alternate"
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"
                alt="Floating Luxury Earrings"
                style={{
                  width: "100%",
                  height: "220px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.12))",
                  borderRadius: "100px"
                }}
              />
              <p style={{ fontFamily: "var(--font-serif)", fontSize: "18px", fontWeight: "600", marginTop: "20px", color: "var(--charcoal)" }}>
                Aurora Drops
              </p>
              <p style={{ fontSize: "12px", color: "var(--rose-gold)", fontWeight: "700", marginTop: "4px" }}>
                ₹1,899
              </p>
            </div>
          </div>

          {/* RIGHT: Live Campaign Model */}
          <div className="lg:col-span-3" style={{
            transform: `translate(${parallax.x * 0.2}px, ${parallax.y * 0.2}px)`,
            transition: "transform 0.1s ease-out"
          }}>
            <div style={{
              position: "relative",
              borderRadius: "200px 200px 20px 20px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.06)"
            }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"
                alt="Boutique Luxury Campaign Model"
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "cover",
                  filter: "grayscale(30%) brightness(95%)"
                }}
              />
              <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                background: "linear-gradient(to top, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0) 100%)",
                padding: "24px",
                color: "white"
              }}>
                <p style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--rose-gold-light)" }}>
                  Campaign Live
                </p>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "16px", marginTop: "2px" }}>
                  Satyam & Gulshan Collection
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────── SECTION 2: SHOP THE STORE (BOUTIQUE ROOMS) ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
              Explore Rooms
            </p>
            <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
              The Interactive Boutique Rooms
            </h2>
            <div style={{ width: "40px", height: "2px", background: "var(--rose-gold)", margin: "16px auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="lg:grid-cols-4">
            {[
              { title: "Dream Earrings", img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600", desc: "Ice-blue white gold drops", tag: "Room 1" },
              { title: "Luxury Necklaces", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", desc: "Iridescent periwinkle bands", tag: "Room 2" },
              { title: "Daily Glow Bracelets", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", desc: "Sleek periwinkle silk bands", tag: "Room 3" },
              { title: "Gift Studio", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600", desc: "Hand-wrapped special collections", tag: "Room 4" }
            ].map((room, idx) => (
              <div
                key={room.title}
                className="glass-card liquid-shine"
                onMouseEnter={() => { setCursorHovering(true); playSoftChime(800 + idx * 80) }}
                onMouseLeave={() => setCursorHovering(false)}
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  height: "360px"
                }}
              >
                <div style={{ position: "relative", flex: 1, borderRadius: "12px", overflow: "hidden", marginBottom: "16px" }}>
                  <img
                    src={room.img}
                    alt={room.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s ease" }}
                    className="hover-scale"
                  />
                  <span style={{
                    position: "absolute",
                    top: "12px", left: "12px",
                    background: "rgba(15,23,42,0.85)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "4px 8px",
                    borderRadius: "10px",
                    letterSpacing: "0.05em"
                  }}>
                    {room.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: "18px", color: "var(--charcoal)" }}>{room.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>{room.desc}</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--rose-gold)" }}>EXPLORE ROOM</span>
                  <ArrowRight size={14} color="var(--rose-gold)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 3: LIVE STORE EXPERIENCE (HORIZONTAL FLOATING) ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, background: "rgba(224, 242, 254, 0.2)", padding: "100px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "50px" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
                Zero Gravity Shop
              </p>
              <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
                Live Moving Store Experience
              </h2>
            </div>
            <p style={{ fontSize: "13px", color: "var(--muted)", maxWidth: "340px" }} className="hidden md:block">
              Accessories suspended in space. Hover over any luxury tray card to unlock 360° motion preview & zero-click wishlisting.
            </p>
          </div>

          {/* Horizontal scroll container */}
          <div style={{
            display: "flex",
            gap: "28px",
            overflowX: "auto",
            padding: "20px 0 40px",
            scrollBehavior: "smooth"
          }}>
            {products.map(product => (
              <div
                key={product.id}
                className="glass-card"
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
                style={{
                  minWidth: "300px",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* 360 View overlay logic */}
                <div style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "var(--ice-blue)",
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "20px"
                }}>
                  {active360Product === product.id ? (
                    <div style={{
                      transform: `rotate(${rotationAngle}deg)`,
                      transition: "transform 0.12s linear"
                    }}>
                      <img src={product.images?.[0]} alt="360 view" style={{ width: "160px", height: "160px", objectFit: "contain" }} />
                    </div>
                  ) : (
                    <img src={product.images?.[0]} alt={product.title} style={{ width: "180px", height: "180px", objectFit: "contain" }} />
                  )}

                  {/* Buttons tray */}
                  <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button
                      onClick={() => {
                        playSoftChime(1100)
                        toast.success(`${product.title} added to your custom Wishlist!`)
                      }}
                      style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "white", border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)", cursor: "pointer"
                      }}
                      className="hover-scale"
                    >
                      <Heart size={16} color="var(--rose-gold)" style={{ margin: "0 auto" }} />
                    </button>
                    
                    <button
                      onClick={() => {
                        playSoftChime(950)
                        setActive360Product(active360Product === product.id ? null : product.id)
                      }}
                      style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: active360Product === product.id ? "var(--charcoal)" : "white",
                        border: "none",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)", cursor: "pointer"
                      }}
                      className="hover-scale"
                    >
                      <Eye size={16} color={active360Product === product.id ? "white" : "var(--muted)"} style={{ margin: "0 auto" }} />
                    </button>
                  </div>

                  {active360Product === product.id && (
                    <span style={{
                      position: "absolute",
                      bottom: "12px",
                      background: "rgba(15,23,42,0.85)",
                      color: "white",
                      fontSize: "9px",
                      fontWeight: "700",
                      padding: "4px 8px",
                      borderRadius: "10px",
                      letterSpacing: "0.08em"
                    }}>
                      ✦ 360° LIVE REFLECTION ACTIVE ✦
                    </span>
                  )}
                </div>

                <span style={{ fontSize: "10px", fontWeight: "700", color: "var(--rose-gold)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {product.category}
                </span>
                <h3 style={{ fontSize: "17px", color: "var(--charcoal)", marginTop: "4px", fontWeight: "600" }}>{product.title}</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px", flex: 1 }}>{product.description}</p>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "1px solid rgba(0,0,0,0.04)", paddingTop: "16px" }}>
                  <p style={{ fontSize: "16px", fontWeight: "700", color: "var(--charcoal)" }}>
                    ₹{product.price.toLocaleString()}
                  </p>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    style={{
                      background: "var(--charcoal)",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                    className="hover-scale"
                  >
                    <ShoppingBag size={12} />
                    QUICK BUY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 4: SHOP BY MOOD ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
              Mood Selector
            </p>
            <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
              Today I Feel...
            </h2>
            <div style={{ width: "40px", height: "2px", background: "var(--rose-gold)", margin: "16px auto" }} />
          </div>

          {/* Selector pills */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "50px", flexWrap: "wrap" }}>
            {["☁ Dreamy", "✨ Elegant", "🌙 Luxury", "💎 Minimal"].map(mood => (
              <button
                key={mood}
                onClick={() => { playSoftChime(750); setSelectedMood(mood) }}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
                style={{
                  background: selectedMood === mood ? "var(--charcoal)" : "rgba(15,23,42,0.04)",
                  color: selectedMood === mood ? "white" : "var(--charcoal-light)",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "30px",
                  fontSize: "13px",
                  fontWeight: "600",
                  letterSpacing: "0.02em",
                  boxShadow: selectedMood === mood ? "0 10px 25px rgba(15,23,42,0.15)" : "none",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                className="hover-scale"
              >
                {mood}
              </button>
            ))}
          </div>

          {/* Dynamic mood filtered products display */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="lg:grid-cols-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="glass-card"
                style={{ borderRadius: "12px", padding: "16px", position: "relative" }}
              >
                <div style={{ borderRadius: "8px", overflow: "hidden", background: "var(--warm-white)", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>
                  <img src={product.images?.[0]} alt={product.title} style={{ width: "130px", height: "130px", objectFit: "contain" }} />
                </div>
                <h4 style={{ fontSize: "15px", fontWeight: "600", color: "var(--charcoal)" }}>{product.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--charcoal)" }}>₹{product.price.toLocaleString()}</span>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    style={{ background: "none", border: "none", color: "var(--rose-gold)", cursor: "pointer", display: "flex", alignItems: "center" }}
                    className="hover-scale"
                  >
                    <PlusIcon size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 5: BESTSELLERS (CAROUSEL + STORY) ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, background: "rgba(237, 233, 254, 0.2)", padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
              Bespoke Icons
            </p>
            <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
              The Luxury Bestsellers
            </h2>
            <div style={{ width: "40px", height: "2px", background: "var(--rose-gold)", margin: "16px auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="lg:grid-cols-2">
            {products.slice(0, 2).map((item, idx) => (
              <div
                key={item.id}
                onMouseEnter={() => setCursorHovering(true)}
                onMouseLeave={() => setCursorHovering(false)}
                style={{
                  borderRadius: "20px",
                  padding: "32px",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "24px",
                  alignItems: "center"
                }}
                className="md:grid-cols-12 glass-card"
              >
                <div className="md:col-span-5" style={{ background: "var(--white)", borderRadius: "12px", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={item.images?.[0]} alt={item.title} style={{ width: "100%", maxHeight: "180px", objectFit: "contain" }} />
                </div>
                
                <div className="md:col-span-7">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="var(--rose-gold)" color="var(--rose-gold)" />
                    ))}
                    <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--muted)", marginLeft: "4px" }}>
                      {item.rating || "5.0"} RATING
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: "20px", fontWeight: "600", color: "var(--charcoal)" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "var(--rose-gold)", marginTop: "4px" }}>₹{item.price.toLocaleString()}</p>
                  
                  <blockquote style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    color: "var(--charcoal-light)",
                    borderLeft: "2px solid var(--periwinkle-mid)",
                    paddingLeft: "12px",
                    margin: "14px 0"
                  }}>
                    {item.story || "A classic handcrafted masterpiece designed to capture the warmth of metallic morning rays."}
                  </blockquote>

                  <button
                    onClick={(e) => handleAddToCart(item, e)}
                    style={{
                      background: "var(--charcoal)",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "24px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "16px"
                    }}
                  >
                    <ShoppingBag size={12} />
                    ADD TO TRAY
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 6: TRY THE COLLECTION ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, padding: "100px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
              Visual Try-On
            </p>
            <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
              Try the Immersive Collection
            </h2>
            <div style={{ width: "40px", height: "2px", background: "var(--rose-gold)", margin: "16px auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px", alignItems: "center" }} className="lg:grid-cols-12">
            
            {/* LEFT: Model Image with interactive indicator dots */}
            <div className="lg:col-span-5" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "360px", borderRadius: "180px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.7)" }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"
                  alt="Try-On model showcase"
                  style={{ width: "100%", height: "460px", objectFit: "cover" }}
                />

                {/* EAR Indicator Dot (Earrings) */}
                {hoveredAccessory === "earrings" && (
                  <div style={{
                    position: "absolute",
                    top: "54%", left: "43%",
                    width: "20px", height: "20px",
                    background: "rgba(244,63,94,0.7)",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px 8px rgba(244,63,94,0.4)",
                    animation: "spin 1.5s infinite alternate",
                    transform: "translate(-50%, -50%)"
                  }} />
                )}

                {/* NECK Indicator Dot (Necklace) */}
                {hoveredAccessory === "necklace" && (
                  <div style={{
                    position: "absolute",
                    top: "70%", left: "54%",
                    width: "24px", height: "24px",
                    background: "rgba(99,102,241,0.7)",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px 8px rgba(99,102,241,0.4)",
                    transform: "translate(-50%, -50%)"
                  }} />
                )}

                {/* HAIR Indicator Dot (Accessory) */}
                {hoveredAccessory === "hair" && (
                  <div style={{
                    position: "absolute",
                    top: "25%", left: "42%",
                    width: "20px", height: "20px",
                    background: "rgba(237,233,254,0.8)",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px 8px rgba(237,233,254,0.6)",
                    transform: "translate(-50%, -50%)"
                  }} />
                )}
              </div>
            </div>

            {/* RIGHT: Interactive Items List */}
            <div className="lg:col-span-7" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { key: "earrings", title: "Dreamer Periwinkle Hoops", desc: "Hover to visualize how the white gold periwinkle drops hang gracefully from the lower lobe.", price: "₹1,899" },
                { key: "necklace", title: "Aurora Pearl Choker", desc: "Hover to preview how the light-capturing periwinkle pearls cascade elegantly across the collarbone.", price: "₹2,999" },
                { key: "hair", title: "Soft Violet Silk Scrunchie", desc: "Hover to see how the periwinkle-violet silk crown drapes gently behind the head.", price: "₹899" }
              ].map(item => {
                const active = hoveredAccessory === item.key
                return (
                  <div
                    key={item.key}
                    onMouseEnter={() => { setHoveredAccessory(item.key); playSoftChime(850) }}
                    style={{
                      background: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                      border: `1.5px solid ${active ? "var(--rose-gold-light)" : "rgba(0,0,0,0.04)"}`,
                      borderRadius: "12px",
                      padding: "24px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: active ? "0 10px 30px rgba(244,63,94,0.06)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "600", color: active ? "var(--rose-gold)" : "var(--charcoal)" }}>
                        {item.title}
                      </h4>
                      <span style={{ fontSize: "14px", fontWeight: "700" }}>{item.price}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>{item.desc}</p>
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 7: WHY GURLY ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, background: "var(--ice-blue)", padding: "80px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px" }} className="lg:grid-cols-4">
            {[
              { Icon: Award, title: "Premium Quality", desc: "Dipped in 18k white gold overlays" },
              { Icon: ShieldCheck, title: "Skin Friendly", desc: "100% lead-free, non-allergenic metals" },
              { Icon: Gift, title: "Gift Ready", desc: "Elegant periwinkle luxury custom box" },
              { Icon: Truck, title: "Fast Delivery", desc: "Secured free shipping over ₹999" }
            ].map(box => (
              <div key={box.title} style={{
                background: "white",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(0,0,0,0.04)",
                textAlign: "center",
                boxShadow: "0 10px 35px rgba(15,23,42,0.02)"
              }}
              className="hover-scale">
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "rgba(99,102,241,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <box.Icon size={20} color="var(--periwinkle-mid)" />
                </div>
                <h3 style={{ fontSize: "16px", color: "var(--charcoal)" }}>{box.title}</h3>
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>{box.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 8: COMMUNITY CUSTOMER GALLERY ──────────────────── */}
      <section className="section" style={{ position: "relative", zIndex: 1, padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "50px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.15em", color: "var(--rose-gold)", textTransform: "uppercase" }}>
              Luxury Masonry
            </p>
            <h2 style={{ fontSize: "36px", color: "var(--charcoal)", marginTop: "4px" }}>
              Community Showcase
            </h2>
            <div style={{ width: "40px", height: "2px", background: "var(--rose-gold)", margin: "16px auto" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }} className="lg:grid-cols-4">
            {[
              { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600", review: "Absolutely in love with the periwinkle pearls! Drapes beautifully. 5/5 stars!", author: "@ritika.sharma" },
              { img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600", review: "The rose gold stacked band matches perfectly with any dress. Incredible packaging too!", author: "@sneha_verma" },
              { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600", review: "Skin friendly for real! I have very sensitive skin but had zero rashes. Highly recommended.", author: "@priya_das" },
              { img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600", review: "Delivered in just 2 days in a gorgeous silk pouch. Satyam & Gulshan crushed it!", author: "@ananya.g" }
            ].map(col => (
              <div
                key={col.author}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.04)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
                }}
                className="hover-scale"
              >
                <img src={col.img} alt="review selfie" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                <div style={{ padding: "16px" }}>
                  <p style={{ fontSize: "11px", fontStyle: "italic", color: "var(--charcoal-light)", lineHeight: "1.5" }}>
                    &ldquo;{col.review}&rdquo;
                  </p>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "var(--rose-gold)", marginTop: "10px", textTransform: "uppercase" }}>
                    {col.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── SECTION 9: LUXURY CART DRAWER ──────────────────── */}
      {cartOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <div className="glass-tray" style={{
            width: "100%",
            maxWidth: "460px",
            height: "100%",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", color: "var(--charcoal)" }}>Your Glass Tray</h3>
              <button
                onClick={() => { playSoftChime(600); setCartOpen(false) }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--charcoal)" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart list */}
            {items.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--muted)" }}>
                <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
                <p style={{ fontSize: "13px" }}>Your glass tray is currently empty</p>
              </div>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
                  {items.map(item => (
                    <div key={item.productId} style={{
                      display: "flex", gap: "16px", background: "white", padding: "16px", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.04)"
                    }}>
                      <img src={item.image} alt={item.title} style={{ width: "60px", height: "60px", objectFit: "contain", background: "var(--ice-blue)", borderRadius: "4px" }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: "13px", fontWeight: "600", color: "var(--charcoal)" }}>{item.title}</h4>
                        <p style={{ fontSize: "12px", color: "var(--rose-gold)", fontWeight: "700", marginTop: "2px" }}>₹{item.price.toLocaleString()}</p>
                        <p style={{ fontSize: "10px", color: "var(--muted)", marginTop: "2px" }}>Qty: {item.quantity}</p>
                      </div>
                      <button
                        onClick={() => { playSoftChime(500); remove(item.productId) }}
                        style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontSize: "11px" }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Total & Checkout button */}
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "24px", marginTop: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600" }}>Total Amount:</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--rose-gold)" }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => { playSoftChime(950); setCheckoutOpen(true); setCartOpen(false) }}
                    style={{ width: "100%", borderRadius: "30px" }}
                    className="btn btn-primary pulse-btn"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────── SECTION 10: LUXURY MINIMAL CHECKOUT ──────────────────── */}
      {checkoutOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div className="glass-tray" style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "20px",
            padding: "40px",
            position: "relative",
            animation: "fadeIn 0.3s ease forwards"
          }}>
            <button
              onClick={() => { playSoftChime(600); setCheckoutOpen(false) }}
              style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", cursor: "pointer" }}
            >
              <X size={20} />
            </button>

            {checkoutStep === 1 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>Boutique Delivery</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "24px" }}>Step 1 of 2: Shipping details</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <input
                    type="text" placeholder="Full Name" className="input" value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  />
                  <input
                    type="text" placeholder="Street Address" className="input" value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                      type="text" placeholder="City" className="input" value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                    <input
                      type="text" placeholder="Zip Code" className="input" value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!address.name || !address.street || !address.city || !address.zip) {
                        toast.error("Please fill in all shipping fields!")
                        return
                      }
                      playSoftChime(850)
                      setCheckoutStep(2)
                    }}
                    style={{ width: "100%", borderRadius: "30px", marginTop: "8px" }}
                    className="btn btn-primary"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 2 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "8px" }}>Luxury Payment</h3>
                <p style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "24px" }}>Step 2 of 2: Secure transaction details</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <input
                    type="text" placeholder="Card Number" className="input" value={address.card}
                    onChange={(e) => setAddress({ ...address, card: e.target.value })}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <input
                      type="text" placeholder="MM/YY" className="input" value={address.expiry}
                      onChange={(e) => setAddress({ ...address, expiry: e.target.value })}
                    />
                    <input
                      type="text" placeholder="CVV" className="input" value={address.cvv}
                      onChange={(e) => setAddress({ ...address, cvv: e.target.value })}
                    />
                  </div>
                  
                  <button
                    onClick={() => {
                      if (!address.card || !address.expiry || !address.cvv) {
                        toast.error("Please complete all payment credentials!")
                        return
                      }
                      playSoftChime(1200)
                      setCheckoutStep(3)
                    }}
                    style={{ width: "100%", borderRadius: "30px", marginTop: "8px" }}
                    className="btn btn-primary pulse-btn"
                  >
                    CONFIRM & PACKAGE ORDER
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "var(--ice-blue)", display: "flex",
                  alignItems: "center", justifyContent: "center", margin: "0 auto 24px"
                }}>
                  <Gift size={32} color="var(--rose-gold)" style={{ animation: "spin 2s linear infinite" }} />
                </div>
                
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", color: "var(--charcoal)" }}>
                  Order Wrapped! 🎁
                </h3>
                <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "8px", lineHeight: "1.6" }}>
                  Thank you, <strong>{address.name}</strong>! Your order has been elegantly wrapped in our custom periwinkle silk box ribbon. It is now winging its way to you!
                </p>
                
                <button
                  onClick={() => {
                    playSoftChime(600)
                    clear()
                    setCheckoutOpen(false)
                    setCheckoutStep(1)
                  }}
                  style={{ width: "100%", borderRadius: "30px", marginTop: "32px" }}
                  className="btn btn-primary"
                >
                  RETURN TO BOUTIQUE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ──────────────────── CUSTOM STYLES & INTERACTIVE TRAYS ──────────────────── */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes flyToCart {
          0% { transform: scale(1) translate(0, 0); opacity: 1; }
          40% { transform: scale(1.3) translate(-10px, -20px); opacity: 0.9; }
          100% { transform: scale(0.3) translate(300px, -500px); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function PlusIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}
