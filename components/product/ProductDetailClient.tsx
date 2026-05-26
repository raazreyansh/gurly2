"use client"

import { useState } from "react"
import { useCart } from "@/store/cart"
import { Product } from "@/types/database"
import { toast } from "sonner"
import { ShoppingBag, Heart, Share2, Star, ChevronLeft, ChevronRight, Truck, RefreshCw, Shield } from "lucide-react"
import Link from "next/link"

interface Props {
  product: Product
  related: Product[]
}

export function ProductDetailClient({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const { add } = useCart()

  const images = product.images?.length ? product.images : [
    "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800"
  ]

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      add({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        image: images[0],
      })
    }
    toast.success(`${qty}× ${product.title} added to cart`)
  }

  return (
    <div className="container" style={{ padding: "48px 24px 80px" }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "32px", display: "flex", gap: "8px", alignItems: "center" }}>
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/shop">Shop</Link>
        <span>/</span>
        <span style={{ color: "var(--charcoal)" }}>{product.title}</span>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px" }} className="lg:grid-cols-2">
        {/* Image Gallery */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  style={{
                    width: "72px",
                    height: "90px",
                    border: `2px solid ${activeImage === i ? "var(--rose)" : "var(--border)"}`,
                    borderRadius: "2px",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                    transition: "border-color 0.2s",
                  }}
                >
                  <img src={img} alt={`View ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div style={{ flex: 1, position: "relative", aspectRatio: "4/5", overflow: "hidden", borderRadius: "4px", background: "var(--cream-dark)" }}>
            <img
              src={images[activeImage]}
              alt={product.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                  style={{
                    position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                  style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
            {discount && (
              <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                <span style={{ background: "var(--rose)", color: "var(--white)", padding: "4px 10px", fontSize: "12px", fontWeight: "600", borderRadius: "2px" }}>
                  -{discount}% OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>
            {(product as Product & { categories?: { name: string } }).categories?.name ?? "Jewellery"}
          </p>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: "400", lineHeight: "1.2", marginBottom: "16px" }}>
            {product.title}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={14} fill={s <= 4 ? "var(--rose)" : "none"} color={s <= 4 ? "var(--rose)" : "var(--border)"} />
              ))}
            </div>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>4.8 (24 reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", color: "var(--charcoal)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.compare_at_price && (
              <span className="price-compare" style={{ fontSize: "18px" }}>₹{product.compare_at_price.toLocaleString("en-IN")}</span>
            )}
            {discount && <span className="price-discount">{discount}% off</span>}
          </div>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--charcoal-light)", marginBottom: "32px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
              {product.description}
            </p>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Quantity</p>
            <div style={{ display: "flex", alignItems: "center", border: "1.5px solid var(--border)", borderRadius: "2px", width: "fit-content" }}>
              <button
                id="qty-minus"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--charcoal)" }}
              >
                −
              </button>
              <span style={{ width: "44px", textAlign: "center", fontSize: "15px", fontWeight: "500" }}>{qty}</span>
              <button
                id="qty-plus"
                onClick={() => setQty((q) => q + 1)}
                style={{ width: "44px", height: "44px", background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--charcoal)" }}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "32px", flexWrap: "wrap" }}>
            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              className="btn btn-primary"
              style={{ flex: 1, minWidth: "200px", gap: "10px" }}
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
            <button
              id="wishlist-btn"
              onClick={() => toast.success("Added to wishlist")}
              className="btn btn-outline"
              style={{ gap: "8px" }}
            >
              <Heart size={15} /> Wishlist
            </button>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!") }}
              style={{ width: "44px", height: "44px", border: "1.5px solid var(--border)", borderRadius: "2px", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--charcoal-light)" }}
            >
              <Share2 size={14} />
            </button>
          </div>

          {/* Trust Badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
            {[
              { Icon: Truck, text: "Free shipping on orders above ₹999" },
              { Icon: RefreshCw, text: "7-day easy returns" },
              { Icon: Shield, text: "100% authentic & quality guaranteed" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Icon size={16} color="var(--rose)" />
                <span style={{ fontSize: "13px", color: "var(--charcoal-light)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div style={{ marginTop: "80px" }}>
          <p className="section-subtitle">You might also love</p>
          <h2 className="section-title" style={{ marginBottom: "32px" }}>Related Products</h2>
          <div className="product-grid">
            {related.slice(0, 4).map((p) => (
              <a key={p.id} href={`/product/${p.slug ?? p.id}`} className="card" style={{ display: "block" }}>
                <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--cream-dark)" }}>
                  <img
                    src={p.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"}
                    alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "14px" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: "400", marginBottom: "6px" }}>{p.title}</h3>
                  <span className="price">₹{p.price.toLocaleString("en-IN")}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
