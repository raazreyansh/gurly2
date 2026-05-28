'use client'

import Link from 'next/link'
import Image from 'next/image'
import { type Product } from '@/types/database'
import { useCartStore } from '@/store/useCartStore'
import { ShoppingBag } from 'lucide-react'

export function ProductCard({ product, priority = false }: { product: Product, priority?: boolean }) {
  const { addItem } = useCartStore()

  const imageUrl = product.images?.[0] || '/product.png'

  return (
    <div className="group block relative w-full">
      
      <Link href={`/product/${product.slug}`} className="block relative w-full bg-[#fcfcfc] overflow-hidden aspect-[3/4]">
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {product.compare_at_price && (
          <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-semibold px-2 py-1 uppercase tracking-widest">
            Sale
          </div>
        )}
      </Link>

      <div className="mt-4 flex flex-col gap-1 items-start">
        <Link href={`/product/${product.slug}`} className="hover:opacity-70 transition-opacity">
          <h3 className="font-sans text-sm font-medium text-black line-clamp-1">{product.title}</h3>
        </Link>
        
        <div className="flex items-center gap-2">
          <p className="font-sans text-sm text-neutral-500">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          {product.compare_at_price && (
            <p className="font-sans text-xs text-neutral-300 line-through">
              ₹{product.compare_at_price.toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => addItem(product)}
        className="absolute bottom-20 right-3 bg-white text-black p-3 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Add to cart"
      >
        <ShoppingBag size={16} />
      </button>

    </div>
  )
}
