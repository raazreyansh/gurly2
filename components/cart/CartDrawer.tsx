"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/store/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, update, total, clear, count } = useCart()
  const subtotal = total()
  const shippingThreshold = 999
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99
  const remainingForFreeShipping = shippingThreshold - subtotal
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="store-drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            data-testid="cart-drawer"
            className="store-cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
            aria-label="Shopping cart drawer"
          >
            <div className="cart-drawer-header">
              <div>
                <p className="store-label">Luxury tray</p>
                <h2>Your Cart</h2>
              </div>
              <button type="button" onClick={onClose} className="icon-button" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Driver */}
            {items.length > 0 && (
              <div className="shipping-progress-panel">
                {subtotal >= shippingThreshold ? (
                  <p className="shipping-message text-emerald flex items-center gap-1.5 justify-center">
                    <Sparkles size={13} fill="currentColor" /> You have unlocked <strong>FREE shipping!</strong>
                  </p>
                ) : (
                  <p className="shipping-message">
                    Add <strong>₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong>FREE shipping</strong>
                  </p>
                )}
                <div className="shipping-progress-rail">
                  <motion.div 
                    className="shipping-progress-bar bg-rose" 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {items.length === 0 ? (
              <div className="cart-drawer-empty">
                <ShoppingBag size={42} />
                <h3>Your bag is empty</h3>
                <p>Start with earrings, bracelets, necklaces, or gift-ready accessories.</p>
                <Link href="/shop" className="store-button store-button-dark" onClick={onClose}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-drawer-items">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.article 
                        className="cart-line-item" 
                        key={item.productId}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <img src={item.image} alt={item.title} loading="lazy" />
                        <div className="cart-line-content">
                          <h3>{item.title}</h3>
                          <p>₹{item.price.toLocaleString("en-IN")}</p>
                          <div className="cart-qty-row">
                            <button type="button" aria-label="Decrease quantity" onClick={() => update(item.productId, item.quantity - 1)}>
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button type="button" aria-label="Increase quantity" onClick={() => update(item.productId, item.quantity + 1)}>
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="cart-remove"
                          aria-label={`Remove ${item.title}`}
                          onClick={() => {
                            remove(item.productId)
                            toast.success(`${item.title} removed from cart`, {
                              icon: "🗑️",
                              style: {
                                background: "rgba(255, 255, 255, 0.9)",
                                color: "var(--charcoal)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(15, 23, 42, 0.1)",
                              }
                            })
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="cart-drawer-summary">
                  <div>
                    <span>Items</span>
                    <strong>{count()}</strong>
                  </div>
                  <div>
                    <span>Subtotal</span>
                    <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>₹{(subtotal + shipping).toLocaleString("en-IN")}</strong>
                  </div>
                  <Link href="/checkout" id="drawer-checkout-btn" className="store-button store-button-dark" onClick={onClose}>
                    Checkout <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    className="cart-clear"
                    onClick={() => {
                      clear()
                      toast.success("Cart cleared", { icon: "🧹" })
                    }}
                  >
                    Clear cart
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
