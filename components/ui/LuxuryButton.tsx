'use client'

import { motion } from 'framer-motion'

export default function LuxuryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{
        scale: 1.015,
        opacity: 0.9,
      }}
      whileTap={{
        scale: 0.985,
      }}
      transition={{ duration: 0.2 }}
      className={`bg-black text-white px-8 py-5 text-[10px] tracking-[0.3em] font-bold uppercase hover:shadow-lg transition select-none disabled:opacity-50 ${className}`}
    >
      {children}
    </motion.button>
  )
}
