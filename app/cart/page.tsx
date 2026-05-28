"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { useCart } from "@/store/cart"

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart()
  const subtotal = total()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="storefront-shell min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 px-6 text-center">
          <div className="empty-shop-state">
            <h1>Your cart is empty</h1>
            <ShoppingBag size={32} className="mx-auto text-black/20" />
            <Link href="/shop" className="store-button store-button-dark">
              Start Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="storefront-shell min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="store-section">
          <div className="section-heading-row">
            <div>
              <p className="store-label">Your selection</p>
              <h1>My Cart ({items.reduce((count, item) => count + item.quantity, 0)})</h1>
            </div>
          </div>
        </section>

        <section className="cart-page-grid">
          <div className="cart-lines">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.article
                  key={item.productId}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="cart-line"
                >
                  <img src={item.image} alt={item.title} />
                  <div className="cart-line-body">
                    <div>
                      <h2>{item.title}</h2>
                      <p>Rs. {item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="cart-line-actions">
                      <div className="cart-qty-row">
                        <button type="button" onClick={() => update(item.productId, item.quantity - 1)} aria-label="Decrease">
                          <Minus size={10} />
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => update(item.productId, item.quantity + 1)} aria-label="Increase">
                          <Plus size={10} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          remove(item.productId)
                          toast.success("Removed")
                        }}
                        aria-label="Remove"
                        className="cart-remove-btn"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <strong>Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</strong>
                </motion.article>
              ))}
            </AnimatePresence>

            <div className="cart-footer-actions">
              <button
                type="button"
                onClick={() => {
                  clear()
                  toast.success("Cart cleared")
                }}
              >
                Clear bag
              </button>
              <Link href="/shop">Continue shopping</Link>
            </div>
          </div>

          <aside className="cart-summary-card">
            <h2>Summary</h2>
            <div>
              <span>Subtotal</span>
              <strong>Rs. {subtotal.toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
            </div>
            {subtotal > 0 && subtotal < 999 && <p>Add Rs. {(999 - subtotal).toLocaleString("en-IN")} more for free shipping</p>}
            <div className="cart-summary-total">
              <span>Total</span>
              <strong>Rs. {orderTotal.toLocaleString("en-IN")}</strong>
            </div>
            <Link href="/checkout" id="proceed-checkout-btn" className="store-button store-button-dark">
              Checkout <ArrowRight size={12} />
            </Link>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  )
}
