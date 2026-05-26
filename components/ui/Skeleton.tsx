export function Skeleton({ width = "100%", height = "20px", style = {} }: { width?: string; height?: string; style?: React.CSSProperties }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: "4px", ...style }}
    />
  )
}

export function ProductSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skeleton height="300px" />
      <Skeleton height="16px" width="60%" />
      <Skeleton height="14px" width="40%" />
    </div>
  )
}
