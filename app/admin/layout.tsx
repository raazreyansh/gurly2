import AdminShell from '@/components/admin/AdminShell'
import { requireAdminUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminUser('/admin')

  return <AdminShell>{children}</AdminShell>
}
