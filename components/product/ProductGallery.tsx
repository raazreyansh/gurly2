'use client'

import Image from 'next/image'
import { useState } from 'react'

interface MediaItem {
  type: string
  url: string
}

export default function ProductGallery({
  product,
}: {
  product: {
    title: string
    images: any
  }
}) {
  // Parse images securely allowing backward compatibility for strings
  const rawImages = Array.isArray(product.images) ? product.images : []
  const mediaItems: MediaItem[] = rawImages.map((item: any) => {
    if (typeof item === 'string') {
      return { type: 'image', url: item }
    }
    if (item && typeof item === 'object' && item.url) {
      return { type: item.type || 'image', url: item.url }
    }
    return { type: 'image', url: '/images/models/community_2.png' }
  })

  if (mediaItems.length === 0) {
    mediaItems.push({ type: 'image', url: '/images/models/community_2.png' })
  }

  const [active, setActive] = useState<MediaItem>(mediaItems[0] || { type: 'image', url: '/images/models/community_2.png' })

  return (
    <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 p-6 lg:p-12 bg-white">
      
      {/* Side Thumbnails Column */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 select-none scrollbar-none">
        {mediaItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActive(item)}
            className={`relative aspect-[3/4] w-full overflow-hidden border transition bg-[#F5F5F3] ${
              active.url === item.url 
                ? 'border-black ring-1 ring-black' 
                : 'border-neutral-200 hover:border-black'
            }`}
          >
            {item.type === 'image' && (
              <Image
                src={item.url}
                alt=""
                fill
                sizes="(max-width: 120px) 100vw, 120px"
                className="object-cover"
              />
            )}

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                Video
              </div>
            )}

            {item.type === 'pdf' && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-[9px] font-black text-red-600 uppercase tracking-widest">
                PDF
              </div>
            )}

            {item.type === 'zip' && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50 text-[9px] font-black text-blue-600 uppercase tracking-widest">
                ZIP
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Focus Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F3] border border-neutral-200 select-none flex items-center justify-center">
        
        {active.type === 'image' && (
          <Image
            src={active.url}
            alt={product.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-700 hover:scale-105"
          />
        )}

        {active.type === 'video' && (
          <video
            src={active.url}
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        )}

        {active.type === 'pdf' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 p-8 text-center select-none border border-neutral-200/50">
            <span className="text-xs font-black tracking-[0.2em] text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 uppercase mb-4">
              PDF Catalog Document
            </span>
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white px-8 py-4 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-neutral-900 transition"
            >
              View Full PDF
            </a>
          </div>
        )}

        {active.type === 'zip' && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 p-8 text-center select-none border border-neutral-200/50">
            <span className="text-xs font-black tracking-[0.2em] text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 uppercase mb-4">
              ZIP Campaign Assets
            </span>
            <a
              href={active.url}
              download
              className="bg-black text-white px-8 py-4 text-[10px] tracking-[0.25em] font-bold uppercase hover:bg-neutral-900 transition"
            >
              Download ZIP
            </a>
          </div>
        )}
      </div>

    </div>
  )
}
