'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ProductGallery({
  product,
}: {
  product: {
    title: string
    images: any
  }
}) {
  const images = Array.isArray(product.images) 
    ? (product.images as string[]) 
    : ['/images/models/community_2.png']

  const [active, setActive] = useState(images[0] || '/images/models/community_2.png')

  return (
    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 p-6 lg:p-12 bg-white">
      {/* Side Thumbnails Column */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 select-none scrollbar-none">
        {images.map((image) => (
          <button
            key={image}
            onClick={() => setActive(image)}
            className={`relative aspect-[3/4] w-full overflow-hidden border transition bg-[#F5F5F3] ${
              active === image 
                ? 'border-black ring-1 ring-black' 
                : 'border-neutral-200 hover:border-black'
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 120px) 100vw, 120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Focus Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-neutral-200 select-none">
        <Image
          src={active}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>
    </div>
  )
}
