"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/store/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, remove, update, total, clear, count } = useCart()
  const subtotal = total()
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99
  const orderTotal = subtotal + shipping

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
            transition={{ type: "spring", stiffness: 240, damping: 28 }}
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
                  {items.map((item) => (
                    <article className="cart-line-item" key={item.productId}>
                      <img src={item.image} alt={item.title} loading="lazy" />
                      <div className="cart-line-content">
                        <h3>{item.title}</h3>
                        <p>Rs. {item.price.toLocaleString("en-IN")}</p>
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
                          toast.success("Item removed")
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </article>
                  ))}
                </div>

                <div className="cart-drawer-summary">
                  <div>
                    <span>Items</span>
                    <strong>{count()}</strong>
                  </div>
                  <div>
                    <span>Subtotal</span>
                    <strong>Rs. {subtotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</strong>
                  </div>
                  <div className="cart-total">
                    <span>Total</span>
                    <strong>Rs. {orderTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <Link href="/checkout" id="drawer-checkout-btn" className="store-button store-button-dark" onClick={onClose}>
                    Checkout <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    className="cart-clear"
                    onClick={() => {
                      clear()
                      toast.success("Cart cleared")
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
