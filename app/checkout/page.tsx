"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { validateCoupon } from "@/services/coupon"
import { toast } from "sonner"
import { Lock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

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
  key: string; amount: number; currency: string; name: string; description: string; order_id: string
  handler: (r: RazorpayPaymentResponse) => void | Promise<void>
  prefill: { name: string; contact: string }
  theme: { color: string }
  modal: { ondismiss: () => void }
}

declare global {
  interface Window { Razorpay?: new (opts: RazorpayOptions) => { open: () => void } }
}

const FIELDS: { name: keyof AddressForm; placeholder: string; cols: number }[] = [
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

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddressForm>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (user) reset({ name: user.user_metadata?.full_name || "", phone: user.phone || "", line1: "", line2: "", city: "", state: "", pincode: "" })
  }, [user, reset])

  useEffect(() => {
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    document.body.appendChild(s)
    return () => { document.body.removeChild(s) }
  }, [])

  const shipping = total() >= 999 ? 0 : 99
  const finalTotal = total() + shipping - discount

  async function applyCoupon() {
    if (!couponCode) return
    const coupon = await validateCoupon(couponCode)
    if (!coupon) { setCouponMsg("Invalid code"); return }
    if (coupon.min_order && total() < coupon.min_order) { setCouponMsg(`Min order ₹${coupon.min_order}`); return }
    const disc = coupon.type === "flat" ? coupon.value : (total() * coupon.value) / 100
    setDiscount(disc)
    setCouponMsg(`✓ ${coupon.type === "percent" ? coupon.value + "%" : "₹" + coupon.value} off`)
    toast.success("Coupon applied")
  }

  async function handlePayment() {
    if (!addressData) { setStep("address"); return }
    setProcessing(true)
    const loadId = toast.loading("Initiating…")
    try {
      const res = await fetch("/api/payment/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: finalTotal }) })
      const order = (await res.json()) as PaymentOrderResponse
      if (!order.id) throw new Error("Order creation failed")

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      const Razorpay = typeof window !== "undefined" ? window.Razorpay : undefined

      if (razorpayKey && Razorpay && !order.id.startsWith("mock_order_")) {
        toast.dismiss(loadId)
        const rzp = new Razorpay({
          key: razorpayKey, amount: order.amount ?? Math.round(finalTotal * 100),
          currency: order.currency ?? "INR", name: "GURLY", description: "Jewelry Purchase", order_id: order.id,
          handler: async (response) => {
            const vLoad = toast.loading("Verifying…")
            try {
              const vRes = await fetch("/api/payment/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) })
              const vData = (await vRes.json()) as PaymentVerificationResponse
              if (vData.success) {
                toast.dismiss(vLoad)
                toast.success("Payment successful")
                const { supabase } = await import("@/lib/supabase/client")
                const addr = `${addressData.line1}, ${addressData.line2 ? addressData.line2 + ", " : ""}${addressData.city}, ${addressData.state} - ${addressData.pincode}`
                await supabase.from("orders").insert({ shipping_address: addr, total_amount: finalTotal, payment_status: "paid", status: "processing" })
                clear(); router.push("/order/success")
              } else { toast.dismiss(vLoad); toast.error("Payment failed") }
            } catch { toast.dismiss(vLoad); toast.error("Verification error") }
            finally { setProcessing(false) }
          },
          prefill: { name: addressData.name, contact: addressData.phone },
          theme: { color: "#000000" },
          modal: { ondismiss: () => setProcessing(false) }
        })
        rzp.open()
      } else {
        toast.dismiss(loadId)
        const mLoad = toast.loading("Processing…")
        setTimeout(async () => {
          try {
            const { supabase } = await import("@/lib/supabase/client")
            const addr = `${addressData.line1}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`
            await supabase.from("orders").insert({ shipping_address: addr, total_amount: finalTotal, payment_status: "paid", status: "processing" })
          } catch (e) { console.log("Mock order skipped:", e) }
          toast.dismiss(mLoad); toast.success("Order placed!"); clear(); router.push("/order/success"); setProcessing(false)
        }, 2000)
      }
    } catch (err) { toast.dismiss(loadId); console.error(err); toast.error("Payment failed"); setProcessing(false) }
  }

  const inputClass = "w-full border border-[#E8E8E8] px-4 py-3 text-xs outline-none focus:border-black transition-colors bg-white placeholder-black/30 font-medium"

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6 text-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-black/30 mb-6">Your bag is empty</p>
            <Link href="/shop" className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-800 transition-colors">Shop Now</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6">
          <div className="text-center max-w-sm">
            <Lock size={24} className="mx-auto mb-6 text-black/20" />
            <h1 className="text-lg font-black uppercase tracking-tight mb-3">Sign in to checkout</h1>
            <p className="text-xs text-black/40 mb-8">Create an account to track your order and save your details.</p>
            <div className="flex flex-col gap-3">
              <Link href="/login?redirect=/checkout" className="w-full py-3.5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                Sign In <ArrowRight size={12} />
              </Link>
              <Link href="/register?redirect=/checkout" className="w-full py-3.5 border border-[#E8E8E8] text-[10px] font-black uppercase tracking-widest hover:border-black transition-colors text-center">
                Create Account
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-14">
        {/* Step header */}
        <div className="border-b border-[#E8E8E8]">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
            <h1 className="text-lg font-black uppercase tracking-tight">Checkout</h1>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className={step === "address" ? "text-black" : "text-black/30"}>1. Shipping</span>
              <span className="text-black/20">—</span>
              <span className={step === "payment" ? "text-black" : "text-black/30"}>2. Payment</span>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

            {/* Form */}
            <div>
              {step === "address" ? (
                <form onSubmit={handleSubmit((data) => { setAddressData(data); setStep("payment") })}>
                  <h2 className="text-[10px] font-black uppercase tracking-widest mb-6">Shipping</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {FIELDS.map(({ name, placeholder, cols }) => (
                      <div key={name} style={{ gridColumn: `span ${cols}` }}>
                        <input
                          id={`checkout-${name}`}
                          {...register(name)}
                          placeholder={placeholder}
                          className={inputClass}
                        />
                        {errors[name] && (
                          <p className="text-[10px] text-red-500 mt-1 font-medium">{errors[name]?.message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit" id="checkout-continue-btn" className="mt-6 w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors">
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-widest mb-6">Payment</h2>
                  <div className="border border-[#E8E8E8] p-5 mb-6">
                    <p className="text-xs text-black/50">Secure checkout via Razorpay — UPI, Card, Net Banking, Wallets</p>
                  </div>
                  <button
                    id="pay-now-btn"
                    type="button"
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:bg-black/30 transition-colors"
                  >
                    {processing ? "Processing…" : `Pay ₹${finalTotal.toLocaleString("en-IN")}`}
                  </button>
                  <button onClick={() => setStep("address")} disabled={processing} className="mt-3 w-full text-center text-[10px] font-bold uppercase tracking-widest text-black/30 hover:text-black transition-colors py-2">
                    ← Back
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <aside className="border border-[#E8E8E8] p-6 space-y-4 sticky top-20">
              <h2 className="text-[10px] font-black uppercase tracking-widest">Order</h2>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3 items-center">
                    <img src={item.image} alt={item.title} className="w-10 h-12 object-cover bg-[#F5F5F5] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold truncate uppercase">{item.title}</p>
                      <p className="text-[10px] text-black/40">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-[11px] font-bold shrink-0">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="pt-2 border-t border-[#E8E8E8]">
                <div className="flex gap-2">
                  <input
                    id="coupon-input"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="flex-1 border border-[#E8E8E8] px-3 py-2.5 text-[11px] outline-none focus:border-black transition-colors font-medium"
                  />
                  <button id="apply-coupon-btn" type="button" onClick={applyCoupon} className="px-4 text-[10px] font-black uppercase tracking-widest border border-[#E8E8E8] hover:border-black transition-colors shrink-0">
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-[10px] font-medium mt-2 ${couponMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              <div className="border-t border-[#E8E8E8] pt-4 space-y-2">
                <div className="flex justify-between text-[11px] font-medium text-black/50">
                  <span>Subtotal</span><span>₹{total().toLocaleString("en-IN")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[11px] font-medium text-green-600">
                    <span>Discount</span><span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-medium text-black/50">
                  <span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-[13px] font-black border-t border-[#E8E8E8] pt-3">
                  <span>Total</span><span>₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
