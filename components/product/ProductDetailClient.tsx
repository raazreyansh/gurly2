"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Heart, Share2, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react"
import { toast } from "sonner"
import { ProductCard } from "@/components/product/ProductCard"
import { useCart } from "@/store/cart"
import type { Product } from "@/types/database"

interface Props {
  product: Product
  related: Product[]
}

const accordions = [
  {
    title: "Materials and care",
    body: "Premium plated finish, skin-friendly polish, and smooth edges. Store separately in the GURLY velvet pouch and wipe gently after wear.",
  },
  {
    title: "Shipping and returns",
    body: "Fast secure dispatch, free shipping over ₹999, and a 7-day return window for unused accessories in original gold-embossed packaging.",
  },
  {
    title: "Sovereign Gift packaging",
    body: "Every piece arrives in a soft velvet wrap with gift-ready presentation for bridesmaids, premium surprises, and cherished celebrations.",
  },
]

export function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState("Materials and care")
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { add } = useCart()

  const [selectedFinish, setSelectedFinish] = useState("Champagne Gold")
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 14, seconds: 45 })

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        clearInterval(timer)
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 400) {
        setShowStickyBar(true)
      } else {
        setShowStickyBar(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1000"]
  const currentImage = images[activeImage] ?? images[0]
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  function addToCart() {
    setIsAdding(true)
    setTimeout(() => {
      for (let index = 0; index < quantity; index += 1) {
        add({
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: images[0] ?? "",
        })
      }
      toast.success(`${quantity} x ${product.title} added to ledger`, {
        icon: "✨",
        style: {
          background: "#041C12",
          color: "#F7F4EB",
          border: "1px solid #DFBA73",
          borderRadius: "0px"
        }
      })
      setIsAdding(false)
    }, 600)
  }

  function toggleFavorite() {
    const nextState = !isFavorite
    setIsFavorite(nextState)
    if (nextState) {
      toast.success("Added to wishlist", {
        icon: "💖",
        style: {
          background: "#041C12",
          color: "#F7F4EB",
          border: "1px solid #DFBA73",
          borderRadius: "0px"
        }
      })
    } else {
      toast.info("Removed from wishlist", {
        style: {
          background: "#041C12",
          color: "#F7F4EB",
          border: "1px solid rgba(223, 186, 115, 0.1)",
          borderRadius: "0px"
        }
      })
    }
  }

  return (
    <div className="product-detail-shell bg-[#041C12] text-[#F7F4EB] min-h-screen pt-28 font-sans max-w-7xl mx-auto px-6 md:px-12">
      {/* Breadcrumb */}
      <div className="product-breadcrumb flex items-center gap-2.5 text-[9px] text-[#C8C5B9] uppercase tracking-wider mb-10">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#DFBA73] font-extrabold">{product.title}</span>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Product Gallery */}
        <div data-testid="product-gallery" className="lg:col-span-7 flex flex-col md:flex-row gap-5">
          <div className="flex md:flex-col gap-3 order-2 md:order-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`w-16 h-20 border transition-all ${
                  activeImage === index 
                    ? "border-[#DFBA73] opacity-100" 
                    : "border-[#F7F4EB]/10 opacity-60 hover:opacity-100"
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-grow order-1 md:order-2 bg-[#03170F] border border-[#DFBA73]/10 relative aspect-[3/4]">
            <motion.div 
              className="w-full h-full" 
              initial={{ opacity: 0.7 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.3 }}
              key={currentImage}
            >
              <img src={currentImage} alt={product.title} loading="eager" className="w-full h-full object-cover" />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-black text-[#DFBA73] border border-[#DFBA73]/30 text-[9px] font-extrabold px-3 py-1 tracking-widest uppercase">
                  {discount}% OFF
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Right Sticky Buy Panel */}
        <aside data-testid="sticky-buy-panel" className="lg:col-span-5 space-y-8 text-left">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-2">{product.categories?.name ?? "Girls Accessories"}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#F7F4EB] leading-tight">{product.title}</h1>
            
            <div className="flex items-center gap-2 mt-4 text-[#DFBA73] text-[10px] font-extrabold">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={10} fill="currentColor" stroke="none" />
                ))}
              </div>
              <span className="text-[#C8C5B9] ml-1.5 font-light uppercase tracking-wider">4.9 rating (128 reviews)</span>
            </div>
          </div>

          <div className="py-4 border-y border-[#DFBA73]/10 flex items-baseline gap-3">
            <strong className="text-3xl font-light text-[#F7F4EB]">₹{product.price.toLocaleString("en-IN")}</strong>
            {product.compare_at_price && (
              <span className="text-[#C8C5B9]/60 line-through text-sm">₹{product.compare_at_price.toLocaleString("en-IN")}</span>
            )}
          </div>

          {/* Visual Finish Swatches */}
          <div className="space-y-3">
            <span className="text-[9px] font-extrabold tracking-widest text-[#C8C5B9] uppercase">
              FINISH: <strong className="text-[#F7F4EB] font-extrabold">{selectedFinish}</strong>
            </span>
            <div className="flex gap-3">
              {[
                { name: "Champagne Gold", color: "#e3d2be", border: "#DFBA73" },
                { name: "Sleek Silver", color: "#e2e8f0", border: "#FFF" },
                { name: "Soft Rose Gold", color: "#fbcfe8", border: "#f43f5e" }
              ].map((finish) => (
                <button
                  key={finish.name}
                  type="button"
                  onClick={() => {
                    setSelectedFinish(finish.name)
                    toast.success(`Selected finish: ${finish.name}`, {
                      style: {
                        background: "#041C12",
                        color: "#F7F4EB",
                        border: "1px solid #DFBA73",
                        borderRadius: "0px"
                      }
                    })
                  }}
                  className={`w-7 h-7 rounded-none border transition-all ${
                    selectedFinish === finish.name 
                      ? "border-[#DFBA73] scale-110 shadow-lg" 
                      : "border-transparent opacity-75 hover:opacity-100"
                  }`}
                  style={{ background: finish.color }}
                  title={finish.name}
                />
              ))}
            </div>
          </div>

          {/* Delivery Urgency Countdown */}
          <div className="bg-[#03170F] border border-[#DFBA73]/20 p-5 flex items-start gap-4">
            <span className="text-xl">🚚</span>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-[#F7F4EB] uppercase tracking-wider">
                Sovereign Dispatch within{" "}
                <span className="font-mono text-[#DFBA73] font-extrabold text-sm">
                  {String(countdown.hours).padStart(2, "0")}h : {String(countdown.minutes).padStart(2, "0")}m : {String(countdown.seconds).padStart(2, "0")}s
                </span>
              </p>
              <p className="text-[10px] text-[#C8C5B9] leading-relaxed uppercase tracking-wider">
                Expected delivery by <strong>Friday, May 30th</strong>. Free shipping applied!
              </p>
            </div>
          </div>

          {product.description && (
            <p className="text-xs text-[#C8C5B9] uppercase tracking-wider leading-relaxed">{product.description}</p>
          )}

          {/* Stock Indicators */}
          <div className="flex items-center justify-between text-[9px] pb-3 border-b border-[#DFBA73]/10">
            {product.stock > 0 ? (
              product.stock <= 5 ? (
                <span className="text-[#EF4444] font-extrabold uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#EF4444]" /> ONLY {product.stock} PIECES LEFT IN LEDGER
                </span>
              ) : (
                <span className="text-[#58B47E] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#58B47E]" /> {product.stock} PIECES IN LEDGER
                </span>
              )
            ) : (
              <span className="text-gray-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-500" /> SOVEREIGN SHORTAGE
              </span>
            )}
            <span className="text-[#DFBA73] text-[9px] font-extrabold tracking-widest uppercase">VELVET BOX READY</span>
          </div>

          <div className="flex gap-4 items-center">
            {/* Quantity */}
            <div className="flex items-center border border-[#DFBA73]/20 h-14 bg-[#03170F] font-extrabold">
              <button type="button" className="px-4 py-2 hover:text-[#DFBA73]" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span className="px-4 text-xs font-mono">{quantity}</span>
              <button type="button" className="px-4 py-2 hover:text-[#DFBA73]" onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>

            {/* Actions */}
            <div className="flex-1 flex gap-2.5">
              <button
                id="add-to-cart-btn"
                type="button"
                className="flex-1 py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[9px] uppercase font-extrabold tracking-[0.2em] transition-colors flex items-center justify-center gap-2"
                onClick={addToCart}
                disabled={product.stock <= 0 || isAdding}
              >
                {isAdding ? (
                  "ACQUIRING..."
                ) : (
                  <>
                    <ShoppingBag size={14} /> ACQUIRE PIECE
                  </>
                )}
              </button>
              <button
                id="wishlist-btn"
                type="button"
                className={`w-14 h-14 border border-[#DFBA73]/15 hover:border-[#DFBA73] flex items-center justify-center transition-all ${
                  isFavorite ? "text-red-500 bg-[#DFBA73]/5" : "text-[#F7F4EB] hover:text-[#DFBA73]"
                }`}
                onClick={toggleFavorite}
                aria-label="Add to wishlist"
              >
                <Heart size={15} fill={isFavorite ? "#EF4444" : "none"} stroke={isFavorite ? "#EF4444" : "currentColor"} />
              </button>
              <button
                type="button"
                className="w-14 h-14 border border-[#DFBA73]/15 hover:border-[#DFBA73] text-[#F7F4EB] hover:text-[#DFBA73] flex items-center justify-center transition-all"
                aria-label="Copy product link"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success("Acquisition URL copied", {
                    style: {
                      background: "#041C12",
                      color: "#F7F4EB",
                      border: "1px solid #DFBA73",
                      borderRadius: "0px"
                    }
                  })
                }}
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[9px] font-extrabold tracking-widest text-[#C8C5B9] uppercase">
            <span className="flex items-center gap-1.5"><Truck size={13} className="text-[#DFBA73]" /> SECURE DISPATCH</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-[#DFBA73]" /> HYPOALLERGENIC</span>
          </div>

          {/* Accordions */}
          <div className="border-t border-[#DFBA73]/10 pt-4">
            {accordions.map((item) => {
              const open = openAccordion === item.title
              return (
                <div key={item.title} className="border-b border-[#DFBA73]/10 py-4">
                  <button 
                    type="button" 
                    onClick={() => setOpenAccordion(open ? "" : item.title)} 
                    aria-expanded={open}
                    className="w-full flex items-center justify-between text-[10px] font-extrabold tracking-widest uppercase text-[#F7F4EB] hover:text-[#DFBA73] transition-colors text-left"
                  >
                    {item.title}
                    <motion.span animate={{ rotate: open ? 180 : 0 }}>
                      <ChevronDown size={14} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p className="text-xs text-[#C8C5B9] leading-relaxed mt-3">{item.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </aside>
      </section>

      {/* Recommendations */}
      {related.length > 0 && (
        <section className="py-24 border-t border-[#DFBA73]/10 mt-20 text-left" aria-labelledby="recommendations-heading">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-2">Styled together</p>
              <h2 id="recommendations-heading" className="font-serif text-3xl font-light text-[#F7F4EB]">Complete the Spark</h2>
            </div>
            <Link href="/shop" className="text-[9px] font-extrabold tracking-widest uppercase text-[#DFBA73] hover:text-white border-b border-[#DFBA73]/30 hover:border-white transition-colors pb-0.5">Shop all</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Premium Floating Quick Shop Bar for Mobile */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-[#03170F] border border-[#DFBA73]/30 p-3 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <img
                src={images[0]}
                alt=""
                className="w-10 h-10 object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-extrabold text-[#F7F4EB] truncate max-w-[140px] uppercase tracking-wider">
                  {product.title}
                </span>
                <span className="text-[11px] font-mono text-[#DFBA73]">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={product.stock <= 0 || isAdding}
              className="py-2.5 px-5 bg-[#DFBA73] text-[#041C12] text-[9px] font-extrabold tracking-[0.15em] uppercase rounded-none transition-colors"
            >
              {isAdding ? "Acquiring..." : product.stock > 0 ? "Acquire" : "Sold Out"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
