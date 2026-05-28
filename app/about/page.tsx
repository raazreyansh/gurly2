import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="bg-white text-black pt-12 select-none">
      {/* HERO */}
      <section className="grid min-h-[90vh] grid-cols-1 lg:grid-cols-2 border-b border-neutral-100">
        <div className="flex items-center px-8 py-20 lg:px-20 bg-neutral-50">
          <div className="max-w-2xl">
            <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-neutral-400 font-bold">
              ABOUT GURLY
            </p>

            <h1 className="font-serif text-6xl leading-[1.05] lg:text-8xl text-black">
              Crafted For
              <br />
              Modern
              <br />
              Feminine Luxury.
            </h1>

            <p className="mt-10 max-w-xl text-sm leading-8 text-neutral-600 font-medium">
              GURLY is an editorial-inspired luxury accessories label focused
              on handcrafted jhumkas, statement jewelry, and curated feminine
              essentials. Every piece is selected to blend timeless Indian
              artistry with modern elegance.
            </p>
          </div>
        </div>

        <div className="relative h-[60vh] lg:h-[90vh] overflow-hidden bg-neutral-200 lg:border-l border-neutral-100">
          <Image
            src="/images/models/hero_try_on.png"
            alt="GURLY House Collection Model"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* STORY */}
      <section className="border-b border-neutral-100 px-8 py-24 lg:px-20">
        <div className="max-w-[1600px] mx-auto grid gap-20 lg:grid-cols-2">
          <div>
            <p className="mb-5 text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
              OUR STORY
            </p>

            <h2 className="font-serif text-5xl leading-tight text-black uppercase">
              Minimalism.
              <br />
              Elegance.
              <br />
              Expression.
            </h2>
          </div>

          <div>
            <p className="text-sm leading-8 text-neutral-600 font-medium">
              Built with a passion for premium aesthetics and timeless
              craftsmanship, GURLY represents a new generation of Indian luxury
              commerce. The brand merges editorial fashion direction with
              handcrafted accessories that feel intimate, expressive, and
              unforgettable.
            </p>

            <p className="mt-8 text-sm leading-8 text-neutral-600 font-medium">
              Every collection is designed to feel cinematic, emotional, and
              deeply feminine while preserving minimalist sophistication.
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section className="px-8 py-24 lg:px-20 max-w-[1600px] mx-auto">
        <div className="mb-16">
          <p className="mb-5 text-[10px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
            FOUNDERS
          </p>

          <h2 className="font-serif text-5xl text-black uppercase">
            Built By Visionaries.
          </h2>
        </div>

        <div className="grid gap-px bg-neutral-200 lg:grid-cols-2 border border-neutral-200">
          <div className="bg-[#FBFBF9] p-10 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-4xl text-black">
                Satyam Kumar
              </h3>

              <p className="mt-6 max-w-md text-sm leading-7 text-neutral-600 font-medium uppercase text-[11px] tracking-wider">
                Founder of GURLY. Focused on luxury commerce, digital aesthetics,
                modern editorial design systems, and scalable premium experiences.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-[10px] font-bold tracking-[0.25em]">
              <a
                href="https://www.instagram.com/itss.satyaa/?hl=en"
                target="_blank"
                className="hover:opacity-60 transition text-black border-b border-neutral-200 pb-0.5"
              >
                INSTAGRAM
              </a>

              <a
                href="https://github.com/raazreyansh"
                target="_blank"
                className="hover:opacity-60 transition text-black border-b border-neutral-200 pb-0.5"
              >
                GITHUB
              </a>

              <a
                href="https://www.linkedin.com/in/satyaaaa"
                target="_blank"
                className="hover:opacity-60 transition text-black border-b border-neutral-200 pb-0.5"
              >
                LINKEDIN
              </a>
            </div>
          </div>

          <div className="bg-white p-10 flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-4xl text-black">
                Gulshan Kumar
              </h3>

              <p className="mt-6 max-w-md text-sm leading-7 text-neutral-600 font-medium uppercase text-[11px] tracking-wider">
                Co-Founder of GURLY. Helping shape brand direction, creative
                identity, and customer-focused luxury experiences.
              </p>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 text-[10px] font-bold tracking-[0.25em]">
              <a
                href="https://www.instagram.com/krvgulshan_2.1.2.4/?hl=en"
                target="_blank"
                className="hover:opacity-60 transition text-black border-b border-neutral-200 pb-0.5"
              >
                INSTAGRAM
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
