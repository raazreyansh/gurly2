"use client"

import { motion } from "framer-motion"
import { Heart, ShoppingBag, Sparkles, Star } from "lucide-react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const { add } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isFav, setIsFav] = useState(false)

  if (loading || !product) {
    return (
      <div className="luxury-product-card luxury-product-card-loading">
        <div className="luxury-product-media animate-pulse" />
        <div className="luxury-product-info">
          <div className="h-3 w-2/3 rounded-full bg-black/10 animate-pulse" />
          <div className="h-3 w-1/3 rounded-full bg-black/10 animate-pulse" />
        </div>
      </div>
    )
  }

  const currentProduct = product
  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700"
  const hoverImage = product.images?.[1] ?? image
  const productPath = product.slug ? `/product/${product.slug}` : `/product/${product.id}`
  const onSale = typeof product.compare_at_price === "number" && product.compare_at_price > product.price

  function quickAdd(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsAdding(true)
    setTimeout(() => {
      add({ productId: currentProduct.id, title: currentProduct.title, price: currentProduct.price, quantity: 1, image })
      toast.success("Added to bag")
      setIsAdding(false)
    }, 350)
  }

  function toggleFav(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    setIsFav((value) => !value)
    toast.success(isFav ? "Removed from wishlist" : "Saved to wishlist")
  }

  return (
    <motion.article
      className="luxury-product-card"
      role="link"
      tabIndex={0}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(productPath)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          router.push(productPath)
        }
      }}
    >
      <div aria-label={product.title} className="luxury-product-link">
        <div className="luxury-product-media">
          <img
            src={image}
            alt={product.title}
            loading={priority ? "eager" : "lazy"}
            className="product-primary-image"
          />
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            className="product-secondary-image"
          />

          <div className="product-card-badges">
            {product.featured && (
              <span className="badge-featured">
                <Sparkles size={10} /> New
              </span>
            )}
            {onSale && (
              <span className="badge-sale">
                Sale
              </span>
            )}
          </div>
        </div>

        <div className="luxury-product-info">
          <p className="card-category-label">{product.categories?.name ?? "Girls Accessories"}</p>
          <h3>{product.title}</h3>
          <div className="product-rating-row">
            <div className="stars-wrap">
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
              <Star size={11} fill="currentColor" />
            </div>
            <span>4.9</span>
          </div>
          <div className="product-price-row">
            <strong className="current-price">Rs. {product.price.toLocaleString("en-IN")}</strong>
            {onSale && product.compare_at_price && <span className="compare-price">Rs. {product.compare_at_price.toLocaleString("en-IN")}</span>}
          </div>
        </div>
      </div>

      <div className="quick-add-container">
        <button
          id={`cart-${product.id}`}
          type="button"
          onClick={quickAdd}
          disabled={product.stock <= 0 || isAdding}
          className={`premium-quick-add-btn ${isAdding ? "adding" : ""}`}
        >
          <ShoppingBag size={12} />
          {isAdding ? "Adding..." : product.stock > 0 ? "Quick Add" : "Sold Out"}
        </button>
      </div>

      <button
        type="button"
        onClick={toggleFav}
        aria-label="Wishlist"
        className={`wishlist-heart-btn ${isFav ? "active" : ""}`}
      >
        <Heart size={13} fill={isFav ? "currentColor" : "none"} />
      </button>
    </motion.article>
  )
}
