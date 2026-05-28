'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, FolderHeart, DollarSign, ArrowLeft } from 'lucide-react'

const navItems = [
  { label: 'DASHBOARD', href: '/admin', icon: LayoutDashboard },
  { label: 'PRODUCTS', href: '/admin/products', icon: ShoppingBag },
  { label: 'CATEGORIES', href: '/admin/categories', icon: FolderHeart },
  { label: 'ORDERS', href: '/admin/orders', icon: DollarSign },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
      
      {/* Persistent Left Sidebar */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white flex flex-col justify-between flex-shrink-0 p-6 lg:p-8">
        <div>
          {/* Admin title */}
          <div className="mb-10 flex items-center justify-between">
            <Link href="/admin" className="font-serif text-2xl tracking-wider font-semibold">
              GURLY <span className="font-mono text-[10px] font-bold tracking-widest text-neutral-400 block mt-1 uppercase">Office Suite</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3.5 text-[10px] tracking-[0.25em] font-semibold transition uppercase border ${
                    active 
                      ? 'bg-black text-white border-black' 
                      : 'text-neutral-500 hover:text-black border-transparent hover:border-neutral-200'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Back link */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-semibold text-neutral-400 hover:text-black transition uppercase"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Storefront
          </Link>
        </div>
      </aside>

      {/* Workspace Panel */}
      <main className="flex-1 min-w-0 bg-white p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
