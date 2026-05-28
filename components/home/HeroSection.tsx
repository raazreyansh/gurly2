'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="grid min-h-[92vh] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center px-10 lg:px-20 bg-neutral-50 py-16">
        <div className="max-w-xl">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-semibold"
          >
            Timeless jewels. Made for you.
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-lg font-serif text-6xl leading-[1.05] lg:text-8xl text-black"
          >
            Unapologetic.
            <br />
            Feminine.
            <br />
            In Every Detail.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 max-w-md text-sm leading-7 text-neutral-600 font-medium"
          >
            Discover handcrafted jhumkas, luxury accessories, and statement essentials curated for modern elegance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              href="/shop"
              className="bg-black px-8 py-4 text-[11px] tracking-[0.2em] font-semibold text-white hover:opacity-80 transition"
            >
              SHOP NOW
            </Link>

            <Link
              href="/shop"
              className="border border-neutral-200 px-8 py-4 text-[11px] tracking-[0.2em] font-semibold text-black hover:bg-neutral-100 transition"
            >
              EXPLORE COLLECTIONS
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative h-[60vh] lg:h-[92vh] overflow-hidden bg-neutral-200 border-t lg:border-t-0 lg:border-l border-neutral-200">
        <motion.img
          initial={{ scale: 1.05, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="/images/models/hero_try_on.png"
          alt="GURLY Luxury Fashion Model"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  )
}
