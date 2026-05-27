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
    body: "Premium plated finish, skin-friendly polish, and smooth edges. Store separately in the GURLY pouch and wipe gently after wear.",
  },
  {
    title: "Shipping and returns",
    body: "Fast dispatch, free shipping over ₹999, and a 7-day return window for unused accessories in original packaging.",
  },
  {
    title: "Gift packaging",
    body: "Every order arrives in a soft luxury wrap with gift-ready presentation for birthdays, bridesmaids, and everyday surprises.",
  },
]

export function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState("Materials and care")
  const [isAdding, setIsAdding] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const { add } = useCart()

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
      toast.success(`${quantity} x ${product.title} added to bag`, {
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

  function toggleFavorite() {
    const nextState = !isFavorite
    setIsFavorite(nextState)
    if (nextState) {
      toast.success("Added to wishlist", { icon: "💖" })
    } else {
      toast.info("Removed from wishlist")
    }
  }

  return (
    <div className="product-detail-shell">
      <div className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span className="breadcrumb-active">{product.title}</span>
      </div>

      <section className="product-detail-layout">
        <div data-testid="product-gallery" className="luxury-product-gallery">
          <div className="product-thumb-column">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={activeImage === index ? "active" : ""}
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="product-main-image-wrap">
            <motion.div 
              className="product-main-image" 
              initial={{ opacity: 0.7, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              key={currentImage}
            >
              <img src={currentImage} alt={product.title} loading="eager" className="detail-zoom-img" />
              {discount > 0 && <span className="detail-sale-badge">{discount}% OFF</span>}
            </motion.div>
          </div>
        </div>

        <aside data-testid="sticky-buy-panel" className="sticky-buy-panel">
          <p className="store-label">{product.categories?.name ?? "Girls Accessories"}</p>
          <h1>{product.title}</h1>
          
          <div className="detail-rating">
            <div className="stars-wrap">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={13} fill="currentColor" />
              ))}
            </div>
            <span>4.9 rating (128 reviews)</span>
          </div>

          <div className="detail-price-row">
            <strong className="detail-current-price">₹{product.price.toLocaleString("en-IN")}</strong>
            {product.compare_at_price && <span className="detail-compare-price">₹{product.compare_at_price.toLocaleString("en-IN")}</span>}
          </div>

          {product.description && <p className="detail-description">{product.description}</p>}

          {/* Luxury Urgency Indicators */}
          <div className="detail-stock-row">
            {product.stock > 0 ? (
              product.stock <= 5 ? (
                <span className="urgency-pill animate-pulse">
                  <span className="urgency-dot bg-rose" /> Only {product.stock} left in stock — selling fast!
                </span>
              ) : (
                <span className="urgency-pill stock-available">
                  <span className="urgency-dot bg-emerald" /> {product.stock} in stock
                </span>
              )
            ) : (
              <span className="urgency-pill stock-unavailable">
                <span className="urgency-dot bg-muted" /> Sold out
              </span>
            )}
            <span className="premium-label">Gift-ready dispatch</span>
          </div>

          <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "24px" }}>
            <div className="quantity-control" aria-label="Quantity">
              <button type="button" id="qty-minus" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" id="qty-plus" onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>

            <div className="detail-actions" style={{ flex: 1 }}>
              <button
                id="add-to-cart-btn"
                type="button"
                className={`store-button store-button-dark flex items-center justify-center gap-2 ${isAdding ? "adding" : ""}`}
                onClick={addToCart}
                disabled={product.stock <= 0 || isAdding}
                style={{ flex: 1 }}
              >
                {isAdding ? (
                  <>
                    <span className="shimmer-spinner"></span> ADDING...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> ADD TO BAG
                  </>
                )}
              </button>
              <button
                id="wishlist-btn"
                type="button"
                className={`wishlist-icon-btn ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill={isFavorite ? "var(--rose)" : "none"} stroke={isFavorite ? "var(--rose)" : "currentColor"} />
              </button>
              <button
                type="button"
                className="share-button"
                aria-label="Copy product link"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success("Product link copied", { icon: "🔗" })
                }}
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <div className="detail-trust-row">
            <span><Truck size={15} /> Free shipping over ₹999</span>
            <span><ShieldCheck size={15} /> Skin-friendly hypoallergenic finish</span>
          </div>

          <div className="product-accordions">
            {accordions.map((item) => {
              const open = openAccordion === item.title
              return (
                <div key={item.title} className="product-accordion">
                  <button type="button" onClick={() => setOpenAccordion(open ? "" : item.title)} aria-expanded={open}>
                    {item.title}
                    <motion.span animate={{ rotate: open ? 180 : 0 }}>
                      <ChevronDown size={17} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <p>{item.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="store-section product-recommendations" aria-labelledby="recommendations-heading">
          <div className="section-heading-row">
            <div>
              <p className="store-label">Styled together</p>
              <h2 id="recommendations-heading">Complete the Spark</h2>
            </div>
            <Link href="/shop" className="text-link">Shop all</Link>
          </div>
          <div className="bestseller-carousel">
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
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="md:hidden"
            style={{
              position: "fixed",
              bottom: "16px",
              left: "16px",
              right: "16px",
              zIndex: 99,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              borderRadius: "24px",
              padding: "12px 18px",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src={images[0]}
                alt=""
                style={{ width: "42px", height: "42px", borderRadius: "12px", objectFit: "cover" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#111111", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {product.title}
                </span>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "var(--charcoal)" }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={addToCart}
              disabled={product.stock <= 0 || isAdding}
              style={{
                background: "#07111f",
                color: "white",
                border: "none",
                borderRadius: "100px",
                padding: "10px 20px",
                fontSize: "11px",
                fontWeight: "800",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(7, 17, 31, 0.2)",
              }}
            >
              {isAdding ? "Adding..." : product.stock > 0 ? "Add to Bag" : "Sold Out"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
