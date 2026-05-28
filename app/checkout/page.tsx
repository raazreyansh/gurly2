import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummary from '@/components/checkout/OrderSummary'

export default function CheckoutPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px] bg-white">
      <CheckoutForm />
      <OrderSummary />
    </div>
  )
}
