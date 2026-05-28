import { Hero } from '@/components/home/Hero'
import { Trending } from '@/components/home/Trending'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'

export default function HomePage() {
  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen">
        <Hero />
        <Trending />
      </main>
    </StorefrontLayout>
  )
}
