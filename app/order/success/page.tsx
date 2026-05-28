"use client"

import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Package } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen py-28 flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mx-auto mb-8 animate-fade-in">
            <CheckCircle2 size={40} />
          </div>

          <h1 className="font-serif text-4xl text-black mb-6">Order Placed!</h1>
          
          <p className="text-neutral-500 text-sm leading-relaxed mb-8">
            Thank you for shopping with GURLY. We have received your order, and you will receive a confirmation email shortly. Your items will be carefully prepared and dispatched soon.
          </p>

          <div className="rounded-md border border-neutral-100 p-6 bg-neutral-50 inline-block mb-10">
            <p className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">Order Reference</p>
            <p className="font-mono text-sm mt-2 font-medium">#GURLY-{Math.floor(Math.random() * 900000 + 100000)}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/shop" 
              className="w-full sm:w-auto bg-black text-white px-8 py-3 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition"
            >
              Continue Shopping
            </Link>
            <Link 
              href="/account/orders" 
              className="w-full sm:w-auto border border-neutral-200 text-neutral-600 hover:border-black hover:text-black px-8 py-3 text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2"
            >
              <Package size={14} /> Track Orders
            </Link>
          </div>

        </div>
      </main>
    </StorefrontLayout>
  )
}
