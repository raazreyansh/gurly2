"use client"

import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import Link from "next/link"
import { Package, Bell, User, ChevronRight } from "lucide-react"

export default function AccountPage() {
  const menu = [
    { href: "/account/orders", label: "My Orders", desc: "View and track your orders", Icon: Package },
    { href: "/account/notifications", label: "Notifications", desc: "Stay updated on your orders", Icon: Bell },
    { href: "/account", label: "Profile Settings", desc: "Update your personal info", Icon: User },
  ]

  return (
    <StorefrontLayout>
      <main className="bg-white min-h-screen py-20">
        <div className="max-w-xl mx-auto px-6">
          
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-black">
              <User size={24} />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-black">My Account</h1>
              <p className="text-xs text-neutral-400 mt-1">Manage your GURLY experience</p>
            </div>
          </div>

          <div className="space-y-4">
            {menu.map(({ href, label, desc, Icon }) => (
              <Link 
                key={href} 
                href={href} 
                className="flex justify-between items-center bg-white border border-neutral-200 p-6 hover:border-black transition duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-50 flex items-center justify-center text-black">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-black">{label}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400" />
              </Link>
            ))}

            <button 
              id="signout-btn" 
              className="w-full mt-6 border border-red-200 text-red-500 hover:bg-red-50 py-3 text-xs uppercase tracking-widest font-semibold transition"
              onClick={async () => {
                localStorage.removeItem("gurly_customer_user")
                const { supabase } = await import("@/lib/supabase/client")
                await supabase.auth.signOut()
                window.dispatchEvent(new Event("storage"))
                window.location.href = "/"
              }}
            >
              Sign Out
            </button>
          </div>

        </div>
      </main>
    </StorefrontLayout>
  )
}
