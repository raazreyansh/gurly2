export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white text-black pt-16 animate-pulse select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-neutral-100">
        {/* Left Side: Photo preview shimmer */}
        <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-4 p-6 lg:p-12">
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200" />
            ))}
          </div>
          <div className="aspect-[3/4] w-full bg-neutral-100 border border-neutral-200" />
        </div>

        {/* Right Side: Attributes description shimmer */}
        <div className="border-l border-neutral-100 p-8 lg:p-16 space-y-8 flex flex-col justify-center">
          <div className="h-3 bg-neutral-100 w-1/4" />
          <div className="h-10 bg-neutral-100 w-2/3" />
          <div className="h-6 bg-neutral-100 w-1/3 mt-4" />
          
          <div className="space-y-3 border-y border-neutral-200 py-8 mt-6">
            <div className="h-4 bg-neutral-100 w-1/2" />
            <div className="h-4 bg-neutral-100 w-2/3" />
          </div>
          
          <div className="h-16 bg-neutral-100 w-full mt-6" />
          
          <div className="flex gap-4 mt-8">
            <div className="h-14 bg-neutral-100 flex-grow" />
            <div className="h-14 w-14 bg-neutral-100 border border-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
