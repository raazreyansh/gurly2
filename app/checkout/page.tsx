import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?next=/checkout')
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px] bg-white">
      <CheckoutForm customer={{ name: user.fullName || '', email: user.email || '', phone: user.phone || '' }} />
      <OrderSummary />
    </div>
  )
}
