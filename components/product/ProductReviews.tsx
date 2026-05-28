'use client'

import { useState } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { submitReview } from '@/app/product/actions'

interface Review {
  id: string
  rating: number
  comment: string
  customer: string
  verified: boolean
  createdAt: Date
}

export default function ProductReviews({
  productId,
  slug,
  reviews,
}: {
  productId: string
  slug: string
  reviews: Review[]
}) {
  const [rating, setRating] = useState(5)
  const [customer, setCustomer] = useState('')
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await submitReview({
      productId,
      rating,
      comment,
      customer,
      slug,
    })

    if (res.success) {
      setCustomer('')
      setComment('')
      setRating(5)
      alert('Thank you! Your verified curation review has been added to our catalog.')
    } else {
      setError(res.error || 'Failed to submit review')
    }

    setSubmitting(false)
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <section className="bg-white border-t border-neutral-100 py-24 select-none px-6 lg:px-20">
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-[40%_60%] gap-16 items-start">
        
        {/* LEFT COLUMN: Summary & Submission Form */}
        <div className="space-y-10 border border-neutral-200 p-8 lg:p-10 bg-[#FAF9F5]">
          <div>
            <p className="text-[9px] tracking-[0.35em] text-neutral-400 font-bold uppercase mb-2">
              CATALOG RATING SUMMARY
            </p>
            <h2 className="font-serif text-3xl text-black uppercase">
              Customer Voices.
            </h2>
            
            {/* Aggregate Stars */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-serif text-black">{averageRating}</span>
              <div className="space-y-1">
                <div className="flex text-black">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4.5 w-4.5 ${
                        s <= Math.round(Number(averageRating))
                          ? 'fill-current'
                          : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                  Based on {reviews.length} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleReviewSubmit} className="space-y-5 pt-8 border-t border-neutral-200/60">
            <h3 className="text-[10px] tracking-[0.25em] font-bold text-black uppercase mb-4">
              Write a Verified Curation Review
            </h3>

            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 p-3 uppercase tracking-wider">
                {error}
              </p>
            )}

            {/* Star Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Rating *</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        val <= rating ? 'text-black fill-current' : 'text-neutral-200 hover:text-neutral-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Your Full Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Satyam Kumar"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="border border-neutral-200 p-3.5 text-xs font-semibold text-black uppercase tracking-wider focus:border-black focus:outline-none bg-white"
              />
            </div>

            {/* Comments Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[9px] tracking-widest font-bold uppercase text-neutral-400">Curation Comments *</label>
              <textarea
                required
                rows={3}
                placeholder="Share details regarding craftsmanship weight, anti-tarnish look..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-neutral-200 p-3.5 text-xs font-semibold text-black focus:border-black focus:outline-none bg-white"
              />
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-black py-4 text-xs font-semibold tracking-[0.3em] uppercase text-white hover:opacity-85 transition disabled:opacity-50 mt-4 cursor-pointer"
            >
              {submitting ? 'RECORDING VOICE...' : 'SUBMIT CATALOG REVIEW'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Reviews list feed */}
        <div className="space-y-8">
          <p className="text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase border-b border-neutral-100 pb-3">
            VERIFIED REVIEW LOGS ({reviews.length})
          </p>

          {reviews.length === 0 ? (
            <div className="py-16 text-center border border-neutral-200 bg-[#FBFBF9] flex flex-col justify-center items-center gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">No verified reviews recorded yet</p>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Be the first to submit your opinion on this jewel.</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-neutral-200 bg-white p-6 space-y-4 hover:border-black transition duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                        {rev.customer}
                      </h4>
                      <p className="text-[9px] font-mono text-neutral-400 mt-0.5">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {rev.verified && (
                      <span className="flex items-center gap-1 text-[8px] font-bold tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 uppercase">
                        <CheckCircle className="h-3 w-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Stars Row */}
                  <div className="flex text-black">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating ? 'fill-current' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs leading-relaxed text-neutral-500 font-medium tracking-wide">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
