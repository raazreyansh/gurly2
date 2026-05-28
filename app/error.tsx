'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center bg-white p-6">
      <div className="max-w-md">
        <h2 className="font-serif text-3xl text-black">
          Something went wrong
        </h2>

        <p className="mt-4 text-xs text-neutral-500 font-semibold tracking-wider leading-relaxed">
          {error.message || "An unexpected error occurred during rendering."}
        </p>

        <button 
          onClick={reset}
          className="mt-8 bg-black text-white px-8 py-3.5 text-xs uppercase tracking-widest font-semibold hover:opacity-80 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
