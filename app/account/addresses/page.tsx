import Link from 'next/link'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logoutCustomer } from '@/app/login/actions'

export const dynamic = 'force-dynamic'

export default async function AccountAddressesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/account/addresses')
  }

  const address = await prisma.address.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      isDefault: 'desc',
    },
  })

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

              <form action={logoutCustomer}>
                <button type="submit" className="text-left hover:text-black transition">
                  LOGOUT
                </button>
              </form>
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

            {address ? (
              <div className="bg-white border border-neutral-200 p-8 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-black font-serif">{address.name}</h3>
                <div className="text-xs text-neutral-500 space-y-1.5 font-medium uppercase tracking-wide leading-relaxed">
                  <p>{address.line1}</p>
                  {address.line2 ? <p>{address.line2}</p> : null}
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <p>{address.country}</p>
                  <p className="mt-4 text-black font-bold">Phone: {address.phone}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 p-8 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  No saved address yet. Your checkout address will be attached to future order handling.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
