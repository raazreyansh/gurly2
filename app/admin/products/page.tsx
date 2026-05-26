import { getAdminProducts } from "@/services/admin/products"
import { AdminProductsClient } from "@/components/admin/AdminProductsClient"

export const metadata = { title: "Products" }

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return <AdminProductsClient initialProducts={products ?? []} />
}
