import { StorefrontLayout } from '@/components/layout/StorefrontLayout'

export default function CollectionsPage() {
  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="font-serif text-4xl text-brandBlack mb-6">Collections</h1>
          <p className="text-neutral-600 mb-8">Curated collections showcasing editorial themes and seasonal drops.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-lg overflow-hidden bg-white shadow">
              <div className="relative h-56 bg-neutral-100" />
              <div className="p-6">
                <h3 className="font-medium">Campaign</h3>
                <p className="text-sm text-neutral-500 mt-2">A refined capsule of editorial pieces.</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden bg-white shadow">
              <div className="relative h-56 bg-neutral-100" />
              <div className="p-6">
                <h3 className="font-medium">Gifts</h3>
                <p className="text-sm text-neutral-500 mt-2">Beautifully packaged gift sets for special moments.</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden bg-white shadow">
              <div className="relative h-56 bg-neutral-100" />
              <div className="p-6">
                <h3 className="font-medium">Bridal</h3>
                <p className="text-sm text-neutral-500 mt-2">Delicate heirloom-inspired designs.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </StorefrontLayout>
  )
}
