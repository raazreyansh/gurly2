import { prisma } from '@/lib/prisma'
import { Landmark, ShoppingBag, Users } from 'lucide-react'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

type RecentOrder = Prisma.OrderGetPayload<{
  select: {
    id: true
    total: true
    status: true
    createdAt: true
    user: {
      select: {
        fullName: true
      }
    }
  }
}>

type DashboardData = {
  productCount: number
  profileCount: number
  totalRevenue: number
  recentOrders: RecentOrder[]
}

async function getDashboardData(): Promise<DashboardData> {
  const [productCount, profileCount, revenueSum, recentOrders] = await prisma.$transaction([
    prisma.product.count(),
    prisma.user.count({
      where: {
        role: 'customer',
      },
    }),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
    }),
  ])

  return {
    productCount,
    profileCount,
    totalRevenue: Number(revenueSum._sum.total || 0),
    recentOrders,
  }
}

function getStatusStyles(status: string) {
  const normalizedStatus = status.toLowerCase()

  if (normalizedStatus === 'completed' || normalizedStatus === 'delivered') {
    return 'bg-green-50 text-green-700 border-green-200'
  }

  if (normalizedStatus === 'failed' || normalizedStatus === 'cancelled') {
    return 'bg-red-50 text-red-700 border-red-200'
  }

  return 'bg-yellow-50 text-yellow-700 border-yellow-200'
}

export default async function AdminDashboardPage() {
  let dashboardData: DashboardData

  try {
    dashboardData = await getDashboardData()
  } catch (error) {
    console.error('Dashboard database fetch error:', error)

    return (
      <div className="p-12 border border-red-200 bg-red-50 text-center">
        <h2 className="text-red-800 font-serif text-2xl">Analytics Unavailable</h2>
        <p className="text-red-600 text-xs mt-2 font-mono">CRITICAL_DATABASE_CONNECTION_ERROR</p>
      </div>
    )
  }

  const { productCount, profileCount, totalRevenue, recentOrders } = dashboardData
  const metrics = [
    { label: 'GROSS REVENUE', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: Landmark },
    { label: 'INVENTORY ITEMS', value: String(productCount), icon: ShoppingBag },
    { label: 'CUSTOMER ACCOUNTS', value: String(profileCount), icon: Users },
  ]

  return (
    <div className="space-y-12">
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif text-5xl text-black">Office Dashboard</h1>
        <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
          Corporate Analytics & Live Inventory Metrics
        </p>
      </div>

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
                      #GURLY-{String(order.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-semibold uppercase tracking-wider">
                      {order.user?.fullName || 'Guest Customer'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[9px] tracking-widest font-bold uppercase border ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-black">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right text-neutral-400 font-mono">
                      {new Date(order.createdAt).toISOString().split('T')[0]}
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
