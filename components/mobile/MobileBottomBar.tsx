'use client'

import Link from 'next/link'
import { House, Search, Heart, User } from 'lucide-react'
import { useSearchStore } from '@/store/useSearchStore'

export default function MobileBottomBar() {
  const openSearch = useSearchStore((s) => s.openSearch)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 backdrop-blur-xl lg:hidden text-black shadow-lg safe-bottom">
      <div className="grid grid-cols-4 items-center">
        
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 py-4 text-neutral-500 hover:text-black transition"
        >
          <House className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold tracking-widest uppercase">Home</span>
        </Link>

        {/* Search Trigger */}
        <button
          onClick={openSearch}
          className="flex flex-col items-center justify-center gap-1 py-4 text-neutral-500 hover:text-black transition cursor-pointer"
        >
          <Search className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold tracking-widest uppercase">Search</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className="flex flex-col items-center justify-center gap-1 py-4 text-neutral-500 hover:text-black transition"
        >
          <Heart className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold tracking-widest uppercase">Wishlist</span>
        </Link>

        {/* Account */}
        <Link
          href="/account"
          className="flex flex-col items-center justify-center gap-1 py-4 text-neutral-500 hover:text-black transition"
        >
          <User className="h-4.5 w-4.5" />
          <span className="text-[8px] font-bold tracking-widest uppercase">Account</span>
        </Link>

      </div>
    </div>
  )
}
