'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { ShoppingBag } from 'lucide-react'

export interface SimpleProduct {
  id: string
  title: string
  slug: string
  price: string | number
  compareAtPrice?: string | number | null
  images: any
}

interface ProductCardProps {
  product: SimpleProduct
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { addItem } = useCartStore()

  // Safe extraction of the first image
  let imageSrc = '/images/models/community_2.png'
  if (Array.isArray(product.images) && product.images.length > 0) {
    imageSrc = product.images[0]
  } else if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images)
      if (Array.isArray(parsed) && parsed.length > 0) {
        imageSrc = parsed[0]
      }
    } catch {
      imageSrc = product.images
    }
  }

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
      <Link href={`/shop`} className="block">
        <div className="aspect-[3/4] overflow-hidden bg-neutral-50 relative border border-neutral-100">
          <motion.img
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            src={imageSrc}
            alt={product.title}
            className="h-full w-full object-cover"
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
