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
import { MapPin, CreditCard, Tag, Lock, ArrowRight, ShieldCheck, Gift, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

const addressSchema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().min(10, "Valid phone required"),
  line1: z.string().min(5, "Address required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().length(6, "Valid 6-digit pincode required"),
})

type AddressForm = z.infer<typeof addressSchema>

type PaymentOrderResponse = {
  id?: string
  amount?: number
  currency?: string
}

type PaymentVerificationResponse = {
  success?: boolean
}

type RazorpayPaymentResponse = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>
  prefill: {
    name: string
    contact: string
  }
  theme: {
    color: string
  }
  modal: {
    ondismiss: () => void
  }
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

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
    resolver: zodResolver(addressSchema)
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.user_metadata?.full_name || "",
        phone: user.phone || user.user_metadata?.phone || "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        pincode: "",
      })
    }
  }, [user, reset])

  useEffect(() => {
    // Dynamically load Razorpay SDK
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
      setCouponMsg("Invalid coupon code")
      return
    }
    if (coupon.min_order && total() < coupon.min_order) {
      setCouponMsg(`Minimum order ₹${coupon.min_order} required`)
      return
    }
    const disc = coupon.type === "flat" ? coupon.value : (total() * coupon.value) / 100
    setDiscount(disc)
    setCouponMsg(`✓ ${coupon.type === "percent" ? coupon.value + "%" : "₹" + coupon.value} off applied!`)
    toast.success("Coupon applied!", {
      style: {
        background: "#041C12",
        color: "#F7F4EB",
        border: "1px solid #DFBA73",
        borderRadius: "0px"
      }
    })
  }

  async function handlePayment() {
    if (!addressData) {
      toast.error("Address is missing. Please re-enter shipping details.")
      setStep("address")
      return
    }

    setProcessing(true)
    const loadId = toast.loading("Initiating secure checkout...")
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      })
      const order = (await res.json()) as PaymentOrderResponse
      
      if (!order.id) {
        throw new Error("Order creation failed")
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY
      const Razorpay = typeof window !== "undefined" ? window.Razorpay : undefined

      if (razorpayKey && Razorpay && !order.id.startsWith("mock_order_")) {
        toast.dismiss(loadId)
        
        if (razorpayKey.startsWith("rzp_test_")) {
          toast.info("Test Mode Info: Real banking apps cannot scan test QR codes. To test UPI successfully, choose 'UPI ID/VPA' and enter 'success@razorpay'.", {
            duration: 8000
          })
        }
        
        const options = {
          key: razorpayKey,
          amount: order.amount ?? Math.round(finalTotal * 100),
          currency: order.currency ?? "INR",
          name: "GURLY",
          description: "Luxury Jewelry Purchase",
          order_id: order.id,
          handler: async function (response: RazorpayPaymentResponse) {
            const verifyLoad = toast.loading("Verifying payment transaction...")
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })
              const verifyData = (await verifyRes.json()) as PaymentVerificationResponse
              if (verifyData.success) {
                toast.dismiss(verifyLoad)
                toast.success("Payment successful!")
                
                // Save order to database
                const { supabase } = await import("@/lib/supabase/client")
                const addressString = `${addressData.line1}, ${addressData.line2 ? addressData.line2 + ', ' : ''}${addressData.city}, ${addressData.state} - ${addressData.pincode}`
                
                await supabase.from("orders").insert({
                  shipping_address: addressString,
                  total_amount: finalTotal,
                  payment_status: "paid",
                  status: "processing",
                })

                clear()
                router.push("/order/success")
              } else {
                toast.dismiss(verifyLoad)
                toast.error("Payment verification failed")
              }
            } catch {
              toast.dismiss(verifyLoad)
              toast.error("Error during payment verification")
            } finally {
              setProcessing(false)
            }
          },
          prefill: {
            name: addressData.name,
            contact: addressData.phone,
          },
          theme: {
            color: "#DFBA73",
          },
          modal: {
            ondismiss: function() {
              setProcessing(false)
            }
          }
        }

        const rzp = new Razorpay(options)
        rzp.open()
      } else {
        // Fallback Mock Payment Simulation
        toast.dismiss(loadId)
        toast.info("Razorpay offline or not configured. Running simulation...")
        const mockLoad = toast.loading("Processing checkout payment securely...")
        
        setTimeout(async () => {
          try {
            const { supabase } = await import("@/lib/supabase/client")
            const addressString = `${addressData.line1}, ${addressData.line2 ? addressData.line2 + ', ' : ''}${addressData.city}, ${addressData.state} - ${addressData.pincode}`
            
            // Try saving mock order
            await supabase.from("orders").insert({
              shipping_address: addressString,
              total_amount: finalTotal,
              payment_status: "paid",
              status: "processing",
            })
          } catch (e) {
            console.log("Mock database entry bypassed:", e)
          }

          toast.dismiss(mockLoad)
          toast.success("Mock Payment Complete!")
          clear()
          router.push("/order/success")
          setProcessing(false)
        }, 2000)
      }
    } catch (err) {
      toast.dismiss(loadId)
      console.error(err)
      toast.error("Payment failed. Try again.")
      setProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="storefront-shell bg-[#041C12] text-[#F7F4EB] flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32 px-6">
          <div className="text-center max-w-md bg-[#03170F] border border-[#DFBA73]/15 p-16 rounded-none">
            <h1 className="font-serif text-3xl font-light mb-6">Your Ledger is Empty</h1>
            <p className="text-xs text-[#C8C5B9] mb-10 leading-relaxed uppercase tracking-wider">Please add items to your tray before proceeding to checkout.</p>
            <Link href="/shop" className="px-8 py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-widest transition-colors duration-300 rounded-none inline-block">Explore Our Ledger</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="storefront-shell bg-[#041C12] text-[#F7F4EB] flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32 px-6">
          <div className="text-center space-y-5">
            <div className="w-10 h-10 border-2 border-[#DFBA73]/20 border-t-[#DFBA73] rounded-none animate-spin mx-auto" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#C8C5B9]">Securing your checkout session...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="storefront-shell bg-[#041C12] text-[#F7F4EB] flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-32 px-6">
          <div className="bg-[#03170F] border border-[#DFBA73]/15 max-w-lg w-full p-16 text-center rounded-none">
            <div className="w-16 h-16 bg-[#DFBA73]/10 rounded-none flex items-center justify-center mx-auto mb-8">
              <Lock size={24} className="text-[#DFBA73]" />
            </div>
            
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-3">Authentication Required</p>
            <h1 className="font-serif text-3xl font-light mb-4">Secure Checkout</h1>
            
            <p className="text-xs text-[#C8C5B9] leading-relaxed uppercase tracking-wider mb-10 max-w-xs mx-auto">
              To complete your premium jewelry purchase and track your order safely, please sign in or create a GURLY boutique account.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/login?redirect=/checkout" 
                className="w-full py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none"
              >
                Sign In to Account <ArrowRight size={13} />
              </Link>
              
              <Link 
                href="/register?redirect=/checkout" 
                className="w-full py-4 border border-[#F7F4EB]/20 hover:border-white text-[#F7F4EB] hover:text-white text-[10px] uppercase font-extrabold tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none bg-transparent"
              >
                Create New Account
              </Link>
            </div>
            
            <p className="text-[9px] text-[#C8C5B9] mt-8 uppercase tracking-widest font-extrabold">
              🔒 256-bit Encryption Secured Session
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="storefront-shell bg-[#041C12] text-[#F7F4EB] flex flex-col min-h-screen font-sans">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Step Tracker Header */}
        <div className="py-16 bg-[#03170F] border-b border-[#DFBA73]/15">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#DFBA73] uppercase mb-2">SECURE PURCHASE</p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-[#F7F4EB]">Checkout</h1>
            </div>
            
            {/* Steps indicator */}
            <div className="flex items-center gap-4 text-[9px] font-extrabold tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center border ${step === "address" ? "bg-[#DFBA73] text-[#041C12] border-[#DFBA73]" : "border-[#F7F4EB]/20 text-[#C8C5B9]"}`}>1</span>
                <span className={step === "address" ? "text-[#F7F4EB]" : "text-[#C8C5B9]"}>Shipping</span>
              </div>
              <div className="w-8 h-px bg-[#DFBA73]/20" />
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center border ${step === "payment" ? "bg-[#DFBA73] text-[#041C12] border-[#DFBA73]" : "border-[#F7F4EB]/20 text-[#C8C5B9]"}`}>2</span>
                <span className={step === "payment" ? "text-[#F7F4EB]" : "text-[#C8C5B9]"}>Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-16 px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Form panel */}
            <div className="lg:col-span-7 bg-[#03170F] border border-[#DFBA73]/10 p-8 md:p-10 rounded-none text-left">
              {step === "address" ? (
                <form onSubmit={handleSubmit((data) => { setAddressData(data); setStep("payment"); })}>
                  <h2 className="font-serif text-2xl font-light mb-8 flex items-center gap-3">
                    <MapPin size={18} className="text-[#DFBA73]" /> Shipping Details
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "name", placeholder: "Full Name", cols: 2 },
                      { name: "phone", placeholder: "Phone Number", cols: 1 },
                      { name: "pincode", placeholder: "PIN Code", cols: 1 },
                      { name: "line1", placeholder: "Address Line 1", cols: 2 },
                      { name: "line2", placeholder: "Address Line 2 (Optional)", cols: 2 },
                      { name: "city", placeholder: "City", cols: 1 },
                      { name: "state", placeholder: "State", cols: 1 },
                    ].map(({ name, placeholder, cols }) => (
                      <div key={name} style={{ gridColumn: `span ${cols}` }} className="space-y-1.5">
                        <input
                          id={`checkout-${name}`}
                          {...register(name as keyof AddressForm)}
                          placeholder={placeholder.toUpperCase()}
                          className="w-full bg-[#041C12] border border-[#DFBA73]/20 text-xs font-extrabold uppercase tracking-widest px-4 py-3.5 text-[#F7F4EB] outline-none focus:border-[#DFBA73] rounded-none placeholder-[#44524B]"
                        />
                        {errors[name as keyof AddressForm] && (
                          <p className="text-[10px] font-extrabold tracking-wide text-red-500 uppercase">
                            {errors[name as keyof AddressForm]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="w-full py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-[0.2em] transition-colors rounded-none mt-8" id="checkout-continue-btn">
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light mb-6 flex items-center gap-3">
                    <CreditCard size={18} className="text-[#DFBA73]" /> Secure Payment
                  </h2>
                  <div className="bg-[#041C12] border border-[#DFBA73]/15 p-6 space-y-2 text-xs font-extrabold uppercase tracking-widest text-[#C8C5B9] leading-relaxed">
                    <p className="text-[#F7F4EB]">Secure checkout redirects to Razorpay&apos;s luxury payment gateway.</p>
                    <p className="text-[#DFBA73] text-[9px] mt-2">Supported: UPI, Credit/Debit Card, Net Banking, Wallets</p>
                  </div>
                  <button className="w-full py-4 bg-[#DFBA73] hover:bg-[#F7F4EB] text-[#041C12] text-[10px] uppercase font-extrabold tracking-[0.2em] transition-colors rounded-none mt-6" id="pay-now-btn" onClick={handlePayment} disabled={processing}>
                    {processing ? "PROCESSING CHECKOUT..." : `Pay ₹${finalTotal.toLocaleString("en-IN")} Securely`}
                  </button>
                  <button onClick={() => setStep("address")} disabled={processing} className="w-full py-2 text-center text-[8px] uppercase tracking-widest font-extrabold text-[#C8C5B9] hover:text-[#DFBA73] transition-colors bg-transparent border-none outline-none mt-4">
                    ← Back to Address Info
                  </button>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-[#03170F] border border-[#DFBA73]/10 p-8 rounded-none space-y-6 text-left">
                <h2 className="font-serif text-2xl font-light text-[#F7F4EB] mb-6">Order Summary</h2>

                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#041C12]">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.title} className="w-12 h-16 object-cover border border-[#DFBA73]/10" />
                      <div className="flex-grow min-w-0">
                        <p className="text-xs uppercase tracking-widest font-extrabold text-[#F7F4EB] truncate">{item.title}</p>
                        <p className="text-[10px] text-[#C8C5B9] mt-0.5">QTY: {item.quantity}</p>
                      </div>
                      <p className="font-mono text-xs text-[#DFBA73]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon Apply */}
                <div className="border-t border-[#DFBA73]/15 pt-6">
                  <div className="flex gap-2">
                    <div className="flex-grow relative">
                      <Tag size={13} className="text-[#44524B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id="coupon-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE"
                        className="w-full bg-[#041C12] border border-[#DFBA73]/20 text-xs font-extrabold uppercase tracking-widest pl-10 pr-4 py-3 text-[#F7F4EB] outline-none focus:border-[#DFBA73] rounded-none placeholder-[#44524B]"
                      />
                    </div>
                    <button onClick={applyCoupon} className="px-6 bg-[#F7F4EB]/5 border border-[#DFBA73]/15 hover:border-[#DFBA73] hover:text-[#DFBA73] text-[9px] uppercase font-extrabold tracking-widest transition-colors rounded-none" id="apply-coupon-btn">
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[9px] font-extrabold tracking-widest uppercase mt-3 ${couponMsg.startsWith("✓") ? "text-[#58B47E]" : "text-red-500"}`}>
                      {couponMsg}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t border-[#DFBA73]/15 pt-6 space-y-3.5 text-[9px] text-[#C8C5B9] uppercase tracking-widest font-extrabold">
                  <div className="flex justify-between">
                    <span>Ledger Subtotal</span><span className="text-[#F7F4EB] font-mono">₹{total().toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#58B47E]">
                      <span>Coupon Discount</span><span className="font-mono">-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span><span className={shipping === 0 ? "text-[#58B47E]" : "text-[#F7F4EB]"}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[#F7F4EB] text-sm pt-4 border-t border-[#DFBA73]/15 mt-4">
                    <span>Total Valuation</span><strong className="text-[#DFBA73] font-mono font-light text-base">₹{finalTotal.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {/* Secure Seal */}
                <div className="border-t border-[#DFBA73]/15 pt-6 text-[8px] font-extrabold tracking-widest uppercase text-[#C8C5B9] space-y-2.5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-[#DFBA73]" />
                    <span>Secure 256-bit SSL Session</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift size={14} className="text-[#DFBA73]" />
                    <span>Luxury velvet wrapping included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award size={14} className="text-[#DFBA73]" />
                    <span>Hypoallergenic metal warranty</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
