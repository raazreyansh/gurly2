'use client'

import { useWishlistStore } from '@/store/useWishlistStore'
import { useCartStore } from '@/store/useCartStore'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem, openCart } = useCartStore()
  
  // Prevent hydration mismatches by rendering client-side only
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white text-black pt-24 px-6 lg:px-20 select-none animate-pulse">
        <div className="max-w-[1600px] mx-auto">
          <div className="h-16 bg-neutral-100 w-1/3 mb-10" />
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const handleAddToBag = (item: any) => {
    addItem({
      id: item.id,
      title: item.title,
      image: item.image,
      quantity: 1,
      price: item.price,
    })
    openCart()
  }

  return (
    <div className="min-h-screen bg-white text-black pt-24 px-6 lg:px-20 select-none">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="mb-16 border-b border-neutral-200 pb-10">
          <p className="mb-4 text-[9px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
            EDITORIAL CURATIONS
          </p>

          <h1 className="font-serif text-5xl lg:text-7xl uppercase text-black leading-tight">
            My Wishlist.
          </h1>
        </div>

        {/* Content Body Grid */}
        {items.length === 0 ? (
          <div className="py-24 text-center border border-neutral-200 bg-[#FBFBF9] flex flex-col justify-center items-center gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">Your curation list is empty</p>
              <p className="text-xs text-neutral-400 mt-2">Elevate your closet with our custom gold sets and jhumkas.</p>
            </div>
            
            <Link 
              href="/shop"
              className="bg-black text-white px-10 py-4.5 text-[10px] tracking-[0.3em] font-bold uppercase hover:opacity-85 transition"
            >
              Shop All
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {items.map((item) => (
              <div 
                key={item.id}
                className="group flex flex-col bg-white border border-neutral-200 p-4 transition hover:border-black"
              >
                {/* Media representation */}
                <Link href={`/product/${item.slug}`} className="relative aspect-[3/4] overflow-hidden bg-neutral-50 border border-neutral-100 block">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-700 group-hover:scale-103"
                  />
                </Link>

                {/* Descriptors */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono font-bold text-neutral-500">
                    ₹{item.price.toLocaleString()}
                  </p>
                </div>

                {/* Grid controls */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => handleAddToBag(item)}
                    className="w-full bg-black py-3 text-[10px] font-bold tracking-widest text-white uppercase hover:opacity-85 transition"
                  >
                    Add to Bag
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-full border border-neutral-200 py-3 text-[10px] font-bold tracking-widest text-neutral-400 uppercase hover:border-red-600 hover:text-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
