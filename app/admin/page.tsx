import { prisma } from '@/lib/prisma'
import { Landmark, ShoppingBag, Users, Calendar } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  let productCount = 0
  let profileCount = 0
  let totalRevenue = 0
  let recentOrders: any[] = []

  try {
    productCount = await prisma.product.count()
    profileCount = await prisma.user.count()

    const revenueSum = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    })
    totalRevenue = Number(revenueSum._sum.total || 0)

    recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    })
  } catch (error) {
    console.error("Dashboard database fetch error:", error)
  }

  const metrics = [
    { label: 'GROSS REVENUE', value: `₹${totalRevenue.toLocaleString()}`, icon: Landmark },
    { label: 'INVENTORY ITEMS', value: String(productCount), icon: ShoppingBag },
    { label: 'CUSTOMER ACCOUNTS', value: String(profileCount), icon: Users },
  ]

  return (
    <div className="space-y-12">
      
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif text-5xl text-black">Office Dashboard</h1>
        <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
          Corporate Analytics & Live Inventory Metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="border border-neutral-200 p-8 bg-neutral-50 flex flex-col justify-between h-44">
              <div className="flex justify-between items-start">
                <span className="text-[10px] tracking-[0.25em] font-semibold text-neutral-400 uppercase">{metric.label}</span>
                <Icon className="h-4 w-4 text-neutral-400" />
              </div>
              <span className="text-3xl font-mono font-bold text-black mt-4 block">{metric.value}</span>
            </div>
          )
        })}
      </div>

      {/* Recent Activity Log */}
      <div className="border border-neutral-200">
        <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-black uppercase">Recent Transactions Log</span>
          <Link href="/admin/orders" className="text-[9px] tracking-[0.2em] font-bold text-neutral-400 hover:text-black uppercase">
            View All Logs →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400 font-semibold tracking-wider bg-white">
              NO TRANSACTIONS RECORDED YET
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-neutral-100 text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase bg-neutral-50/50">
                  <th className="px-6 py-4">Reference</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/40 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-black uppercase">
                      #GURLY-{order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-semibold uppercase tracking-wider">
                      {order.user?.fullName || 'Guest Customer'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-[9px] tracking-widest font-bold uppercase bg-yellow-50 text-yellow-600 border border-yellow-100">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-black">
                      ₹{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-400 font-mono">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  )
}
