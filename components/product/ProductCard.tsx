'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { ShoppingBag } from 'lucide-react'
import { getPrimaryProductImage } from '@/lib/product-media'

export interface SimpleProduct {
  id: string
  title: string
  slug: string
  price: string | number
  compareAtPrice?: string | number | null
  images?: any
  media?: any
}

interface ProductCardProps {
  product: SimpleProduct
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addItem } = useCartStore()
  const [loaded, setLoaded] = useState(false)

  const imageSrc = getPrimaryProductImage(product.media || product.images)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      title: product.title,
      image: imageSrc,
      price: Number(product.price),
    })
  }

  return (
    <div className="group block bg-white">
      <Link href={`/product/${product.slug || ''}`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-neutral-50 relative border border-neutral-100">
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-50 to-neutral-100/80 animate-pulse flex items-center justify-center select-none">
              <span className="text-[7px] font-mono tracking-[0.25em] text-neutral-300 uppercase">GURLY STUDIO</span>
            </div>
          )}

          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            src={imageSrc}
            alt={product.title}
            onLoad={() => setLoaded(true)}
            className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Quick Add To Cart Button overlay */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-sm text-white py-3 text-[10px] tracking-[0.2em] uppercase font-semibold opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2 hover:bg-black"
          >
            <ShoppingBag className="h-3 w-3" /> Quick Add
          </button>
        </div>

        <div className="space-y-1.5 pt-4 pb-2 px-1">
          <h3 className="text-xs tracking-wider uppercase font-semibold text-black leading-tight">
            {product.title}
          </h3>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold font-mono text-black">
              ₹{Number(product.price).toLocaleString()}
            </span>

            {product.compareAtPrice && (
              <span className="text-neutral-400 font-mono line-through">
                ₹{Number(product.compareAtPrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
