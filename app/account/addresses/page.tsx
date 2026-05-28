import Link from 'next/link'

export default function AccountAddressesPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-24 lg:px-20 text-black">
      <div className="mx-auto max-w-[1600px]">
        {/* Header Title */}
        <div className="mb-16 border-b border-neutral-200 pb-10">
          <p className="mb-4 text-[9px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
            MY WORKSPACE
          </p>

          <h1 className="font-serif text-5xl lg:text-7xl uppercase text-black leading-tight">
            My Addresses.
          </h1>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Side navigation controls */}
          <aside className="border border-neutral-200 bg-white p-8 h-fit">
            <div className="space-y-6 text-[10px] tracking-[0.25em] font-bold text-neutral-400 uppercase">
              <Link href="/account" className="block hover:text-black transition">
                OVERVIEW
              </Link>

              <Link href="/account/orders" className="block hover:text-black transition">
                ORDERS
              </Link>

              <Link href="/account/addresses" className="block text-black">
                ADDRESSES
              </Link>

              <Link href="/wishlist" className="block hover:text-black transition">
                WISHLIST
              </Link>
            </div>
          </aside>

          {/* Account address details */}
          <section className="border border-neutral-200 bg-[#FBFBF9] p-8 lg:p-12">
            <div className="mb-10 flex items-baseline justify-between border-b border-neutral-200 pb-6">
              <div>
                <h2 className="font-serif text-3xl text-black">
                  Primary Address
                </h2>
                <p className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase mt-1">Default express shipping destination</p>
              </div>
            </div>

            <div className="bg-white border border-neutral-200 p-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black font-serif">Satyam Kumar</h3>
              <div className="text-xs text-neutral-500 space-y-1.5 font-medium uppercase tracking-wide leading-relaxed">
                <p>Suite 202, Luxury Residency</p>
                <p>New Delhi, Delhi — 110001</p>
                <p>India</p>
                <p className="mt-4 text-black font-bold">Phone: +91 98765 43210</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
