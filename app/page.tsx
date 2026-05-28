import HeroSection from '@/components/home/HeroSection'
import TrustStrip from '@/components/home/TrustStrip'
import EditorialCategories from '@/components/home/EditorialCategories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import { autoSeedDatabase } from '@/lib/db-seed'

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Sync live products database if first load is empty
  await autoSeedDatabase()

  return (
    <div className="bg-white">
      <HeroSection />
      <TrustStrip />
      <EditorialCategories />
      <FeaturedProducts />
    </div>
  )
}
