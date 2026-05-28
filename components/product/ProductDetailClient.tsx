"use client"

import { type Product } from '@/types/database'
import { useState } from 'react'
import NextImage from '@/components/ui/NextImage'
import { useCartStore } from '@/store/useCartStore'
import { ProductCard } from './ProductCard'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

export function ProductDetailClient({ product, related }: { product: Product, related: Product[] }) {
  const { addItem } = useCartStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  return (
    <div className="bg-white min-h-screen pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-24">

          <div>
            <div className="relative w-full bg-[#fcfcfc] mb-4 rounded-xl overflow-hidden aspect-[4/5]">
              <button onClick={() => setZoomOpen(true)} className="absolute z-20 top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-md">
                View
              </button>
              <NextImage fill src={product.images?.[selectedImage] || '/product-large.png'} alt={product.title} />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 flex-shrink-0 transition-opacity rounded-md overflow-hidden ${selectedImage === i ? 'ring-2 ring-mutedGold' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <NextImage fill src={img} alt={`${product.title} - ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-28">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
              <h1 className="font-serif text-4xl lg:text-5xl text-brandBlack mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <p className="font-sans text-2xl text-brandBlack font-medium">₹ {product.price.toLocaleString('en-IN')}</p>
                {product.compare_at_price && <p className="font-sans text-lg text-neutral-400 line-through">₹ {product.compare_at_price.toLocaleString('en-IN')}</p>}
              </div>

              <p className="text-neutral-600 text-sm leading-relaxed mb-8 max-w-md">{product.description || 'A premium piece designed for everyday elegance and effortless styling.'}</p>

              <button onClick={() => addItem(product)} className="w-full bg-brandBlack text-white py-4 uppercase tracking-[0.15em] text-xs font-semibold rounded-md hover:opacity-90 transition">Add to Bag</button>

              <div className="mt-8 space-y-4 text-sm text-neutral-500">
                <div className="flex justify-between">
                  <span className="font-medium text-brandBlack">Material</span>
                  <span>Premium Brass / 18k Plated</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-brandBlack">Shipping</span>
                  <span>Dispatches in 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-brandBlack">Returns</span>
                  <span>7-day easy returns</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="border-t border-neutral-100 pt-20">
            <h2 className="font-serif text-3xl text-brandBlack mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {zoomOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80" onClick={() => setZoomOpen(false)}>
          <div className="relative w-[90%] max-w-4xl h-[80vh]">
            <NextImage fill src={product.images?.[selectedImage] || '/product-large.png'} alt={product.title} />
          </div>
        </div>
      )}
    </div>
  )
}
