"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Plus, Tag } from "lucide-react"

export function CouponsClient() {
  const [code, setCode] = useState("")
  const [type, setType] = useState<"flat" | "percent">("percent")
  const [value, setValue] = useState("")
  const [minOrder, setMinOrder] = useState("")
  const [loading, setLoading] = useState(false)

  async function createCoupon() {
    if (!code || !value) { toast.error("Fill in all fields"); return }
    setLoading(true)
    try {
      const { error } = await supabase.from("coupons").insert({
        code: code.toUpperCase(),
        type,
        value: parseFloat(value),
        min_order: minOrder ? parseFloat(minOrder) : null,
      })
      if (error) throw error
      toast.success("Coupon created!")
      setCode(""); setValue(""); setMinOrder("")
    } catch {
      toast.error("Failed to create coupon")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500" }}>Coupons</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>Create and manage discount codes</p>
        </div>
      </div>

      <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "28px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag size={16} color="var(--rose)" /> Create Coupon
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Code</label>
            <input id="coupon-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input" placeholder="SAVE20" />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Type</label>
            <select id="coupon-type" value={type} onChange={(e) => setType(e.target.value as "flat" | "percent")} className="input">
              <option value="percent">Percentage (%)</option>
              <option value="flat">Flat Amount (INR)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Value</label>
            <input id="coupon-value" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="input" placeholder={type === "percent" ? "10" : "100"} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Min. Order (INR)</label>
            <input id="coupon-min" type="number" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="input" placeholder="500 (optional)" />
          </div>
        </div>
        <button
          id="create-coupon-btn"
          onClick={createCoupon}
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: "20px", gap: "8px" }}
        >
          <Plus size={15} /> {loading ? "Creating..." : "Create Coupon"}
        </button>
      </div>

      <div style={{ background: "rgba(201,149,108,0.06)", border: "1px solid rgba(201,149,108,0.2)", borderRadius: "6px", padding: "16px", fontSize: "13px", color: "var(--charcoal-light)" }}>
        <strong>Pre-seeded coupons:</strong> WELCOME10 (10% off, min INR 500) · FLAT200 (INR 200 off, min INR 1000) · GURLY15 (15% off, min INR 1500)
      </div>
    </div>
  )
}
