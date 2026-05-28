"use client"

import Link from 'next/link'
import NextImage from '@/components/ui/NextImage'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

const MOODS = [
  { title: 'Elegant Evenings', slug: 'evening', img: '/images/models/community_1.png' },
  { title: 'Everyday Sparkle', slug: 'everyday', img: '/images/models/community_2.png' },
  { title: 'Bridal Glow', slug: 'bridal', img: '/images/models/community_3.png' },
]

export function MoodSection() {
  return (
    <section className="py-20 bg-warmCream">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-10">
          <h2 className="font-serif text-3xl text-black">Shop By Mood</h2>
          <p className="mt-3 text-neutral-600 max-w-xl">Curated selections to match the moments that matter.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {MOODS.map((mood, idx) => (
            <motion.div key={mood.slug} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-lg overflow-hidden bg-white shadow-sm">
              <Link href={`/shop?mood=${mood.slug}`} className="group block">
                <div className="relative h-56 sm:h-64">
                  <NextImage fill src={mood.img} alt={mood.title} className="group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-black">{mood.title}</h3>
                  <p className="text-sm text-neutral-500 mt-2">Handpicked pieces that evoke refined femininity.</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MoodSection
