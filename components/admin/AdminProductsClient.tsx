"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Edit, Eye, Package, Plus, Trash2 } from "lucide-react"
import type { Product } from "@/types/database"
import { LOCAL_PRODUCTS_EVENT, mergeProducts, readLocalProducts } from "@/services/local-catalog"

type Props = {
  initialProducts: Product[]
}

export function AdminProductsClient({ initialProducts }: Props) {
  const [localProducts, setLocalProducts] = useState<Product[]>([])
  const products = useMemo(
    () => mergeProducts(localProducts, initialProducts),
    [initialProducts, localProducts]
  )

  useEffect(() => {
    const syncLocalProducts = () => setLocalProducts(readLocalProducts())

    syncLocalProducts()
    window.addEventListener("storage", syncLocalProducts)
    window.addEventListener(LOCAL_PRODUCTS_EVENT, syncLocalProducts)

    return () => {
      window.removeEventListener("storage", syncLocalProducts)
      window.removeEventListener(LOCAL_PRODUCTS_EVENT, syncLocalProducts)
    }
  }, [])

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Products</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>{products.length} total products</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary" id="add-product-btn" style={{ gap: "8px" }}>
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--cream)", borderBottom: "1px solid var(--border)" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((heading) => (
                <th key={heading} style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
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
                    {product.categories?.name ?? "-"}
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
                      <a href={`/product/${product.slug ?? product.id}`} target="_blank" style={{
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
                      <button
                        onClick={async () => {
                          if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) return
                          
                          try {
                            const { writeLocalProducts } = await import("@/services/local-catalog")
                            const nextLocal = localProducts.filter((item) => item.id !== product.id)
                            writeLocalProducts(nextLocal)
                            
                            const response = await fetch(`/api/admin/products/${product.id}`, {
                              method: "DELETE",
                            })
                            
                            if (response.ok) {
                              window.location.reload()
                            } else {
                              alert("Failed to delete product from database.")
                            }
                          } catch (error) {
                            console.error("Deletion error:", error)
                            alert("Error deleting product.")
                          }
                        }}
                        style={{
                          width: "32px", height: "32px", border: "1px solid #fee2e2", borderRadius: "4px",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", background: "#fee2e2", transition: "all 0.2s", cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
                  <p>No products yet. <Link href="/admin/products/new" style={{ color: "var(--rose)" }}>Add your first product -&gt;</Link></p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
