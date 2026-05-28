import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
