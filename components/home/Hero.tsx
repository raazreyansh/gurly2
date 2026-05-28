"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import NextImage from '@/components/ui/NextImage'
import { fadeInUp, slowFloat } from '@/lib/motion'

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[640px] flex items-center overflow-hidden bg-pearl">

      <div className="absolute inset-0">
        <NextImage fill src="/images/models/hero_try_on.png" alt="GURLY New Collection" className="" />
        <div className="absolute inset-0 bg-black/22 mix-blend-multiply" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full flex items-center">
        <div className="w-full lg:w-1/2 py-20 lg:py-32">
          <motion.h1 initial="hidden" animate="visible" variants={fadeInUp} className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight">
            The New Standard
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25 } }} className="text-white/90 mt-6 text-sm md:text-base uppercase tracking-[0.2em]">
            Unapologetic Luxury
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }} className="mt-10">
            <Link href="/shop" className="inline-block bg-white text-black px-10 py-4 uppercase tracking-[0.15em] text-xs font-semibold shadow-sm hover:shadow-md transition-shadow">
              Shop The Drop
            </Link>
          </motion.div>
        </div>

        <div className="hidden lg:block w-1/2 pl-12">
          <motion.div variants={slowFloat} animate="float" className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-2xl">
            <NextImage fill src="/images/models/hero_try_on_closeup.png" alt="Model closeup" className="" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
