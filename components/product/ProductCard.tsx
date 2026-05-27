"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useCart } from "@/store/cart"
import type { Product } from "@/types/database"

interface Props {
  product?: Product
  priority?: boolean
  loading?: boolean
}

export function ProductCard({ product, priority = false, loading = false }: Props) {
  const { add } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  if (loading || !product) {
    return (
      <div className="luxury-product-card loading-skeleton-card" style={{ minHeight: "420px", display: "flex", flexDirection: "column", gap: "12px", padding: "16px", background: "#141414", border: "1px solid rgba(254, 253, 240, 0.05)" }}>
        <div style={{ aspectRatio: "3/4", width: "100%", background: "linear-gradient(90deg, #1C1C1C 25%, #282828 50%, #1C1C1C 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "0px" }} />
        <div style={{ height: "12px", width: "30%", background: "#282828", borderRadius: "0px" }} />
        <div style={{ height: "20px", width: "80%", background: "#282828", borderRadius: "0px" }} />
        <div style={{ height: "14px", width: "50%", background: "#282828", borderRadius: "0px" }} />
      </div>
    )
  }

  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700"
  const secondImage = product.images?.[1] ?? image
  const category = product.categories?.name ?? "Girls Accessories"
  const discount = product.compare_at_price
    ? Math.max(0, Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100))
    : 0

  function quickAdd(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (!product) return
    setIsAdding(true)
    
    setTimeout(() => {
      add({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image,
      })
      toast.success(`${product.title} added to cart`, {
        icon: "✨",
        style: {
          background: "#161616",
          color: "#FEFDF0",
          border: "1px solid #FFE600",
          borderRadius: "0px"
        }
      })
      setIsAdding(false)
    }, 600)
  }

  function toggleFavorite(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    const nextState = !isFavorite
    setIsFavorite(nextState)
    if (nextState) {
      toast.success("Added to wishlist", {
        icon: "💖",
        style: {
          background: "#161616",
          color: "#FEFDF0",
          border: "1px solid #FFE600",
          borderRadius: "0px"
        }
      })
    } else {
      toast.info("Removed from wishlist", {
        style: {
          background: "#161616",
          color: "#FEFDF0",
          border: "1px solid rgba(254, 253, 240, 0.1)",
          borderRadius: "0px"
        }
      })
    }
  }

  const productPath = product.slug ? `/product/${product.slug}` : (product.id ? `/product/${product.id}` : "/shop")

  return (
    <motion.article
      className="luxury-product-card bg-[#141414] border border-[#FEFDF0]/5 rounded-none overflow-hidden text-[#FEFDF0]"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <Link href={productPath} aria-label={`View ${product.title}`}>
        <div className="luxury-product-media relative aspect-[3/4] overflow-hidden group bg-[#0A0A0A]">
          <img 
            className="product-primary-image w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0" 
            src={image} 
            alt={product.title} 
            loading={priority ? "eager" : "lazy"} 
          />
          <img 
            className="product-secondary-image absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
            src={secondImage} 
            alt="" 
            loading="lazy" 
          />

          {/* Yellow Corner Accents on Card Media */}
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[#FFE600] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[#FFE600] opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="product-card-badges absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.featured && (
              <span className="badge-featured bg-[#FFE600] text-black text-[9px] font-extrabold px-2 py-0.5 tracking-wider uppercase rounded-none">
                Featured
              </span>
            )}
            {discount > 0 && (
              <span className="badge-sale bg-black text-[#FFE600] border border-[#FFE600]/30 text-[9px] font-extrabold px-2 py-0.5 tracking-wider uppercase rounded-none">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist toggle */}
          <button
            type="button"
            className="wishlist-heart-btn absolute top-3 right-3 w-8 h-8 rounded-none bg-black/60 hover:bg-[#FFE600] hover:text-black border border-[#FEFDF0]/10 flex items-center justify-center transition-all z-10 text-[#FEFDF0]"
            aria-label="Add to wishlist"
            onClick={toggleFavorite}
          >
            <Heart size={13} fill={isFavorite ? (isFavorite ? "#EF4444" : "none") : "none"} stroke={isFavorite ? "#EF4444" : "currentColor"} />
          </button>

          {/* Quick Add dynamically reveals on hover with slide-up */}
          <div className="quick-add-container absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
            <button
              id={`cart-${product.id}`}
              type="button"
              className="premium-quick-add-btn w-full py-2.5 bg-[#FFE600] hover:bg-white text-black text-[9px] font-extrabold tracking-[0.2em] uppercase rounded-none transition-colors"
              onClick={quickAdd}
              disabled={product.stock <= 0 || isAdding}
            >
              {isAdding ? (
                "ADDING..."
              ) : product.stock > 0 ? (
                <span className="flex items-center gap-1.5 justify-center">
                  <ShoppingBag size={12} /> QUICK ADD
                </span>
              ) : (
                "OUT OF STOCK"
              )}
            </button>
          </div>
        </div>

        <div className="luxury-product-info p-5 text-left">
          <p className="card-category-label text-[9px] font-extrabold tracking-widest text-[#FFE600] uppercase mb-1.5">{category}</p>
          <h3 className="font-serif text-lg font-light text-[#FEFDF0] hover:text-[#FFE600] transition-colors leading-tight mb-2 truncate">{product.title}</h3>
          
          <div className="product-rating-row flex items-center gap-1 text-[#FFE600] text-[10px] font-bold mb-3.5">
            <div className="stars-wrap flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={9} fill="currentColor" stroke="none" />
              ))}
            </div>
            <span className="ml-1 text-[#D4D2C5]">4.9</span>
          </div>

          <div className="product-price-row flex items-baseline gap-2 mt-2">
            <strong className="current-price text-[#FEFDF0] text-base font-light">₹{product.price.toLocaleString("en-IN")}</strong>
            {product.compare_at_price && (
              <>
                <span className="compare-price text-[#A6A498]/60 line-through text-xs">₹{product.compare_at_price.toLocaleString("en-IN")}</span>
                <span className="text-[9px] tracking-wider text-[#FFE600] bg-[#FFE600]/10 border border-[#FFE600]/20 font-extrabold px-1.5 py-0.5 rounded-none ml-1">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          
          <p className={`text-[10px] tracking-wider mt-3 font-extrabold uppercase ${product.stock > 0 ? "text-[#58B47E]" : "text-[#EF4444]"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}

