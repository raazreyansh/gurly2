'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/useCartStore'
import { ArrowRight, CreditCard, Landmark, Truck } from 'lucide-react'

export default function CheckoutForm() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pin: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Dynamically injects Razorpay SDK onto client viewport
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.18
    const shipping = subtotal > 999 ? 0 : 99
    const grandTotal = subtotal + tax + shipping

    try {
      // 1. CASH ON DELIVERY (COD) direct order placement
      if (paymentMethod === 'cod') {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: grandTotal,
            items: items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price
            }))
          })
        })

        if (res.ok) {
          clearCart()
          router.push('/order/success')
        } else {
          throw new Error("COD Order Placement Failed")
        }
        return
      }

      // 2. ONLINE PAYMENT via Razorpay Gateway
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        alert("Failed to load payment gateways. Please verify your connection.")
        setLoading(false)
        return
      }

      // Initialize server-side Razorpay Order ID
      const createOrderRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal })
      })

      if (!createOrderRes.ok) {
        throw new Error("Payment Gateway Order Creation Failed")
      }

      const rzpOrder = await createOrderRes.json()

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_Su0ajfrL2Gog3D',
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'GURLY.',
        description: 'Exquisite Luxury Accessories',
        order_id: rzpOrder.id,
        handler: async function (response: any) {
          // Cryptographically verify signatures on server
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })

          const verifyData = await verifyRes.json()

          if (verifyData.verified) {
            // Write order record dynamically into Supabase DB
            const finalRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                total: grandTotal,
                items: items.map(item => ({
                  productId: item.id,
                  quantity: item.quantity,
                  price: item.price
                }))
              })
            })

            if (finalRes.ok) {
              clearCart()
              router.push('/order/success')
            } else {
              alert("Payment captured but failed to save order record. Please reach out to customer support.")
              setLoading(false)
            }
          } else {
            alert("Payment signature verification failed. Secure refund initiated.")
            setLoading(false)
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: '#0A0A0A',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          }
        }
      }

      const razorpayInstance = new (window as any).Razorpay(options)
      
      razorpayInstance.on('payment.failed', function (response: any) {
        alert("Payment failed: " + response.error.description)
        setLoading(false)
      })

      razorpayInstance.open()
      
    } catch (error) {
      console.error("Checkout transaction error:", error)
      alert("Checkout session encountered an issue. Please choose Cash On Delivery (COD) or try again.")
      setLoading(false)
    }
  }

  return (
    <div className="border-r border-neutral-200 p-8 lg:p-16 bg-white">
      <div className="mb-14 flex items-center gap-12 text-[10px] font-bold tracking-[0.3em] text-black">
        <span className="border-b-2 border-black pb-2">1. SHIPPING</span>
        <span className="text-neutral-400">2. PAYMENT</span>
        <span className="text-neutral-400">3. CONFIRM</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Shipping address info */}
        <div>
          <h2 className="mb-6 text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            SHIPPING ADDRESS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              required
              type="text"
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              className="border border-neutral-200 p-4 text-xs font-semibold uppercase tracking-widest text-black focus:border-black focus:outline-none bg-neutral-50"
            />
            <input 
              required
              type="tel"
              name="phone"
              placeholder="Phone Number" 
              value={formData.phone}
              onChange={handleChange}
              className="border border-neutral-200 p-4 text-xs font-semibold uppercase tracking-widest text-black focus:border-black focus:outline-none bg-neutral-50"
            />
            <input 
              required
              type="text"
              name="address"
              placeholder="Full Street Address" 
              value={formData.address}
              onChange={handleChange}
              className="sm:col-span-2 border border-neutral-200 p-4 text-xs font-semibold uppercase tracking-widest text-black focus:border-black focus:outline-none bg-neutral-50"
            />
            <input 
              required
              type="text"
              name="city"
              placeholder="City" 
              value={formData.city}
              onChange={handleChange}
              className="border border-neutral-200 p-4 text-xs font-semibold uppercase tracking-widest text-black focus:border-black focus:outline-none bg-neutral-50"
            />
            <input 
              required
              type="text"
              name="pin"
              placeholder="PIN Code" 
              value={formData.pin}
              onChange={handleChange}
              className="border border-neutral-200 p-4 text-xs font-semibold uppercase tracking-widest text-black focus:border-black focus:outline-none bg-neutral-50"
            />
          </div>
        </div>

        {/* Payment options */}
        <div>
          <h2 className="mb-6 text-xs font-semibold tracking-[0.3em] text-neutral-400 uppercase">
            PAYMENT METHOD
          </h2>

          <div className="space-y-3">
            <label 
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-between border p-5 cursor-pointer transition ${
                paymentMethod === 'card' ? 'border-black bg-neutral-50' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-black" />
                <span className="text-xs uppercase tracking-widest font-semibold text-black">Card / Debit Card</span>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="accent-black h-3.5 w-3.5"
              />
            </label>

            <label 
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-center justify-between border p-5 cursor-pointer transition ${
                paymentMethod === 'upi' ? 'border-black bg-neutral-50' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 text-black" />
                <span className="text-xs uppercase tracking-widest font-semibold text-black">UPI / Net Banking</span>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                className="accent-black h-3.5 w-3.5"
              />
            </label>

            <label 
              onClick={() => setPaymentMethod('cod')}
              className={`flex items-center justify-between border p-5 cursor-pointer transition ${
                paymentMethod === 'cod' ? 'border-black bg-neutral-50' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-black" />
                <span className="text-xs uppercase tracking-widest font-semibold text-black">Cash On Delivery</span>
              </div>
              <input 
                type="radio" 
                name="payment" 
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="accent-black h-3.5 w-3.5"
              />
            </label>
          </div>
        </div>

        {/* Submit */}
        <button 
          disabled={loading || items.length === 0}
          type="submit" 
          className="w-full bg-black py-5 text-xs font-semibold tracking-[0.3em] uppercase text-white hover:opacity-85 transition flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? 'PROCESSING ORDER...' : 'PLACE ORDER'} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  )
}
