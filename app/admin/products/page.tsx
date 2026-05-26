import { getAdminProducts } from "@/services/admin/products"
import { Product } from "@/types/database"
import Link from "next/link"
import { Plus, Edit, Eye, Package } from "lucide-react"

export const metadata = { title: "Products" }

export default async function AdminProductsPage() {
  const products = await getAdminProducts()

  return (
    <div style={{ padding: "40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Products</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>{products?.length ?? 0} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary" id="add-product-btn" style={{ gap: "8px" }}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="table-row-hover" style={{ borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=100"}
                        alt={product.title}
                        style={{ width: "48px", height: "60px", objectFit: "cover", borderRadius: "2px", flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--charcoal)" }}>{product.title}</p>
                        <p style={{ fontSize: "11px", color: "var(--muted)" }}>{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px", fontSize: "13px", color: "var(--charcoal-light)" }}>
                    {(product as Product & { categories?: { name: string } }).categories?.name ?? "—"}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>₹{product.price.toLocaleString("en-IN")}</span>
                    {product.compare_at_price && (
                      <span style={{ fontSize: "11px", color: "var(--muted)", textDecoration: "line-through", marginLeft: "8px" }}>
                        ₹{product.compare_at_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      fontSize: "12px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px",
                      background: product.stock > 10 ? "#E8F5E9" : product.stock > 0 ? "#FFF8E1" : "#FFEBEE",
                      color: product.stock > 10 ? "#2E7D32" : product.stock > 0 ? "#F57F17" : "#C62828",
                    }}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "100px",
                      background: product.featured ? "rgba(201,149,108,0.12)" : "var(--cream)",
                      color: product.featured ? "var(--rose-dark)" : "var(--muted)",
                    }}>
                      {product.featured ? "Featured" : "Standard"}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <a href={`/product/${product.slug}`} target="_blank" style={{
                        width: "32px", height: "32px", border: "1px solid var(--border)", borderRadius: "4px",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", transition: "all 0.2s",
                      }}>
                        <Eye size={13} />
                      </a>
                      <a href={`/admin/products/${product.id}/edit`} style={{
                        width: "32px", height: "32px", border: "1px solid var(--border)", borderRadius: "4px",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", transition: "all 0.2s",
                      }}>
                        <Edit size={13} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>No products yet. <Link href="/admin/products/new" style={{ color: "var(--rose)" }}>Add your first product →</Link></p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
