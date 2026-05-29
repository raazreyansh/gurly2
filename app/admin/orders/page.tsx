import { prisma } from '@/lib/prisma'
import StatusSelect from './StatusSelect'
import type { Prisma } from '@prisma/client'

export const dynamic = 'force-dynamic'

type AdminOrder = Prisma.OrderGetPayload<{
  select: {
    id: true
    total: true
    status: true
    createdAt: true
    user: {
      select: {
        fullName: true
        email: true
      }
    }
    items: {
      select: {
        id: true
        quantity: true
        product: {
          select: {
            title: true
          }
        }
      }
    }
  }
}>

export default async function AdminOrdersPage() {
  let orders: AdminOrder[] = []
  let loadError = ''

  try {
    orders = await prisma.order.findMany({
      take: 50,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error("Orders logs admin error:", error)
    loadError = error instanceof Error ? error.message : 'Unable to load order logs.'
  }

  return (
    <div className="space-y-12">
      {/* Title */}
      <div className="border-b border-neutral-100 pb-6">
        <h1 className="font-serif text-5xl text-black">Sales Logs</h1>
        <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest font-semibold">
          Corporate Receipts & Live Fulfillment Controls
        </p>
      </div>

      {/* Tables list */}
      <div className="border border-neutral-200">
        <div className="overflow-x-auto">
          {loadError ? (
            <div className="space-y-3 bg-red-50 p-10 text-xs font-semibold uppercase tracking-wider text-red-700">
              <p>ORDER LOG LOAD FAILED</p>
              <p className="font-mono text-[10px] normal-case tracking-normal text-red-500">{loadError}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-16 text-center text-xs text-neutral-400 font-semibold tracking-wider bg-white">
              NO TRANSACTION RECEIPTS LOGGED YET
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="border-b border-neutral-200 text-[9px] tracking-[0.25em] font-bold text-neutral-400 uppercase bg-neutral-50/50">
                  <th className="px-6 py-4">Invoice</th>
                  <th className="px-6 py-4">Client Details</th>
                  <th className="px-6 py-4">Purchased Items</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs text-black">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/30 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-black uppercase">
                      #GURLY-{String(order.id).slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold uppercase tracking-wider text-black">
                        {order.user?.fullName || 'Guest Client'}
                      </p>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {order.user?.email || 'guest@gurly.luxury'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-600 max-w-xs">
                      {order.items?.map((item) => (
                        <div key={item.id} className="text-[11px] py-0.5">
                          <span className="font-semibold text-black">
                            {item.product?.title || 'Boutique jewel'}
                          </span>{' '}
                          <span className="text-neutral-400 font-mono text-[9px]">
                            (x{item.quantity})
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-black text-sm">
                      ₹{Number(order.total).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-mono text-neutral-400">
                      {new Date(order.createdAt).toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <StatusSelect id={order.id} currentStatus={order.status} />
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
