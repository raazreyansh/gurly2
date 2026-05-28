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
import { useCart } from "@/store/cart"
import { validateCoupon } from "@/services/coupon"

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
  const { items, total, clear } = useCart()
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

  const shipping = total() >= 999 ? 0 : 99
  const finalTotal = total() + shipping - discount

  async function applyCoupon() {
    if (!couponCode) return
    const coupon = await validateCoupon(couponCode)
    if (!coupon) {
      setCouponMsg("Invalid code")
      return
    }
    if (coupon.min_order && total() < coupon.min_order) {
      setCouponMsg(`Min order Rs. ${coupon.min_order}`)
      return
    }
    const amount = coupon.type === "flat" ? coupon.value : (total() * coupon.value) / 100
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
                clear()
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
          clear()
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
      <div className="storefront-shell min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6 text-center">
          <div className="empty-shop-state">
            <h1>Your cart is empty</h1>
            <p>Browse the collection and add a few pieces before checking out.</p>
            <Link href="/shop" className="store-button store-button-dark">Shop Now</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="storefront-shell min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="spinner" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="storefront-shell min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="checkout-auth-card">
            <Lock size={24} />
            <h1>Sign in to checkout</h1>
            <p>Create an account to track your order and save your details.</p>
            <div className="checkout-auth-actions">
              <Link href="/login?redirect=/checkout" className="store-button store-button-dark">
                Sign In <ArrowRight size={12} />
              </Link>
              <Link href="/register?redirect=/checkout" className="store-button store-button-light">
                Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const inputClass = "store-input"

  return (
    <div className="storefront-shell min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="store-section">
          <div className="section-heading-row">
            <div>
              <p className="store-label">Secure checkout</p>
              <h1>Checkout</h1>
            </div>
            <div className="checkout-steps">
              <span className={step === "address" ? "active" : ""}>1. Shipping</span>
              <span>2. Payment</span>
            </div>
          </div>
        </section>

        <section className="checkout-grid">
          <div className="checkout-flow">
            {step === "address" ? (
              <form onSubmit={handleSubmit((data) => { setAddressData(data); setStep("payment") })}>
                <h2>Shipping</h2>
                <div className="checkout-fields">
                  {fields.map(({ name, placeholder, cols }) => (
                    <div key={name} style={{ gridColumn: `span ${cols}` }}>
                      <input id={`checkout-${name}`} {...register(name)} placeholder={placeholder} className={inputClass} />
                      {errors[name] && <p className="checkout-error">{errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>
                <button type="submit" id="checkout-continue-btn" className="store-button store-button-dark checkout-primary">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div>
                <h2>Payment</h2>
                <div className="checkout-payment-card">
                  <p>Secure checkout via Razorpay - UPI, Card, Net Banking, Wallets</p>
                </div>
                <button
                  id="pay-now-btn"
                  type="button"
                  onClick={handlePayment}
                  disabled={processing}
                  className="store-button store-button-dark checkout-primary"
                >
                  {processing ? "Processing..." : `Pay Rs. ${finalTotal.toLocaleString("en-IN")}`}
                </button>
                <button onClick={() => setStep("address")} disabled={processing} className="checkout-back">
                  Back
                </button>
              </div>
            )}
          </div>

          <aside className="cart-summary-card">
            <h2>Order</h2>

            <div className="checkout-summary-items">
              {items.map((item) => (
                <div key={item.productId} className="checkout-item">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <strong>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                </div>
              ))}
            </div>

            <div className="coupon-card">
              <div className="coupon-row">
                <input
                  id="coupon-input"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="store-input"
                />
                <button id="apply-coupon-btn" type="button" onClick={applyCoupon} className="coupon-apply">
                  Apply
                </button>
              </div>
              {couponMsg && <p className={couponMsg.startsWith("✓") ? "coupon-success" : "coupon-error"}>{couponMsg}</p>}
            </div>

            <div className="summary-breakdown">
              <div>
                <span>Subtotal</span><strong>Rs. {total().toLocaleString("en-IN")}</strong>
              </div>
              {discount > 0 && (
                <div className="discount-row">
                  <span>Discount</span><strong>-Rs. {discount.toLocaleString("en-IN")}</strong>
                </div>
              )}
              <div>
                <span>Shipping</span><strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
              </div>
              <div className="summary-total">
                <span>Total</span><strong>Rs. {finalTotal.toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
