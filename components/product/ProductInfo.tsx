'use client'

import { Heart, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useWishlistStore } from '@/store/useWishlistStore'

export default function ProductInfo({
  product,
}: {
  product: {
    id: string
    title: string
    slug: string | null
    price: any
    compareAtPrice: any
    description: string | null
    images: any
    material: string | null
    plating: string | null
    gemstone: string | null
    antiTarnish: boolean
    waterproof: boolean
    hypoallergenic: boolean
    handcrafted: boolean
    shippingDays: number
    stock: number
  }
}) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const hasItem = useWishlistStore((s) => s.hasItem)
  const addWishItem = useWishlistStore((s) => s.addItem)
  const removeWishItem = useWishlistStore((s) => s.removeItem)

  const wishlisted = hasItem(product.id)

  const imageArray = Array.isArray(product.images) ? product.images : []
  const firstImage = (imageArray[0] as string) || '/images/models/community_2.png'

  const toggleWishlist = () => {
    if (wishlisted) {
      removeWishItem(product.id)
    } else {
      addWishItem({
        id: product.id,
        title: product.title,
        slug: product.slug || '',
        price: Number(product.price),
        image: firstImage,
      })
    }
  }

  const addToBag = () => {
    if (product.stock === 0) return

    addItem({
      id: product.id,
      title: product.title,
      image: firstImage,
      quantity: 1,
      price: Number(product.price),
    })

    openCart()
  }

  return (
    <div className="px-8 py-10 lg:px-16 lg:py-20 bg-white text-black h-full flex flex-col justify-center">
      {/* Editorial tag */}
      <p className="mb-4 text-[9px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
        GURLY EDITORIAL JEWELLERY
      </p>

      {/* Main Title */}
      <h1 className="font-serif text-4xl lg:text-5xl text-black leading-tight uppercase">
        {product.title}
      </h1>

      {/* Financial info */}
      <div className="mt-6 flex items-baseline gap-4 border-b border-neutral-100 pb-6">
        <span className="text-2xl font-semibold font-mono text-black">
          ₹{Number(product.price).toLocaleString()}
        </span>

        {product.compareAtPrice && (
          <span className="text-neutral-400 line-through font-mono text-base font-medium">
            ₹{Number(product.compareAtPrice).toLocaleString()}
          </span>
        )}
      </div>

      {/* Specs Panel */}
      <div className="mt-8 grid grid-cols-2 gap-y-4 gap-x-8 border-b border-neutral-100 pb-8 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
        {product.material && (
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-neutral-400 font-bold tracking-[0.2em]">Material</span>
            <span className="text-black font-serif text-sm tracking-wide lowercase first-letter:uppercase">{product.material}</span>
          </div>
        )}

        {product.plating && (
          <div className="flex flex-col gap-1">
            <span className="text-[8px] text-neutral-400 font-bold tracking-[0.2em]">Plating</span>
            <span className="text-black font-serif text-sm tracking-wide lowercase first-letter:uppercase">{product.plating}</span>
          </div>
        )}

        {product.gemstone && product.gemstone !== 'None' && (
          <div className="flex flex-col gap-1 col-span-2">
            <span className="text-[8px] text-neutral-400 font-bold tracking-[0.2em]">Gemstone setting</span>
            <span className="text-black font-serif text-sm tracking-wide lowercase first-letter:uppercase">{product.gemstone}</span>
          </div>
        )}
      </div>

      {/* Trust & Spec checklists */}
      <div className="mt-8 space-y-3.5 border-b border-neutral-100 pb-8 text-[10px] tracking-[0.2em] font-bold text-neutral-600 uppercase">
        {product.antiTarnish && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-black flex-shrink-0" />
            <span>✓ Lifetime Anti-Tarnish Guarantee</span>
          </div>
        )}

        {product.waterproof && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-black flex-shrink-0" />
            <span>✓ 100% Waterproof & Shower-Safe</span>
          </div>
        )}

        {product.hypoallergenic && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-black flex-shrink-0" />
            <span>✓ Hypoallergenic (Nickel-free)</span>
          </div>
        )}

        {product.handcrafted && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-black flex-shrink-0" />
            <span>✓ Handcrafted by Indian Artisans</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-neutral-400 font-medium">
          <ShieldCheck className="h-4 w-4 text-neutral-400 flex-shrink-0" />
          <span>Ships in {product.shippingDays} working days</span>
        </div>
      </div>

      {/* Description copy */}
      <p className="mt-8 leading-8 text-neutral-500 font-medium text-xs tracking-wider border-b border-neutral-100 pb-8 uppercase">
        {product.description || 'No detailed specifications recorded for this collection item.'}
      </p>

      {/* Add / Action button row */}
      <div className="mt-10 flex gap-4">
        {product.stock === 0 ? (
          <button
            disabled
            className="flex-grow bg-neutral-100 py-5 text-xs font-semibold tracking-[0.35em] text-neutral-400 uppercase select-none border border-neutral-200"
          >
            OUT OF STOCK
          </button>
        ) : (
          <button
            onClick={addToBag}
            className="flex-grow bg-black py-5 text-xs font-semibold tracking-[0.35em] text-white uppercase hover:opacity-85 transition"
          >
            ADD TO BAG
          </button>
        )}

        <button 
          onClick={toggleWishlist}
          className={`grid h-15 w-15 place-items-center border transition ${
            wishlisted 
              ? 'bg-black border-black text-white' 
              : 'border-neutral-200 text-neutral-400 hover:border-black hover:text-black'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  )
}
