"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { useState } from "react"
import Link from "next/link"
import { Search as SearchIcon } from "lucide-react"
import type { Product } from "@/types/database"
import { searchProducts } from "@/services/products"

interface Props {
  initialQuery: string
  initialResults: Product[]
  initialSearched: boolean
}

export function SearchClient({ initialQuery, initialResults, initialSearched }: Props) {
  const [q, setQ] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>(initialResults)
  const [searched, setSearched] = useState(initialSearched)

  async function doSearch() {
    const cleanTerm = q.trim()
    if (!cleanTerm) return

    const data = await searchProducts(cleanTerm)
    setResults(data)
    setSearched(true)
  }

  return (
    <>
      <Navbar />
      <main>
        <div style={{ background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "40px 0" }}>
          <div className="container" style={{ maxWidth: "600px" }}>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "20px" }}>Search</h1>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <SearchIcon size={16} color="var(--muted)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="search-input"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doSearch()}
                  placeholder="Search earrings, necklaces..."
                  className="input"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
              <button id="search-btn" onClick={doSearch} className="btn btn-primary" style={{ padding: "12px 24px" }}>Search</button>
            </div>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 24px 80px" }}>
          {searched && results.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "15px" }}>No results for &quot;<strong>{q}</strong>&quot;. Try a different term.</p>
          )}
          {results.length > 0 && (
            <>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "24px" }}>{results.length} results for &quot;{q}&quot;</p>
              <div className="product-grid">
                {results.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug ?? p.id}`} className="card" style={{ display: "block" }}>
                    <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "var(--cream-dark)" }}>
                      <img src={p.images?.[0] ?? ""} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "14px" }}>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "14px", fontWeight: "400", marginBottom: "6px" }}>{p.title}</h3>
                      <span className="price">₹{p.price?.toLocaleString("en-IN")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
          {!searched && (
            <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>
              <SearchIcon size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
              <p>Search for your next favourite piece</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
