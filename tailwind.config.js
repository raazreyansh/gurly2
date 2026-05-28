/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        champagne: '#F6EDE6',
        pearl: '#FEFEFC',
        lavender: '#E9E6F2',
        dustyRose: '#CFA8A0',
        warmCream: '#FFF7EE',
        mutedGold: '#BFA36A',
        brandBlack: '#111010'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
