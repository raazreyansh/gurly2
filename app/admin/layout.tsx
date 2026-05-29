import AdminShell from '@/components/admin/AdminShell'
import { getCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/admin')
  }

  if (user.role !== 'admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-black">
        <section className="max-w-xl border border-neutral-200 bg-neutral-50 p-10">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-400">
            Admin Access Restricted
          </p>
          <h1 className="font-serif text-4xl text-black">This area is for administrators only.</h1>
          <p className="mt-5 text-sm leading-7 text-neutral-600">
            Your account is signed in, but it does not have the admin role required to view dashboard metrics, orders, or catalog controls.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account"
              className="bg-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white"
            >
              Go To Account
            </Link>
            <Link
              href="/"
              className="border border-neutral-300 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-black"
            >
              Storefront
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return <AdminShell>{children}</AdminShell>
}
