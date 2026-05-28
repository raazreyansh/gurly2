import Image from 'next/image'

export default function LookbookGrid() {
  const images = [
    { src: '/images/models/community_1.png', tag: 'Royal Jhumka Collection' },
    { src: '/images/models/community_2.png', tag: 'Luxury Editorial Layer' },
    { src: '/images/models/community_3.png', tag: 'Couture Ring Edit' },
    { src: '/images/models/community_4.png', tag: 'Artisanal Cuff Series' },
  ]

  return (
    <section className="border-t border-neutral-100 bg-white px-8 py-24 lg:px-20 select-none">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase mb-3">
              DIGITAL DIARY INSPIRATIONS
            </p>
            <h2 className="font-serif text-4xl lg:text-5xl text-black uppercase">
              Seen On Instagram.
            </h2>
          </div>
          
          <a
            href="https://www.instagram.com/itss.satyaa/?hl=en"
            target="_blank"
            className="text-[10px] font-bold tracking-[0.3em] uppercase border-b border-neutral-200 pb-0.5 hover:border-black transition"
          >
            Follow @gurly.luxury
          </a>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-neutral-50 border border-neutral-200/50 p-4 transition-all duration-300 hover:border-black"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100 border border-neutral-200/20">
                <Image
                  src={img.src}
                  alt={img.tag}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-750 group-hover:scale-103"
                />
              </div>
              
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold tracking-[0.1em] uppercase text-neutral-400">
                <span>{img.tag}</span>
                <span className="text-black group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
