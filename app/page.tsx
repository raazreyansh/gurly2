import EditorialHero from '@/components/editorial/EditorialHero'
import TrustStrip from '@/components/home/TrustStrip'
import EditorialCategories from '@/components/home/EditorialCategories'
import TrendingScroller from '@/components/home/TrendingScroller'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import LookbookGrid from '@/components/home/LookbookGrid'
import { autoSeedDatabase } from '@/lib/db-seed'

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Sync live products database if first load is empty
  await autoSeedDatabase()

  return (
    <div className="bg-white">
      {/* 1. Fullscreen Editorial Campaign Hero */}
      <EditorialHero />
      
      {/* 2. Brand Trust Strip */}
      <TrustStrip />
      
      {/* 3. Shop By Category Capsules */}
      <EditorialCategories />
      
      {/* 4. Trending Horizontal Scroller */}
      <TrendingScroller />
      
      {/* 5. Spotlight Featured Picks Grid */}
      <FeaturedProducts />
      
      {/* 6. Shoppable Lookbook Grid */}
      <LookbookGrid />
    </div>
  )
}
