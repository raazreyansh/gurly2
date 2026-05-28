import { create } from 'zustand'

export interface CartItem {
  id: string
  title: string
  image: string
  quantity: number
  price: number
}

interface CartState {
  isOpen: boolean
  items: CartItem[]
  toggleCart: () => void
  closeCart: () => void
  openCart: () => void
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  items: [],

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  closeCart: () =>
    set({
      isOpen: false,
    }),

  openCart: () =>
    set({
      isOpen: true,
    }),

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i
          ),
          isOpen: true,
        }
      }
      return {
        items: [...state.items, { ...item, quantity: item.quantity ?? 1 }],
        isOpen: true,
      }
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  updateQuantity: (id, qty) =>
    set((state) => ({
      items: state.items
        .map((i) => (i.id === id ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () =>
    set({
      items: [],
    }),
}))
