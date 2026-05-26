import { searchProducts } from "@/services/products"
import { SearchClient } from "./SearchClient"

interface SearchParams {
  q?: string | string[]
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const initialQuery = Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? ""
  const initialResults = initialQuery ? await searchProducts(initialQuery) : []

  return (
    <SearchClient
      initialQuery={initialQuery}
      initialResults={initialResults}
      initialSearched={Boolean(initialQuery)}
    />
  )
}
