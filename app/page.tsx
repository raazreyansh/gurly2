import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let dbStatus = "Connected"
  let productCount = 0
  let categoryCount = 0

  try {
    [productCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ])
  } catch (err) {
    console.error("Database connection failed:", err)
    dbStatus = "Connection Failed"
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-950/30 via-slate-950 to-slate-950 pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        {/* Glow Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-indigo-400 mb-8 font-medium font-mono tracking-wider">
          <span className={`w-2 h-2 rounded-full ${dbStatus === "Connected" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          Database: {dbStatus}
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
          A Fresh Slate
        </h1>
        
        <p className="text-slate-400 leading-relaxed text-sm sm:text-base mb-10 max-w-md mx-auto">
          We have completely cleaned out all pages, layouts, styles, and old frontend components. Your live database config, Prisma schema, and environment variables are preserved and ready for whatever you build next.
        </p>

        {/* Database Stats */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-10">
          <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl">
            <span className="block text-2xl font-bold text-white font-mono">{productCount}</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">Products</span>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-xl">
            <span className="block text-2xl font-bold text-white font-mono">{categoryCount}</span>
            <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1 block">Categories</span>
          </div>
        </div>

        <div className="text-xs text-slate-600 font-mono">
          Ready to build in <code className="text-indigo-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">app/page.tsx</code>
        </div>
      </div>
    </main>
  )
}
