"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
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
    body: "Fast dispatch, free shipping over Rs. 999, and a 7-day return window for unused accessories in original packaging.",
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
  const { add } = useCart()
  const images = useMemo(
    () => (product.images?.length ? product.images : ["https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1000"]),
    [product.images]
  )
  const currentImage = images[activeImage] ?? images[0]
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0

  function addToCart() {
    for (let index = 0; index < quantity; index += 1) {
      add({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: images[0] ?? "",
      })
    }
    toast.success(`${quantity} x ${product.title} added to cart`)
  }

  return (
    <div className="product-detail-shell">
      <div className="product-breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span>{product.title}</span>
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

          <motion.div
            className="product-main-image"
            initial={{ opacity: 0.88 }}
            animate={{ opacity: 1 }}
            key={currentImage}
          >
            <img src={currentImage} alt={product.title} loading="eager" />
            {discount > 0 && <span>{discount}% off</span>}
          </motion.div>
        </div>

        <aside data-testid="sticky-buy-panel" className="sticky-buy-panel">
          <p className="store-label">{product.categories?.name ?? "Girls Accessories"}</p>
          <h1>{product.title}</h1>
          <div className="detail-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={15} fill="currentColor" />
            ))}
            <span>4.9 rating</span>
          </div>

          <div className="detail-price-row">
            <strong>Rs. {product.price.toLocaleString("en-IN")}</strong>
            {product.compare_at_price && <span>Rs. {product.compare_at_price.toLocaleString("en-IN")}</span>}
          </div>

          {product.description && <p className="detail-description">{product.description}</p>}

          <div className="detail-stock-row">
            <span>{product.stock > 0 ? `${product.stock} in stock` : "Sold out"}</span>
            <span>Gift-ready dispatch</span>
          </div>

          <div className="quantity-control" aria-label="Quantity">
            <button type="button" id="qty-minus" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
            <span>{quantity}</span>
            <button type="button" id="qty-plus" onClick={() => setQuantity((value) => value + 1)}>+</button>
          </div>

          <div className="detail-actions">
            <button id="add-to-cart-btn" type="button" className="store-button store-button-dark" onClick={addToCart}>
              <ShoppingBag size={16} /> Add to Bag
            </button>
            <button
              id="wishlist-btn"
              type="button"
              className="store-button store-button-light"
              onClick={() => toast.success("Added to wishlist")}
            >
              <Heart size={15} /> Wishlist
            </button>
            <button
              type="button"
              className="share-button"
              aria-label="Copy product link"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied")
              }}
            >
              <Share2 size={16} />
            </button>
          </div>

          <div className="detail-trust-row">
            <span><Truck size={15} /> Free shipping over Rs. 999</span>
            <span><ShieldCheck size={15} /> Skin-friendly finish</span>
          </div>

          <div className="product-accordions">
            {accordions.map((item) => {
              const open = openAccordion === item.title
              return (
                <div key={item.title} className="product-accordion">
                  <button type="button" onClick={() => setOpenAccordion(open ? "" : item.title)} aria-expanded={open}>
                    {item.title}
                    <ChevronDown size={17} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>{item.body}</motion.p>}
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
    </div>
  )
}
