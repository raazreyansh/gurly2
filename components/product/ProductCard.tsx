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
      <div className="luxury-product-card loading-skeleton-card" style={{ minHeight: "420px", display: "flex", flexDirection: "column", gap: "12px", padding: "16px" }}>
        <div style={{ aspectRatio: "3/4", width: "100%", background: "linear-gradient(90deg, #eef9ff 25%, #e0f2fe 50%, #eef9ff 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "16px" }} />
        <div style={{ height: "12px", width: "30%", background: "#e0f2fe", borderRadius: "4px" }} />
        <div style={{ height: "20px", width: "80%", background: "#e0f2fe", borderRadius: "4px" }} />
        <div style={{ height: "14px", width: "50%", background: "#e0f2fe", borderRadius: "4px" }} />
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
          background: "rgba(255, 255, 255, 0.9)",
          color: "var(--charcoal)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(244, 63, 94, 0.2)",
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
      toast.success("Added to wishlist", { icon: "💖" })
    } else {
      toast.info("Removed from wishlist")
    }
  }

  return (
    <motion.article
      className="luxury-product-card"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Link href={`/product/${product.slug ?? product.id}`} aria-label={`View ${product.title}`}>
        <div className="luxury-product-media">
          <img className="product-primary-image" src={image} alt={product.title} loading={priority ? "eager" : "lazy"} />
          <img className="product-secondary-image" src={secondImage} alt="" loading="lazy" />

          {/* Luxury overlays & Badges */}
          <div className="product-card-badges">
            {product.featured && <span className="badge-featured">Featured</span>}
            {discount > 0 && <span className="badge-sale">Sale {discount}%</span>}
          </div>

          {/* Premium wishlist absolute toggle */}
          <button
            type="button"
            className={`wishlist-heart-btn ${isFavorite ? "active" : ""}`}
            aria-label="Add to wishlist"
            onClick={toggleFavorite}
          >
            <Heart size={16} fill={isFavorite ? "var(--rose)" : "none"} stroke={isFavorite ? "var(--rose)" : "currentColor"} />
          </button>

          {/* Quick Add dynamically reveals on hover with slide-up */}
          <div className="quick-add-container">
            <button
              id={`cart-${product.id}`}
              type="button"
              className={`premium-quick-add-btn ${isAdding ? "adding" : ""}`}
              onClick={quickAdd}
              disabled={product.stock <= 0 || isAdding}
            >
              {isAdding ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="shimmer-spinner"></span> ADDING...
                </span>
              ) : product.stock > 0 ? (
                <span className="flex items-center gap-2 justify-center">
                  <ShoppingBag size={14} /> QUICK ADD
                </span>
              ) : (
                "OUT OF STOCK"
              )}
            </button>
          </div>
        </div>

        <div className="luxury-product-info">
          <p className="card-category-label">{category}</p>
          <h3>{product.title}</h3>
          
          <div className="product-rating-row" aria-label="Rated 4.9 out of 5">
            <div className="stars-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={11} fill="currentColor" />
              ))}
            </div>
            <span>4.9</span>
          </div>

          <div className="product-price-row">
            <strong className="current-price">₹{product.price.toLocaleString("en-IN")}</strong>
            {product.compare_at_price && <span className="compare-price">₹{product.compare_at_price.toLocaleString("en-IN")}</span>}
          </div>
          
          <p className={product.stock > 0 ? "stock-good" : "stock-out"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}

