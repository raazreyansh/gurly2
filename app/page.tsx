import { Hero } from '@/components/home/Hero'
import { Trending } from '@/components/home/Trending'
import { MoodSection } from '@/components/home/MoodSection'
import CampaignBanner from '@/components/home/CampaignBanner'
import Bestsellers from '@/components/home/Bestsellers'
import CommunityGallery from '@/components/home/CommunityGallery'
import Newsletter from '@/components/home/Newsletter'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'

export default function HomePage() {
  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen">
        <Hero />
        <Trending />
        <MoodSection />
        <CampaignBanner />
        <Bestsellers />
        <CommunityGallery />
        <Newsletter />
      </main>
    </StorefrontLayout>
  )
}
