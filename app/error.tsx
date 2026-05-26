"use client"

import Link from "next/link"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream)", textAlign: "center", padding: "24px" }}>
      <div>
        <p style={{ fontSize: "48px", marginBottom: "16px" }}>✦</p>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>Something went wrong</h2>
        <p style={{ color: "var(--muted)", marginBottom: "32px", fontSize: "15px" }}>We&apos;re sorry for the inconvenience. Please try again.</p>
        <button onClick={reset} className="btn btn-primary" style={{ marginRight: "12px" }}>Try Again</button>
        <Link href="/" className="btn btn-outline">Go Home</Link>
      </div>
    </div>
  )
}
