"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, Eye, Package, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react"
import type { Product } from "@/types/database"
import { LOCAL_PRODUCTS_EVENT, mergeProducts, readLocalProducts } from "@/services/local-catalog"

type Props = {
  initialProducts: Product[]
}

export function AdminProductsClient({ initialProducts }: Props) {
  const router = useRouter()
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
    <div style={{ padding: "32px", display: "grid", gap: "20px" }}>
      <section
        style={{
          borderRadius: "28px",
          padding: "28px",
          background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,248,243,0.84))",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
          display: "grid",
          gap: "18px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: "8px" }}>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--rose)" }}>
              Catalogue control
            </p>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-0.04em", color: "var(--charcoal)" }}>
              Products
            </h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, maxWidth: "680px" }}>
              {products.length} products are connected to the shared catalogue. Create, edit, or delete here and the customer storefront updates from the same source of truth.
            </p>
          </div>

          <Link href="/admin/products/new" className="btn btn-primary" id="add-product-btn" style={{ gap: "8px", alignSelf: "flex-start" }}>
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px" }}>
          {[
            { label: "Catalogue items", value: String(products.length), Icon: Package },
            { label: "Sync state", value: "Live", Icon: RefreshCw },
            { label: "Storefront link", value: "Connected", Icon: ShieldCheck },
          ].map(({ label, value, Icon }) => (
            <div
              key={label}
              style={{
                borderRadius: "22px",
                padding: "16px 18px",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(15,23,42,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <div style={{ display: "grid", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)" }}>{label}</span>
                <strong style={{ fontSize: "18px", color: "var(--charcoal)" }}>{value}</strong>
              </div>
              <Icon size={18} color="var(--rose)" />
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(253,246,238,0.8)", borderBottom: "1px solid rgba(15,23,42,0.08)" }}>
              {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((heading) => (
                <th
                  key={heading}
                  style={{
                    padding: "16px",
                    textAlign: "left",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => {
                const stockTone = product.stock > 10 ? "#2E7D32" : product.stock > 0 ? "#F57F17" : "#C62828"
                const stockBg = product.stock > 10 ? "#E8F5E9" : product.stock > 0 ? "#FFF8E1" : "#FFEBEE"
                return (
                  <tr key={product.id} className="table-row-hover" style={{ borderBottom: "1px solid rgba(15,23,42,0.06)" }}>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={product.images?.[0] ?? "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=100"}
                          alt={product.title}
                          style={{ width: "56px", height: "70px", objectFit: "cover", borderRadius: "14px", flexShrink: 0 }}
                        />
                        <div style={{ display: "grid", gap: "4px" }}>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--charcoal)", margin: 0 }}>{product.title}</p>
                          <p style={{ fontSize: "11px", color: "var(--muted)", margin: 0 }}>{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px", fontSize: "13px", color: "var(--charcoal-light)" }}>
                      {product.categories?.name ?? "-"}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700 }}>₹{product.price.toLocaleString("en-IN")}</span>
                      {product.compare_at_price && (
                        <span style={{ fontSize: "11px", color: "var(--muted)", textDecoration: "line-through", marginLeft: "8px" }}>
                          ₹{product.compare_at_price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background: stockBg,
                          color: stockTone,
                        }}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          background: product.featured ? "rgba(244, 63, 94, 0.12)" : "rgba(15,23,42,0.05)",
                          color: product.featured ? "var(--rose-dark)" : "var(--muted)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {product.featured ? "Featured" : "Standard"}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <a
                          href={`/product/${product.slug ?? product.id}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: "36px",
                            height: "36px",
                            border: "1px solid rgba(15,23,42,0.1)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
                            background: "rgba(255,255,255,0.9)",
                          }}
                        >
                          <Eye size={13} />
                        </a>
                        <a
                          href={`/admin/products/${product.id}/edit`}
                          style={{
                            width: "36px",
                            height: "36px",
                            border: "1px solid rgba(15,23,42,0.1)",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
                            background: "rgba(255,255,255,0.9)",
                          }}
                        >
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
                                router.refresh()
                              } else {
                                await fetch(`/api/admin/products/fallback/${product.id}`, {
                                  method: "DELETE",
                                }).catch((fallbackError) => {
                                  console.warn("Fallback catalogue delete failed:", fallbackError)
                                })
                                alert("Failed to delete product from database.")
                              }
                            } catch (error) {
                              console.error("Deletion error:", error)
                              await fetch(`/api/admin/products/fallback/${product.id}`, {
                                method: "DELETE",
                              }).catch((fallbackError) => {
                                console.warn("Fallback catalogue delete failed:", fallbackError)
                              })
                              alert("Error deleting product.")
                            }
                          }}
                          style={{
                            width: "36px",
                            height: "36px",
                            border: "1px solid #fee2e2",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ef4444",
                            background: "#fff1f2",
                            cursor: "pointer",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: "72px 24px", textAlign: "center", color: "var(--muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
                  <p style={{ margin: 0 }}>
                    No products yet. <Link href="/admin/products/new" style={{ color: "var(--rose)" }}>Add your first product -&gt;</Link>
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
