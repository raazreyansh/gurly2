export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin border border-black border-t-transparent rounded-full" />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">Loading GURLY...</span>
      </div>
    </div>
  )
}
