import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Product } from '@/types/database'

type WishlistState = {
  items: Product[]
  toggle: (product: Product) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const exists = get().items.find((p) => p.id === product.id)
        if (exists) {
          set((state) => ({ items: state.items.filter((p) => p.id !== product.id) }))
        } else {
          set((state) => ({ items: [...state.items, product] }))
        }
      },
      remove: (productId) => set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),
      has: (productId) => !!get().items.find((p) => p.id === productId),
    }),
    { name: 'gurly-wishlist' }
  )
)

export default useWishlistStore
