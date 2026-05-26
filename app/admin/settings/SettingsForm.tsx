"use client"

import { useState } from "react"
import type { FormEvent } from "react"

type Settings = {
  storeName: string
  supportEmail: string
  currency: string
}

const defaultSettings: Settings = {
  storeName: "GURLY",
  supportEmail: "support@gurly.in",
  currency: "INR",
}

const fields: Array<{ id: keyof Settings; inputId: string; label: string }> = [
  { id: "storeName", inputId: "store-name", label: "Store Name" },
  { id: "supportEmail", inputId: "support-email", label: "Support Email" },
  { id: "currency", inputId: "currency", label: "Currency" },
]

export function SettingsForm() {
  const [settings, setSettings] = useState(defaultSettings)
  const [saved, setSaved] = useState(false)

  function updateSetting(field: keyof Settings, value: string) {
    setSettings((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    window.localStorage.setItem("gurly-admin-settings", JSON.stringify(settings))
    setSaved(true)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "500", marginBottom: "8px" }}>Settings</h1>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "32px" }}>Manage store configuration</p>
      <form onSubmit={saveSettings} style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {fields.map(({ id, inputId, label }) => (
          <div key={inputId} style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px" }}>
            <label htmlFor={inputId} style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "8px" }}>{label}</label>
            <input
              id={inputId}
              value={settings[id]}
              onChange={(event) => updateSetting(id, event.target.value)}
              className="input"
            />
          </div>
        ))}
        <button type="submit" className="btn btn-primary" id="save-settings-btn">Save Settings</button>
        {saved ? (
          <p role="status" style={{ fontSize: "13px", color: "#2E7D32" }}>Settings saved</p>
        ) : null}
      </form>
    </div>
  )
}
