import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loginCustomer } from './actions'
import { getCurrentUser, getSafeRedirectPath } from '@/lib/auth'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
    error?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = getSafeRedirectPath(params.next)
  const user = await getCurrentUser()

  if (user) {
    redirect(nextPath)
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff0f5,transparent_34%),linear-gradient(135deg,#fffaf7,#f8eef4)] px-6 py-24 text-black lg:px-20">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(70,34,52,0.12)] backdrop-blur md:grid-cols-[1fr_0.9fr]">
        <div className="p-8 sm:p-12 lg:p-16">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#9a6787]">
            Secure Checkout Access
          </p>
          <h1 className="font-serif text-5xl leading-none text-[#190a12] md:text-7xl">
            Sign in before you shine.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600">
            Continue with your email to protect checkout, attach orders to your account, and keep your GURLY bag ready for payment.
          </p>

          <GoogleAuthButton nextPath={nextPath} />

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#ead7df]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-400">
              Or use email
            </span>
            <div className="h-px flex-1 bg-[#ead7df]" />
          </div>

          <form action={loginCustomer} className="space-y-4">
            <input type="hidden" name="next" value={nextPath} />

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">
                Email
              </span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-[#ead7df] bg-white px-5 py-4 text-sm font-medium outline-none transition focus:border-[#7b4867]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">
                Name
              </span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                className="w-full rounded-full border border-[#ead7df] bg-white px-5 py-4 text-sm font-medium outline-none transition focus:border-[#7b4867]"
              />
            </label>

            {params.error ? (
              <p className="rounded-full bg-red-50 px-5 py-3 text-xs font-semibold text-red-700">
                {params.error}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#2b111f] px-6 py-4 text-xs font-bold uppercase tracking-[0.28em] text-white transition hover:bg-[#7b4867]"
            >
              Continue Securely
            </button>
          </form>

          <p className="mt-6 text-xs leading-6 text-neutral-500">
            No password is stored in this version. Your session is protected with a signed HTTP-only cookie.
          </p>
        </div>

        <aside className="relative hidden min-h-[560px] overflow-hidden bg-[#f2dce5] md:block">
          <div className="absolute inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.95),transparent_24%),linear-gradient(140deg,#f7d4df,#b7829e)]" />
          <div className="absolute bottom-14 left-10 right-10 rounded-[1.5rem] border border-white/60 bg-white/45 p-8 shadow-2xl backdrop-blur">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7b4867]">
              Checkout protected
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#190a12]">
              Orders now belong to the signed-in customer.
            </h2>
            <Link href="/shop" className="mt-6 inline-block text-xs font-bold uppercase tracking-[0.24em] underline">
              Return to shop
            </Link>
          </div>
        </aside>
      </section>
    </main>
  )
}
