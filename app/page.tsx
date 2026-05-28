import HeroSection from '@/components/home/HeroSection'
import EditorialCategories from '@/components/home/EditorialCategories'
import FeaturedProducts from '@/components/home/FeaturedProducts'

export const dynamic = "force-dynamic"

export default async function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <EditorialCategories />
      <FeaturedProducts />
    </div>
  )
}
