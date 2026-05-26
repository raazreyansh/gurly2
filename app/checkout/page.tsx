"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { validateCoupon } from "@/services/coupon"
import { toast } from "sonner"
import { MapPin, CreditCard, Tag } from "lucide-react"

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

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponMsg, setCouponMsg] = useState("")
  const [step, setStep] = useState<"address" | "payment">("address")

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema)
  })

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
    toast.success("Coupon applied!")
  }

  async function handlePayment() {
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      })
      const order = await res.json()
      if (order.id) {
        toast.success("Payment initiated!")
        // Razorpay integration happens here with the order.id
      }
    } catch {
      toast.error("Payment failed. Try again.")
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "16px" }}>Your cart is empty</h1>
            <Link href="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
          <div className="container">
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: "500" }}>Checkout</h1>
            {/* Steps */}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px", alignItems: "center" }}>
              {[
                { id: "address", label: "Delivery Address", Icon: MapPin },
                { id: "payment", label: "Payment", Icon: CreditCard },
              ].map(({ id, label, Icon }, i) => (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {i > 0 && <div style={{ width: "40px", height: "1px", background: "var(--border)" }} />}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: step === id ? "var(--charcoal)" : "var(--cream-dark)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={13} color={step === id ? "white" : "var(--muted)"} />
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: step === id ? "600" : "400", color: step === id ? "var(--charcoal)" : "var(--muted)" }}>
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px 80px" }}>
          <div style={{ display: "grid", gap: "32px" }} className="lg:grid-cols-2">
            {/* Left: Form */}
            <div>
              {step === "address" ? (
                <form onSubmit={handleSubmit(() => setStep("payment"))}>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={18} color="var(--rose)" /> Delivery Address
                  </h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                      { name: "name", placeholder: "Full Name", cols: 2 },
                      { name: "phone", placeholder: "Phone Number", cols: 1 },
                      { name: "pincode", placeholder: "PIN Code", cols: 1 },
                      { name: "line1", placeholder: "Address Line 1", cols: 2 },
                      { name: "line2", placeholder: "Address Line 2 (Optional)", cols: 2 },
                      { name: "city", placeholder: "City", cols: 1 },
                      { name: "state", placeholder: "State", cols: 1 },
                    ].map(({ name, placeholder, cols }) => (
                      <div key={name} style={{ gridColumn: `span ${cols}` }}>
                        <input
                          id={`checkout-${name}`}
                          {...register(name as keyof AddressForm)}
                          placeholder={placeholder}
                          className="input"
                        />
                        {errors[name as keyof AddressForm] && (
                          <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>
                            {errors[name as keyof AddressForm]?.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-primary" id="checkout-continue-btn" style={{ marginTop: "24px", width: "100%" }}>
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div>
                  <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "22px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CreditCard size={18} color="var(--rose)" /> Payment
                  </h2>
                  <div style={{ background: "var(--cream-dark)", borderRadius: "4px", padding: "24px", marginBottom: "20px", fontSize: "13px", color: "var(--charcoal-light)", lineHeight: "1.7" }}>
                    <p>Secure checkout redirects to Razorpay&apos;s payment gateway.</p>
                    <p style={{ marginTop: "8px" }}>Supported: UPI, Credit/Debit Card, Net Banking, Wallets</p>
                  </div>
                  <button className="btn btn-primary" id="pay-now-btn" onClick={handlePayment} style={{ width: "100%", fontSize: "14px" }}>
                    Pay ₹{finalTotal.toLocaleString("en-IN")} Securely
                  </button>
                  <button onClick={() => setStep("address")} style={{ marginTop: "12px", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--muted)", width: "100%", textAlign: "center", letterSpacing: "0.06em" }}>
                    ← Back to Address
                  </button>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
            <div>
              <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "28px", borderRadius: "4px", position: "sticky", top: "calc(var(--nav-h) + 20px)" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "20px" }}>Order Summary</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  {items.map((item) => (
                    <div key={item.productId} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <img src={item.image} alt={item.title} style={{ width: "56px", height: "72px", objectFit: "cover", borderRadius: "2px" }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: "500" }}>{item.title}</p>
                        <p style={{ fontSize: "12px", color: "var(--muted)" }}>Qty: {item.quantity}</p>
                      </div>
                      <p className="price" style={{ fontSize: "13px" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <Tag size={14} color="var(--muted)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        id="coupon-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="COUPON CODE"
                        className="input"
                        style={{ paddingLeft: "36px", fontSize: "12px", letterSpacing: "0.08em" }}
                      />
                    </div>
                    <button onClick={applyCoupon} className="btn btn-outline" id="apply-coupon-btn" style={{ padding: "10px 16px", fontSize: "11px" }}>
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p style={{ fontSize: "12px", color: couponMsg.startsWith("✓") ? "#2E7D32" : "var(--rose)" }}>
                      {couponMsg}
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--charcoal-light)" }}>
                    <span>Subtotal</span><span>₹{total().toLocaleString("en-IN")}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#2E7D32" }}>
                      <span>Coupon Discount</span><span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--charcoal-light)" }}>
                    <span>Shipping</span><span style={{ color: shipping === 0 ? "#2E7D32" : "inherit" }}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", borderTop: "1px solid var(--border)", paddingTop: "12px", marginTop: "4px" }}>
                    <span>Total</span><span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
