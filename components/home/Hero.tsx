import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-neutral-100">
      
      <Image
        src="/images/models/hero_try_on.png"
        alt="GURLY New Collection"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 text-center px-6">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6">
          The New Standard
        </h1>
        <p className="text-white/90 text-sm md:text-base uppercase tracking-[0.2em] mb-10">
          Unapologetic Luxury.
        </p>
        <Link 
          href="/shop" 
          className="inline-block bg-white text-black px-10 py-4 uppercase tracking-[0.15em] text-xs font-semibold hover:bg-black hover:text-white transition-colors"
        >
          Shop The Drop
        </Link>
      </div>

    </section>
  )
}
