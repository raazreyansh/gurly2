"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingBag } from "lucide-react"
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
  const [isAdding, setIsAdding] = useState(false)
  const [isFav, setIsFav] = useState(false)

  if (loading || !product) {
    return (
      <div className="group">
        <div className="aspect-square w-full bg-[#F2F2F2] animate-pulse" />
        <div className="mt-3 space-y-1.5">
          <div className="h-3 w-2/3 bg-[#F2F2F2] animate-pulse" />
          <div className="h-3 w-1/3 bg-[#F2F2F2] animate-pulse" />
        </div>
      </div>
    )
  }

  const image = product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700"
  const hoverImage = product.images?.[1] ?? image
  const productPath = product.slug ? `/product/${product.slug}` : `/product/${product.id}`

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsAdding(true)
    setTimeout(() => {
      add({ productId: product!.id, title: product!.title, price: product!.price, quantity: 1, image })
      toast.success("Added", { duration: 1200 })
      setIsAdding(false)
    }, 400)
  }

  function toggleFav(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsFav((v) => !v)
  }

  return (
    <motion.article
      className="group cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={productPath} aria-label={product.title}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
          <img
            src={image}
            alt={product.title}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* Hover Actions */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-end justify-between translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              id={`cart-${product.id}`}
              type="button"
              onClick={quickAdd}
              disabled={product.stock <= 0 || isAdding}
              className="flex-1 mr-2 py-2.5 bg-black hover:bg-neutral-800 text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={11} />
              {isAdding ? "..." : product.stock > 0 ? "Add" : "Sold Out"}
            </button>
            <button
              type="button"
              onClick={toggleFav}
              className="w-9 h-9 bg-white flex items-center justify-center transition-colors hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart size={13} fill={isFav ? "black" : "none"} stroke="black" />
            </button>
          </div>

          {/* New badge */}
          {product.featured && (
            <span className="absolute top-2.5 left-2.5 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <p className="text-[12px] font-semibold text-black leading-snug truncate">{product.title}</p>
          <div className="text-right shrink-0">
            <p className="text-[12px] font-bold text-black">₹{product.price.toLocaleString("en-IN")}</p>
            {product.compare_at_price && (
              <p className="text-[10px] text-black/40 line-through">₹{product.compare_at_price.toLocaleString("en-IN")}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
