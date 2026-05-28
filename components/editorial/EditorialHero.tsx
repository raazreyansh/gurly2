'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function EditorialHero() {
  return (
    <section className="relative min-h-[95vh] overflow-hidden bg-[#FAF9F5] text-black border-b border-neutral-100 flex items-center">
      <div className="mx-auto max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-[45%_55%] items-stretch min-h-[95vh]">
        
        {/* LEFT COMPONENT: Floating Typography and CTAs */}
        <div className="relative z-10 flex flex-col justify-center px-8 py-20 lg:px-16 lg:py-24 bg-[#FAF9F5]">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase"
            >
              GURLY House Collection
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-[7.5rem] leading-[0.9] text-black uppercase tracking-tight"
            >
              Feminine.
              <br />
              Cinematic.
              <br />
              Eternal.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 max-w-md text-sm leading-8 text-neutral-500 font-medium"
            >
              Discover handcrafted statement earrings, solid gold ornaments, and raw-textured couture accessories curated for contemporary Indian luxury.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-5"
            >
              <Link
                href="/shop"
                className="bg-black border border-black px-10 py-5 text-[10px] tracking-[0.3em] font-bold text-white hover:bg-neutral-900 transition uppercase"
              >
                Shop Collection
              </Link>

              <Link
                href="/about"
                className="border border-neutral-300 px-10 py-5 text-[10px] tracking-[0.3em] font-bold text-black hover:bg-neutral-50 transition uppercase"
              >
                Our House Story
              </Link>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COMPONENT: Editorial Campaign Panel */}
        <div className="relative min-h-[50vh] lg:min-h-0 bg-neutral-200 overflow-hidden lg:border-l border-neutral-100">
          <motion.div
            initial={{ scale: 1.1, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6 }}
            className="absolute inset-0"
          >
            <Image
              src="/images/models/hero_campaign.png"
              alt="GURLY Fashion Editorial"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </motion.div>
          
          {/* subtle lighting backdrop */}
          <div className="absolute inset-0 bg-black/5" />
        </div>

      </div>
    </section>
  )
}
