"use client"

import NextImage from '@/components/ui/NextImage'
import { motion } from 'framer-motion'
import { subtleHover } from '@/lib/motion'

const IMAGES = ['/images/models/community_1.png','/images/models/community_2.png','/images/models/community_3.png','/images/models/community_4.png']

export function CommunityGallery() {
  return (
    <section className="py-20 bg-lavender">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <h2 className="font-serif text-3xl text-brandBlack">Community</h2>
          <p className="mt-2 text-neutral-600">Real customers wearing GURLY — curated and refined.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {IMAGES.map((src, idx) => (
            <motion.div key={src} initial="rest" whileHover="hover" animate="rest" variants={subtleHover} className="rounded-lg overflow-hidden">
              <div className="relative h-44">
                <NextImage fill src={src} alt={`Community ${idx + 1}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunityGallery
