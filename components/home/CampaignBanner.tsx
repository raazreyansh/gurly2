"use client"

import Link from 'next/link'
import NextImage from '@/components/ui/NextImage'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/motion'

export function CampaignBanner() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="order-2 lg:order-1">
          <h2 className="font-serif text-3xl text-brandBlack">Editorial Campaign</h2>
          <p className="mt-4 text-neutral-600 max-w-lg">A quietly elevated capsule celebrating craftsmanship and timeless silhouettes.</p>
          <div className="mt-8">
            <Link href="/collections/campaign" className="inline-block bg-brandBlack text-white px-8 py-3 uppercase text-xs tracking-[0.12em]">Explore Campaign</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="order-1 lg:order-2">
          <div className="rounded-xl overflow-hidden shadow-lg h-72 sm:h-96">
            <NextImage fill src="/images/models/community_4.png" alt="Campaign" className="object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CampaignBanner
