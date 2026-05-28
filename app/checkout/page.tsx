"use client"

import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import AddressForm from '@/components/checkout/AddressForm'
import PaymentMethods from '@/components/checkout/PaymentMethods'
import OrderSummary from '@/components/checkout/OrderSummary'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const [address, setAddress] = useState<any>(null)
  const [payment, setPayment] = useState<string>('card')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { items, clearCart, getCartTotal } = useCartStore()

  async function placeOrder() {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setLoading(true)
    try {
      const payload = {
        userId: null,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price })),
        address,
        payment: { provider: payment, amount: getCartTotal(), status: 'pending' }
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to place order')
        setLoading(false)
        return
      }

      clearCart()
      router.push(`/order/success`)
    } catch (err) {
      console.error(err)
      toast.error('Server error placing order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h1 className="font-serif text-3xl text-black mb-6">Checkout</h1>

            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-4">Shipping Address</h3>
              <AddressForm onChange={(d) => setAddress(d)} />
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-4">Payment</h3>
              <PaymentMethods onSelect={(m) => setPayment(m)} />
            </section>
          </div>

          <aside className="lg:col-span-5">
            <OrderSummary />
            <button onClick={placeOrder} disabled={loading} className="mt-6 w-full bg-black text-white py-3 rounded-md uppercase tracking-widest font-semibold hover:opacity-80 transition-opacity">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </aside>
        </div>
      </main>
    </StorefrontLayout>
  )
}
