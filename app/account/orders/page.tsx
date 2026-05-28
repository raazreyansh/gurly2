import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AccountOrdersPage() {
  let orders: any[] = []

  try {
    orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error("Failed to retrieve account orders:", error)
  }

  return (
    <div className="min-h-screen bg-white px-6 py-24 lg:px-20 text-black">
      <div className="mx-auto max-w-[1600px]">
        {/* Header Title */}
        <div className="mb-16 border-b border-neutral-200 pb-10">
          <p className="mb-4 text-[9px] tracking-[0.35em] text-neutral-400 font-bold uppercase">
            MY WORKSPACE
          </p>

          <h1 className="font-serif text-5xl lg:text-7xl uppercase text-black leading-tight">
            Order History.
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

              <Link href="/account/orders" className="block text-black">
                ORDERS ({orders.length})
              </Link>

              <Link href="/account/addresses" className="block hover:text-black transition">
                ADDRESSES
              </Link>

              <Link href="/wishlist" className="block hover:text-black transition">
                WISHLIST
              </Link>
            </div>
          </aside>

          {/* Account information details */}
          <section className="border border-neutral-200 bg-[#FBFBF9] p-8 lg:p-12">
            <div className="mb-10 flex items-baseline justify-between border-b border-neutral-200 pb-6">
              <div>
                <h2 className="font-serif text-3xl text-black">
                  Transactions
                </h2>
                <p className="text-[9px] text-neutral-400 font-bold tracking-widest uppercase mt-1">All standard invoices and tracking states</p>
              </div>
            </div>

            {/* List container */}
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="py-16 text-center flex flex-col justify-center items-center gap-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 font-semibold">No transactions recorded yet</p>
                  <Link 
                    href="/shop"
                    className="text-[10px] tracking-widest font-bold uppercase underline text-black hover:opacity-75 transition"
                  >
                    View Collections
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border border-neutral-200 bg-white px-6 py-6"
                  >
                    <div>
                      <p className="text-xs font-bold tracking-wider text-black">
                        ORDER #{order.id.slice(0, 8).toUpperCase()}
                      </p>

                      <p className="mt-2 text-[9px] font-bold tracking-[0.15em] text-emerald-600 uppercase">
                        {order.status || 'PROCESSING'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold font-mono text-black">
                        ₹{Number(order.total).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
