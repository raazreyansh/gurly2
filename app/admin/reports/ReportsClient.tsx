"use client"

type CsvValue = string | number

type Report = {
  title: string
  filename: string
  headers: string[]
  rows: CsvValue[][]
}

const reports: Report[] = [
  {
    title: "Sales Report",
    filename: "sales-report.csv",
    headers: ["Metric", "Value"],
    rows: [["Gross Sales", 125000], ["Orders", 48], ["Average Order Value", 2604]],
  },
  {
    title: "Customer Report",
    filename: "customer-report.csv",
    headers: ["Metric", "Value"],
    rows: [["Total Customers", 342], ["Repeat Customers", 91], ["Wishlist Adds", 128]],
  },
  {
    title: "Inventory Report",
    filename: "inventory-report.csv",
    headers: ["Metric", "Value"],
    rows: [["Products", 24], ["Low Stock", 3], ["Out of Stock", 1]],
  },
  {
    title: "Coupon Usage",
    filename: "coupon-usage-report.csv",
    headers: ["Code", "Uses"],
    rows: [["WELCOME10", 26], ["FLAT200", 14], ["GURLY15", 9]],
  },
]

function escapeCsv(value: CsvValue) {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

function toCsv(report: Report) {
  return [report.headers, ...report.rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n") + "\n"
}

export function ReportsClient() {
  function exportReport(report: Report) {
    const blob = new Blob([toCsv(report)], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = report.filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Reports</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Export and analyze business data</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {reports.map((report) => (
          <div key={report.title} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "14px", fontWeight: "500" }}>{report.title}</p>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: "8px 16px", fontSize: "11px" }}
              onClick={() => exportReport(report)}
            >
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
