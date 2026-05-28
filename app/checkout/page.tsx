"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Lock } from "lucide-react"
import { toast } from "sonner"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { useAuth } from "@/hooks/useAuth"
import { useCartStore } from "@/store/useCartStore"
import { validateCoupon } from "@/services/coupon"
import Image from "next/image"
import { StorefrontLayout } from "@/components/layout/StorefrontLayout"

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  line1: z.string().min(5, "Address required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().length(6, "6-digit pincode required"),
})

type AddressForm = z.infer<typeof schema>
type PaymentOrderResponse = { id?: string; amount?: number; currency?: string }
type PaymentVerificationResponse = { success?: boolean }
type RazorpayPaymentResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>
  prefill: { name: string; contact: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

const fields: { name: keyof AddressForm; placeholder: string; cols: number }[] = [
  { name: "name", placeholder: "Full name", cols: 2 },
  { name: "phone", placeholder: "Phone", cols: 1 },
  { name: "pincode", placeholder: "PIN code", cols: 1 },
  { name: "line1", placeholder: "Address line 1", cols: 2 },
  { name: "line2", placeholder: "Address line 2 (optional)", cols: 2 },
  { name: "city", placeholder: "City", cols: 1 },
  { name: "state", placeholder: "State", cols: 1 },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCartStore()
  const { user, loading: authLoading } = useAuth()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState("")
  const [step, setStep] = useState<"address" | "payment">("address")
  const [addressData, setAddressData] = useState<AddressForm | null>(null)
  const [processing, setProcessing] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressForm>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.user_metadata?.full_name || "",
        phone: user.phone || "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      })
    }
  }, [user, reset])

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const shipping = getCartTotal() >= 999 ? 0 : 99
  const finalTotal = getCartTotal() + shipping - discount

  async function applyCoupon() {
    if (!couponCode) return
    const coupon = await validateCoupon(couponCode)
    if (!coupon) {
      setCouponMsg("Invalid code")
      return
    }
    if (coupon.min_order && getCartTotal() < coupon.min_order) {
      setCouponMsg(`Min order Rs. ${coupon.min_order}`)
      return
    }
    const amount = coupon.type === "flat" ? coupon.value : (getCartTotal() * coupon.value) / 100
    setDiscount(amount)
    setCouponMsg(`✓ ${coupon.type === "percent" ? `${coupon.value}%` : `Rs. ${coupon.value}`} off`)
    toast.success("Coupon applied")
  }

  async function handlePayment() {
    if (!addressData) {
      setStep("address")
      return
    }

    setProcessing(true)
    const loadId = toast.loading("Initiating...")

    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      })
      const order = (await response.json()) as PaymentOrderResponse
      if (!order.id) throw new Error("Order creation failed")

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      const Razorpay = typeof window !== "undefined" ? window.Razorpay : undefined

      if (razorpayKey && Razorpay && !order.id.startsWith("mock_order_")) {
        toast.dismiss(loadId)
        const rzp = new Razorpay({
          key: razorpayKey,
          amount: order.amount ?? Math.round(finalTotal * 100),
          currency: order.currency ?? "INR",
          name: "GURLY",
          description: "Accessory Purchase",
          order_id: order.id,
          handler: async (paymentResponse) => {
            const verifyId = toast.loading("Verifying...")
            try {
              const verifyResponse = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentResponse),
              })
              const verification = (await verifyResponse.json()) as PaymentVerificationResponse
              if (verification.success) {
                const { supabase } = await import("@/lib/supabase/client")
                const shippingAddress = `${addressData.line1}, ${addressData.line2 ? `${addressData.line2}, ` : ""}${addressData.city}, ${addressData.state} - ${addressData.pincode}`
                await supabase.from("orders").insert({
                  shipping_address: shippingAddress,
                  total_amount: finalTotal,
                  payment_status: "paid",
                  status: "processing",
                })
                clearCart()
                toast.dismiss(verifyId)
                toast.success("Payment successful")
                router.push("/order/success")
              } else {
                toast.dismiss(verifyId)
                toast.error("Payment failed")
              }
            } catch {
              toast.dismiss(verifyId)
              toast.error("Verification error")
            } finally {
              setProcessing(false)
            }
          },
          prefill: { name: addressData.name, contact: addressData.phone },
          theme: { color: "#2b1424" },
          modal: { ondismiss: () => setProcessing(false) },
        })
        rzp.open()
      } else {
        toast.dismiss(loadId)
        const mockLoad = toast.loading("Processing...")
        setTimeout(async () => {
          try {
            const { supabase } = await import("@/lib/supabase/client")
            const shippingAddress = `${addressData.line1}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`
            await supabase.from("orders").insert({
              shipping_address: shippingAddress,
              total_amount: finalTotal,
              payment_status: "paid",
              status: "processing",
            })
          } catch (error) {
            console.log("Mock order skipped:", error)
          }
          toast.dismiss(mockLoad)
          toast.success("Order placed")
          clearCart()
          router.push("/order/success")
          setProcessing(false)
        }, 1800)
      }
    } catch (error) {
      toast.dismiss(loadId)
      console.error(error)
      toast.error("Payment failed")
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <StorefrontLayout>
        <main className="flex-1 flex flex-col items-center justify-center py-40 px-6 text-center bg-white min-h-[70vh]">
          <h1 className="font-serif text-3xl text-black mb-4">Your bag is empty</h1>
          <p className="text-neutral-500 text-sm mb-8">Browse the collection to add items.</p>
          <Link href="/shop" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition">Shop Now</Link>
        </main>
      </StorefrontLayout>
    )
  }

  if (authLoading) {
    return (
      <StorefrontLayout>
        <main className="flex-1 flex items-center justify-center min-h-[70vh]">
          <div className="spinner" />
        </main>
      </StorefrontLayout>
    )
  }

  if (!user) {
    return (
      <StorefrontLayout>
        <main className="flex-1 flex flex-col items-center justify-center py-40 px-6 text-center bg-white min-h-[70vh]">
          <Lock size={24} className="mx-auto text-neutral-300 mb-6" />
          <h1 className="font-serif text-3xl text-black mb-4">Sign in to checkout</h1>
          <p className="text-neutral-500 text-sm mb-8">Create an account to track your order and save your details.</p>
          <div className="flex gap-4">
            <Link href="/login?redirect=/checkout" className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition">
              Sign In
            </Link>
            <Link href="/register?redirect=/checkout" className="border border-black px-8 py-3 text-xs uppercase tracking-widest font-semibold text-black hover:bg-neutral-50 transition">
              Create Account
            </Link>
          </div>
        </main>
      </StorefrontLayout>
    )
  }

  const inputClass = "w-full border-b border-neutral-300 py-3 text-sm outline-none focus:border-black transition-colors placeholder:text-neutral-400 bg-transparent"

  return (
    <StorefrontLayout>
      <main className="flex-1 pt-12 pb-24 bg-white">
        <section className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12 border-b border-neutral-100 pb-8 flex justify-between items-end">
            <div>
              <h1 className="font-serif text-4xl text-black">Checkout</h1>
            </div>
            <div className="flex gap-4 text-xs uppercase tracking-widest font-semibold">
              <span className={step === "address" ? "text-black" : "text-neutral-400"}>1. Shipping</span>
              <span className={step === "payment" ? "text-black" : "text-neutral-400"}>2. Payment</span>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            {step === "address" ? (
              <form onSubmit={handleSubmit((data) => { setAddressData(data); setStep("payment") })}>
                <h2 className="font-serif text-2xl mb-6">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-8">
                  {fields.map(({ name, placeholder, cols }) => (
                    <div key={name} style={{ gridColumn: `span ${cols}` }}>
                      <input id={`checkout-${name}`} {...register(name)} placeholder={placeholder} className={inputClass} />
                      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>
                <button type="submit" id="checkout-continue-btn" className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div>
                <h2 className="font-serif text-2xl mb-6">Payment</h2>
                <div className="bg-neutral-50 p-6 mb-8 text-sm text-neutral-600">
                  <p>Secure checkout via Razorpay - UPI, Card, Net Banking, Wallets</p>
                </div>
                <button
                  id="pay-now-btn"
                  type="button"
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition disabled:opacity-50"
                >
                  {processing ? "Processing..." : `Pay Rs. ${finalTotal.toLocaleString("en-IN")}`}
                </button>
                <button onClick={() => setStep("address")} disabled={processing} className="w-full mt-4 text-xs uppercase tracking-widest font-semibold text-neutral-500 hover:text-black transition">
                  Back
                </button>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 bg-neutral-50 p-8 h-fit">
            <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-neutral-100 flex-shrink-0">
                    <Image src={item.product.images?.[0] || '/product.png'} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-sm">
                    <p className="font-medium text-black line-clamp-1">{item.product.title}</p>
                    <p className="text-neutral-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <strong className="text-sm font-medium">Rs. {(item.product.price * item.quantity).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex">
                <input
                  id="coupon-input"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="flex-1 border-b border-neutral-300 py-2 text-sm outline-none focus:border-black transition-colors bg-transparent"
                />
                <button id="apply-coupon-btn" type="button" onClick={applyCoupon} className="border-b border-black px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:opacity-60 transition">
                  Apply
                </button>
              </div>
              {couponMsg && <p className={`text-xs mt-2 ${couponMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{couponMsg}</p>}
            </div>

            <div className="space-y-4 text-sm text-neutral-600 border-b border-neutral-200 pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span><strong>Rs. {getCartTotal().toLocaleString("en-IN")}</strong>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span><strong>-Rs. {discount.toLocaleString("en-IN")}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span><strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
              </div>
            </div>
            <div className="flex justify-between items-center text-black">
              <span className="font-medium">Total</span><strong className="font-serif text-2xl">Rs. {finalTotal.toLocaleString("en-IN")}</strong>
            </div>
          </aside>
        </section>
      </main>
    </StorefrontLayout>
  )
}
