"use client"

import { useCart } from "@/store/cart"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Gift, Award } from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart()
  const subtotal = total()
  const shippingThreshold = 999
  const shipping = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99
  const remainingForFreeShipping = shippingThreshold - subtotal
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100)

  if (items.length === 0) {
    return (
      <div className="storefront-shell flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-20 px-4">
          <motion.div 
            className="newsletter-glass max-w-lg w-100 text-center p-12 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-16 h-16 bg-rose-light/10 text-rose rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={28} />
            </div>
            <h1 className="font-serif text-3xl font-medium text-charcoal mb-4">Your Shopping Bag is Empty</h1>
            <p className="text-muted text-sm max-w-sm mx-auto mb-8">
              Looks like you haven&apos;t added any luxury jewelry or premium accessories to your selection yet.
            </p>
            <Link href="/shop" className="store-button store-button-dark liquid-shine">
              Explore Our Store
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="storefront-shell flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pb-24">
        {/* Luxury Page Header */}
        <div className="py-12 bg-gradient-to-b from-sky-light/30 to-transparent border-b border-white/40">
          <div className="container">
            <p className="store-label mb-2">Luxury selection</p>
            <h1 className="font-serif text-4xl font-medium text-charcoal">Your Shopping Bag</h1>
            <p className="text-muted text-xs mt-2">
              {items.reduce((a, b) => a + b.quantity, 0)} item{items.reduce((a, b) => a + b.quantity, 0) !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>

        <div className="container mt-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Cart Line Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div 
                      key={item.productId} 
                      className="cart-line-item relative p-6 bg-white/70 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl grid grid-cols-1 sm:grid-cols-[100px_1fr_auto] gap-6 items-center"
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full sm:w-[100px] h-[130px] object-cover rounded-2xl shadow-sm border border-slate-100 flex-shrink-0"
                      />
                      <div className="space-y-2">
                        <span className="store-label text-[9px]">Earrings & Accessories</span>
                        <h3 className="font-serif text-lg font-medium text-charcoal">{item.title}</h3>
                        <p className="text-rose font-bold text-sm">₹{item.price.toLocaleString("en-IN")}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-4 pt-2">
                          <div className="quantity-control shadow-none border border-slate-100 bg-white">
                            <button
                              id={`qty-minus-${item.productId}`}
                              type="button"
                              onClick={() => update(item.productId, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-sm font-bold text-charcoal">{item.quantity}</span>
                            <button
                              id={`qty-plus-${item.productId}`}
                              type="button"
                              onClick={() => update(item.productId, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          
                          <button
                            id={`remove-${item.productId}`}
                            type="button"
                            className="text-muted hover:text-rose transition-colors duration-200"
                            onClick={() => { 
                              remove(item.productId); 
                              toast.success(`${item.title} removed from bag`, { icon: "🗑️" }) 
                            }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="font-serif font-bold text-lg text-charcoal sm:text-right">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button 
                  onClick={() => { clear(); toast.success("Cart cleared", { icon: "🧹" }) }}
                  className="text-muted hover:text-charcoal text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  Clear Shopping Bag
                </button>
                <Link href="/shop" className="text-link text-xs font-bold uppercase">
                  Continue Discovery
                </Link>
              </div>
            </div>

            {/* Sticky Order Summary */}
            <div className="lg:col-span-1">
              <aside className="sticky-buy-panel p-8 bg-white/80 border border-white/90 rounded-3xl shadow-lg space-y-6">
                <h2 className="font-serif text-2xl font-medium text-charcoal">Order Summary</h2>

                {/* Free Shipping bar inside page */}
                <div className="shipping-progress-panel bg-rose-light/5 border border-dashed border-rose/20 rounded-2xl p-4">
                  {subtotal >= shippingThreshold ? (
                    <p className="shipping-message text-emerald text-xs font-bold text-center">
                      ✨ You have unlocked FREE shipping!
                    </p>
                  ) : (
                    <>
                      <p className="shipping-message text-xs text-charcoal-light text-center mb-2">
                        Add <strong>₹{remainingForFreeShipping.toLocaleString("en-IN")}</strong> more for <strong>FREE shipping</strong>
                      </p>
                      <div className="shipping-progress-rail bg-slate-100 h-1.5 w-full rounded-full overflow-hidden">
                        <div 
                          className="shipping-progress-bar bg-rose h-full rounded-full" 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4 text-sm text-charcoal-light border-b border-slate-100 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-emerald font-bold" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Keepsake Wrapping</span>
                    <span className="text-emerald font-bold">Free</span>
                  </div>
                </div>

                <div className="space-y-2 pb-6 border-b border-slate-100">
                  <div className="flex justify-between text-charcoal font-bold text-lg">
                    <span>Total</span>
                    <span className="font-serif text-xl">₹{(subtotal + shipping).toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[10px] text-muted tracking-wider text-right uppercase">GST & Custom Duties Included</p>
                </div>

                <div className="space-y-4">
                  <Link 
                    href="/checkout" 
                    className="store-button store-button-dark w-full liquid-shine flex items-center justify-center gap-2 py-4"
                    id="proceed-checkout-btn"
                  >
                    Proceed to Checkout <ArrowRight size={15} />
                  </Link>
                </div>

                {/* Trust Seals */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-charcoal-light font-medium">
                    <ShieldCheck size={16} className="text-rose" />
                    <span>Secure 256-bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-charcoal-light font-medium">
                    <Gift size={16} className="text-rose" />
                    <span>Luxury Keepsake packaging included</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-charcoal-light font-medium">
                    <Award size={16} className="text-rose" />
                    <span>100% Skin-friendly skin polish guarantee</span>
                  </div>
                </div>
              </aside>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
