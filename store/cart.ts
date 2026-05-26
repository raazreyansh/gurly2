"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  productId: string
  title: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string) => void
  update: (productId: string, quantity: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (item) => {
        const current = get().items
        const exists = current.find((i) => i.productId === item.productId)
        if (exists) {
          set({
            items: current.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          })
          return
        }
        set({ items: [...current, item] })
      },

      remove: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      update: (productId, quantity) => {
        if (quantity <= 0) {
          get().remove(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })
      },

      clear: () => set({ items: [] }),

      total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      count: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: "gurly-cart" }
  )
)
