'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchStore } from '@/store/useSearchStore'
import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SearchDrawer() {
  const { isOpen, closeSearch } = useSearchStore()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ products: any[], categories: any[] }>({ products: [], categories: [] })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults({ products: [], categories: [] })
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] })
      return
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.products || data.categories) {
          setResults({
            products: data.products || [],
            categories: data.categories || []
          })
        }
      } catch (err) {
        console.error("Search fetch error:", err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleNavigate = (path: string) => {
    closeSearch()
    router.push(path)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-md"
          />

          {/* Drawer Drop-down */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="fixed left-0 right-0 top-0 z-50 bg-white border-b border-neutral-200 shadow-2xl p-6 md:p-12 max-h-[85vh] overflow-y-auto flex-shrink-0"
          >
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header Input bar */}
              <div className="flex items-center justify-between gap-4 border-b-2 border-black pb-4">
                <div className="flex items-center gap-3 flex-grow">
                  <Search className="h-5 w-5 text-neutral-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="SEARCH THE GURLY CATALOGUE..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full text-base md:text-xl font-serif text-black placeholder-neutral-300 focus:outline-none bg-transparent uppercase tracking-wider"
                  />
                </div>

                <button 
                  onClick={closeSearch}
                  className="text-neutral-400 hover:text-black transition text-xs font-mono uppercase tracking-widest p-1"
                >
                  ✕ Close
                </button>
              </div>

              {/* Loader */}
              {loading && (
                <div className="py-12 text-center text-xs tracking-widest text-neutral-400 font-bold uppercase animate-pulse">
                  searching collections...
                </div>
              )}

              {/* Results Grid */}
              {!loading && query.trim() !== '' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Matching categories */}
                  {results.categories.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
                        Matching Capsules
                      </h3>
                      <div className="flex flex-col gap-2">
                        {results.categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => handleNavigate(`/shop?category=${cat.slug}`)}
                            className="text-left text-xs font-semibold text-black uppercase tracking-wider hover:opacity-70 transition p-2 bg-neutral-50 border border-neutral-100"
                          >
                            {cat.name} Collection
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Products */}
                  <div className="md:col-span-2 space-y-4">
                    <h3 className="text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
                      Suggested Jewels
                    </h3>
                    
                    {results.products.length === 0 ? (
                      <div className="text-xs text-neutral-400 uppercase tracking-widest font-semibold py-4">
                        No matches found
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results.products.map((product) => {
                          const imageArray = Array.isArray(product.images) ? product.images : []
                          const firstImage = imageArray[0] || '/images/models/community_2.png'

                          return (
                            <button
                              key={product.id}
                              onClick={() => handleNavigate(`/product/${product.slug}`)}
                              className="flex gap-3 text-left hover:bg-neutral-50 transition border border-neutral-100 p-2 bg-white group w-full"
                            >
                              <div className="relative h-16 w-12 overflow-hidden bg-neutral-100 flex-shrink-0">
                                <Image
                                  src={firstImage}
                                  alt={product.title}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex flex-col justify-between py-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-black group-hover:opacity-75 transition">
                                  {product.title}
                                </span>
                                <span className="font-mono text-[10px] text-neutral-400 font-bold mt-1">
                                  ₹{Number(product.price).toLocaleString()}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pre-input tip */}
              {query.trim() === '' && (
                <div className="py-12 text-center flex flex-col justify-center items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-bold">
                    Looking for something special?
                  </p>
                  <p className="text-[10px] font-mono text-neutral-300 uppercase">
                    Try "Gold", "Diamond", "Earrings", or "Classic"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
