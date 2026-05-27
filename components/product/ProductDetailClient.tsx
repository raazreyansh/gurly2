"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Heart, Share2, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { ProductCard } from "@/components/product/ProductCard"
import { useCart } from "@/store/cart"
import type { Product } from "@/types/database"

interface Props {
  product: Product
  related: Product[]
}

const ACCORDIONS = [
  { title: "Details", body: "Premium plated finish. Hypoallergenic. Store in the GURLY pouch." },
  { title: "Shipping", body: "Free shipping over ₹999. 7-day returns. Delivered in 3–5 days." },
  { title: "Gift", body: "Every order arrives gift-ready in a velvet-lined box." },
]

export function ProductDetailClient({ product, related }: Props) {
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [openAcc, setOpenAcc] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const { add } = useCart()

  useEffect(() => {
    const handler = () => setShowSticky(window.scrollY > 500)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1000"]
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  function addToCart() {
    setIsAdding(true)
    setTimeout(() => {
      for (let i = 0; i < qty; i++) {
        add({ productId: product.id, title: product.title, price: product.price, quantity: 1, image: images[0] })
      }
      toast.success("Added to bag")
      setIsAdding(false)
    }, 500)
  }

  return (
    <div className="bg-white text-black min-h-screen pt-14 font-sans">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center gap-2 text-[10px] font-medium text-black/40 uppercase tracking-wider">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-black">{product.title}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ─── LEFT: Images ─── */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    className={`w-14 h-16 overflow-hidden border transition-all ${activeImg === i ? "border-black" : "border-transparent opacity-50 hover:opacity-80"}`}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <motion.div
              key={images[activeImg]}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              className="flex-1 aspect-[3/4] overflow-hidden bg-[#F5F5F5] relative"
            >
              <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                  -{discount}%
                </span>
              )}
            </motion.div>
          </div>

          {/* ─── RIGHT: Buy Panel ─── */}
          <div className="lg:pt-4 space-y-6">
            {/* Category */}
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
              {product.categories?.name ?? "Jewelry"}
            </p>

            {/* Name + Price */}
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">{product.title}</h1>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</span>
                {product.compare_at_price && (
                  <span className="text-base text-black/30 line-through">₹{product.compare_at_price.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>

            {/* Stock */}
            <p className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? (product.stock <= 5 ? "text-orange-500" : "text-green-600") : "text-red-500"}`}>
              {product.stock > 0 ? (product.stock <= 5 ? `Only ${product.stock} left` : "In Stock") : "Out of Stock"}
            </p>

            {/* Quantity */}
            <div className="flex items-center border border-[#E8E8E8] w-fit">
              <button type="button" onClick={() => setQty((v) => Math.max(1, v - 1))} className="w-10 h-10 flex items-center justify-center text-black/50 hover:text-black text-lg font-light transition-colors">−</button>
              <span className="w-10 text-center text-sm font-bold">{qty}</span>
              <button type="button" onClick={() => setQty((v) => v + 1)} className="w-10 h-10 flex items-center justify-center text-black/50 hover:text-black text-lg font-light transition-colors">+</button>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2">
              <button
                id="add-to-cart-btn"
                type="button"
                disabled={product.stock <= 0 || isAdding}
                onClick={addToCart}
                className="flex-1 py-4 bg-black hover:bg-neutral-800 disabled:bg-black/30 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={13} />
                {isAdding ? "Adding…" : "Add to Bag"}
              </button>
              <button
                id="wishlist-btn"
                type="button"
                onClick={() => setIsFav((v) => !v)}
                className="w-12 h-12 border border-[#E8E8E8] hover:border-black flex items-center justify-center transition-colors"
                aria-label="Wishlist"
              >
                <Heart size={15} fill={isFav ? "black" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied") }}
                className="w-12 h-12 border border-[#E8E8E8] hover:border-black flex items-center justify-center transition-colors"
                aria-label="Share"
              >
                <Share2 size={14} />
              </button>
            </div>

            {/* Accordions — minimal, no text walls */}
            <div className="border-t border-[#E8E8E8]">
              {ACCORDIONS.map(({ title, body }) => {
                const open = openAcc === title
                return (
                  <div key={title} className="border-b border-[#E8E8E8]">
                    <button
                      type="button"
                      onClick={() => setOpenAcc(open ? "" : title)}
                      className="w-full flex justify-between items-center py-4 text-[10px] font-black uppercase tracking-widest text-black hover:text-black/60 transition-colors"
                      aria-expanded={open}
                    >
                      {title}
                      <motion.span animate={{ rotate: open ? 180 : 0 }}>
                        <ChevronDown size={13} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: "hidden" }}
                        >
                          <p className="pb-4 text-xs text-black/50 leading-relaxed">{body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─── Related ─── */}
        {related.length > 0 && (
          <section className="mt-20 pt-10 border-t border-[#E8E8E8]">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest">You may also like</p>
              <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">See all →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky mobile bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E8E8] flex items-center gap-3 px-4 py-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate uppercase tracking-tight">{product.title}</p>
              <p className="text-xs text-black/50">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
            <button
              type="button"
              disabled={product.stock <= 0 || isAdding}
              onClick={addToCart}
              className="shrink-0 px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Add
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
