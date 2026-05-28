import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import SearchDrawer from '@/components/search/SearchDrawer'
import MobileBottomBar from '@/components/mobile/MobileBottomBar'

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between pb-16 lg:pb-0">
      <Navbar />
      <CartDrawer />
      <SearchDrawer />
      <main className="flex-grow">{children}</main>
      <MobileBottomBar />
      <Footer />
    </div>
  )
}
