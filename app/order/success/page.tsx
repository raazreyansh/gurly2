import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <main className="bg-white min-h-[70vh] flex items-center justify-center py-20">
      <div className="max-w-md mx-auto px-6 text-center">
        
        <div className="w-16 h-16 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center text-black mx-auto mb-8">
          <CheckCircle2 size={32} />
        </div>

        <h1 className="font-serif text-4xl text-black mb-4">Order Placed!</h1>
        
        <p className="text-neutral-500 text-xs tracking-wider leading-relaxed mb-8 uppercase font-semibold">
          Thank you for shopping with GURLY. We have received your order, and your items are being prepared.
        </p>

        <div className="rounded border border-neutral-100 p-6 bg-neutral-50 inline-block mb-10">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Order Reference</p>
          <p className="font-mono text-xs mt-2 font-semibold">#GURLY-RECENT</p>
        </div>

        <div className="flex flex-col gap-3 justify-center items-center">
          <Link 
            href="/shop" 
            className="w-full bg-black text-white px-8 py-4 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition flex items-center justify-center gap-2"
          >
            Continue Shopping <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>
    </main>
  )
}
