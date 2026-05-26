"use client"

import Link from "next/link"
import { Heart, ShoppingBag, Star } from "lucide-react"
import { Product } from "@/types/database"
import { useCart } from "@/store/cart"
import { toast } from "sonner"

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { add } = useCart()
  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600"
  const image2 = product.images?.[1] ?? image
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    add({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image,
    })
    toast.success(`${product.title} added to cart`)
  }

  return (
    <Link href={`/product/${product.slug ?? product.id}`} className="card" style={{ display: "block" }}>
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: "var(--cream-dark)" }}>
        <img
          src={image}
          alt={product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.5s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.src = image2; e.currentTarget.style.transform = "scale(1.05)" }}
          onMouseLeave={(e) => { e.currentTarget.src = image; e.currentTarget.style.transform = "scale(1)" }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {product.featured && (
            <span style={{
              background: "var(--charcoal)",
              color: "var(--white)",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              padding: "3px 8px",
              borderRadius: "2px",
              textTransform: "uppercase",
            }}>
              Featured
            </span>
          )}
          {discount && (
            <span style={{
              background: "var(--rose)",
              color: "var(--white)",
              fontSize: "10px",
              fontWeight: "600",
              padding: "3px 8px",
              borderRadius: "2px",
            }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Action Buttons (hover) */}
        <div style={{
          position: "absolute",
          bottom: "12px",
          right: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
          className="product-actions"
        >
          <button
            id={`wishlist-${product.id}`}
            aria-label="Add to wishlist"
            onClick={(e) => { e.preventDefault(); toast.success("Added to wishlist") }}
            style={{
              width: "36px",
              height: "36px",
              background: "var(--white)",
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <Heart size={14} color="var(--charcoal)" />
          </button>
          <button
            id={`cart-${product.id}`}
            aria-label="Add to cart"
            onClick={handleAddToCart}
            style={{
              width: "36px",
              height: "36px",
              background: "var(--rose)",
              border: "none",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "var(--shadow-rose)",
              cursor: "pointer",
            }}
          >
            <ShoppingBag size={14} color="var(--white)" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: "11px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
          {(product as Product & { categories?: { name: string } }).categories?.name ?? "Jewellery"}
        </p>
        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "15px", fontWeight: "400", marginBottom: "10px", color: "var(--charcoal)" }}>
          {product.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="price">₹{product.price.toLocaleString("en-IN")}</span>
          {product.compare_at_price && (
            <span className="price-compare">₹{product.compare_at_price.toLocaleString("en-IN")}</span>
          )}
          {discount && <span className="price-discount">{discount}% off</span>}
        </div>

        {/* Stars */}
        <div style={{ display: "flex", gap: "2px", marginTop: "8px" }}>
          {[1,2,3,4,5].map((s) => (
            <Star key={s} size={10} fill={s <= 4 ? "var(--rose)" : "none"} color={s <= 4 ? "var(--rose)" : "var(--border)"} />
          ))}
          <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "4px" }}>(24)</span>
        </div>
      </div>

      <style>{`
        .card:hover .product-actions { opacity: 1 !important; }
      `}</style>
    </Link>
  )
}
