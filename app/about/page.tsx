"use client"

import { StorefrontLayout } from '@/components/layout/StorefrontLayout'

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="text-center mb-20">
            <p className="uppercase tracking-[0.2em] text-xs text-neutral-500 mb-3">Our Story</p>
            <h1 className="font-serif text-5xl text-black mb-6">About GURLY</h1>
            <p className="text-neutral-600 leading-relaxed max-w-xl mx-auto text-sm">
              GURLY was founded with a singular, elegant vision: to curate modern, premium fashion accessories that bring out your innate brilliance. Every piece in our collection is chosen with deliberate care to ensure it embodies timeless charm and premium quality.
            </p>
          </div>

          {/* Founders */}
          <h2 className="font-serif text-3xl text-black mb-12 text-center">Meet the Founders</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Satyam Card */}
            <div className="border border-neutral-100 p-8 text-center bg-neutral-50">
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-serif mx-auto mb-6">
                SK
              </div>
              <h3 className="font-serif text-xl text-black mb-1">Satyam Kumar</h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4 font-semibold">Founder & CEO</p>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Oversees product development, database planning, and live systems architectural design.
              </p>
            </div>

            {/* Gulshan Card */}
            <div className="border border-neutral-100 p-8 text-center bg-neutral-50">
              <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-serif mx-auto mb-6">
                GK
              </div>
              <h3 className="font-serif text-xl text-black mb-1">Gulshan Kumar</h3>
              <p className="text-xs uppercase tracking-widest text-neutral-400 mb-4 font-semibold">Co-Founder & COO</p>
              <p className="text-neutral-500 text-sm leading-relaxed">
                Drives operations, catalog curations, design aesthetics, and the luxury boutique customer experience.
              </p>
            </div>
          </div>

          <div className="mt-20 border-t border-neutral-100 pt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-serif text-lg mb-3 text-black">Our Craftsmanship</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Each piece is plated with care and finishes are tested for longevity. Our partners maintain high ethical standards in sourcing materials.</p>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-3 text-black">Quiet Sustainability</h3>
              <p className="text-neutral-500 text-sm leading-relaxed">We prioritize responsible packaging and reduced waste across our supply chain, ensuring premium presentation with minimal footprint.</p>
            </div>
          </div>
        </div>
      </main>
    </StorefrontLayout>
  )
}
