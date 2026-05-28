import { Variants } from 'framer-motion'

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

export const slowFloat: Variants = {
  float: {
    y: [0, -8, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const subtleHover: Variants = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(0,0,0,0)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(16,16,16,0.08)',
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

export default {
  fadeInUp,
  slowFloat,
  subtleHover,
}
