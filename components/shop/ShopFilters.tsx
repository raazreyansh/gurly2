'use client'

import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { type Category } from '@/types/database'
import { useState } from 'react'

export function ShopFilters({ categories = [], active = '' }: { categories: Category[]; active?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [open, setOpen] = useState(true)

  function setSort(value: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (value) params.set('sort', value)
    else params.delete('sort')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <aside className="w-full lg:w-72">
      <div className="sticky top-28">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold">Filters</h4>
          <button onClick={() => setOpen(!open)} className="text-xs text-neutral-500">{open ? 'Hide' : 'Show'}</button>
        </div>

        {open && (
          <div className="space-y-6">
            <div>
              <h5 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Category</h5>
              <div className="flex flex-col gap-2">
                <Link href="/shop" className={`text-sm ${!active ? 'font-semibold text-black' : 'text-neutral-600'}`}>All</Link>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`} className={`text-sm ${active === cat.slug ? 'font-semibold text-black' : 'text-neutral-600'}`}>{cat.name}</Link>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Sort</h5>
              <select onChange={(e) => setSort(e.target.value)} defaultValue={searchParams.get('sort') ?? ''} className="w-full border border-neutral-200 rounded-md px-3 py-2 text-sm">
                <option value="">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div>
              <h5 className="text-xs uppercase tracking-widest text-neutral-500 mb-3">Price</h5>
              <div className="flex gap-2">
                <input placeholder="Min" className="w-1/2 border border-neutral-200 rounded-md px-3 py-2 text-sm" />
                <input placeholder="Max" className="w-1/2 border border-neutral-200 rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default ShopFilters
