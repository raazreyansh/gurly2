"use client"

import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart()

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: "60px" }}>
            <ShoppingBag size={48} color="var(--border)" style={{ margin: "0 auto 20px" }} />
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>Your cart is empty</h1>
            <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "15px" }}>Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="btn btn-primary">Start Shopping</Link>
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
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "32px", fontWeight: "500" }}>Shopping Bag</h1>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>{items.reduce((a,b)=>a+b.quantity,0)} item{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "32px" }} className="lg:grid-cols-3">
            {/* Cart Items */}
            <div style={{ gridColumn: "span 2" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border)" }}>
                {items.map((item) => (
                  <div key={item.productId} style={{
                    background: "var(--white)",
                    padding: "24px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "flex-start",
                  }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "100px", height: "130px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "16px", fontWeight: "400", marginBottom: "8px" }}>{item.title}</h3>
                      <p className="price" style={{ marginBottom: "20px" }}>₹{item.price.toLocaleString("en-IN")}</p>

                      {/* Quantity */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "2px" }}>
                          <button
                            id={`qty-minus-${item.productId}`}
                            onClick={() => update(item.productId, item.quantity - 1)}
                            style={{ width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--charcoal)" }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ width: "36px", textAlign: "center", fontSize: "14px" }}>{item.quantity}</span>
                          <button
                            id={`qty-plus-${item.productId}`}
                            onClick={() => update(item.productId, item.quantity + 1)}
                            style={{ width: "36px", height: "36px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--charcoal)" }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <button
                          id={`remove-${item.productId}`}
                          onClick={() => { remove(item.productId); toast.success("Item removed") }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", transition: "color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#e53e3e")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <div className="price" style={{ whiteSpace: "nowrap" }}>
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { clear(); toast.success("Cart cleared") }} style={{ marginTop: "16px", background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div>
              <div style={{ background: "var(--white)", border: "1px solid var(--border)", padding: "28px", borderRadius: "4px", position: "sticky", top: "calc(var(--nav-h) + 20px)" }}>
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "20px", marginBottom: "24px" }}>Order Summary</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--charcoal-light)" }}>
                    <span>Subtotal</span>
                    <span>₹{total().toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "var(--charcoal-light)" }}>
                    <span>Shipping</span>
                    <span style={{ color: "#2E7D32" }}>{total() >= 999 ? "Free" : "₹99"}</span>
                  </div>
                  {total() < 999 && (
                    <p style={{ fontSize: "11px", color: "var(--rose)", background: "rgba(201,149,108,0.08)", padding: "8px 12px", borderRadius: "2px" }}>
                      Add ₹{(999 - total()).toLocaleString("en-IN")} more for free shipping!
                    </p>
                  )}
                </div>

                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginBottom: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", fontSize: "16px" }}>
                    <span>Total</span>
                    <span>₹{(total() + (total() >= 999 ? 0 : 99)).toLocaleString("en-IN")}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>GST included</p>
                </div>

                <Link href="/checkout" className="btn btn-primary" id="proceed-checkout-btn" style={{ width: "100%", gap: "10px" }}>
                  Proceed to Checkout <ArrowRight size={15} />
                </Link>
                <Link href="/shop" style={{ display: "block", textAlign: "center", marginTop: "14px", fontSize: "12px", color: "var(--muted)", letterSpacing: "0.06em" }}>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
