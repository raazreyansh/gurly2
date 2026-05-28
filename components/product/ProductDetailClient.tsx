'use client'

import { type Product } from '@/types/database'
import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/useCartStore'
import { ProductCard } from './ProductCard'

export function ProductDetailClient({ product, related }: { product: Product, related: Product[] }) {
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="bg-white min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          
          <div>
            <div className="relative aspect-[4/5] w-full bg-[#fcfcfc] mb-4">
              <Image
                src={product.images?.[selectedImage] || '/product-large.png'}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 flex-shrink-0 transition-opacity ${selectedImage === i ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                  >
                    <Image 
                      src={img} 
                      alt={`${product.title} - ${i+1}`} 
                      fill
                      className="object-cover bg-[#fcfcfc]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-serif text-4xl lg:text-5xl text-black mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <p className="font-sans text-xl text-black font-medium">
                Rs. {product.price.toLocaleString('en-IN')}
              </p>
              {product.compare_at_price && (
                <p className="font-sans text-lg text-neutral-400 line-through">
                  Rs. {product.compare_at_price.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <p className="text-neutral-600 text-sm leading-relaxed mb-10 max-w-md">
              {product.description || "A premium piece designed for everyday elegance and effortless styling."}
            </p>

            <button
              onClick={() => addItem(product)}
              className="w-full bg-black text-white py-4 uppercase tracking-[0.15em] text-xs font-semibold hover:opacity-80 transition"
            >
              Add to Bag
            </button>

            <div className="mt-12 space-y-6 text-sm text-neutral-500 border-t border-neutral-100 pt-8">
              <div className="flex justify-between border-b border-neutral-100 pb-4">
                <span className="font-medium text-black">Material</span>
                <span>Premium Brass / 18k Plated</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-4">
                <span className="font-medium text-black">Shipping</span>
                <span>Dispatches in 24 hours</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-4">
                <span className="font-medium text-black">Returns</span>
                <span>7-day easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-neutral-100 pt-20">
            <h2 className="font-serif text-3xl text-black mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
