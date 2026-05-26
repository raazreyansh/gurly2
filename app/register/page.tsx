"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signUp } from "@/services/auth"
import { toast } from "sonner"
import Link from "next/link"

const schema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
})
type Form = z.infer<typeof schema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  async function onSubmit({ email, password, fullName }: Form) {
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) { toast.error(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "28px", marginBottom: "12px" }}>Check your email</h1>
          <p style={{ color: "var(--muted)", marginBottom: "24px" }}>We sent you a confirmation link. Click it to activate your account.</p>
          <Link href="/login" className="btn btn-primary">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "40px" }}>
          GURLY
        </Link>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: "500", marginBottom: "8px" }}>Create Account</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "28px" }}>Join the GURLY community</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { name: "fullName", label: "Full Name", type: "text", placeholder: "Your Name", id: "register-name" },
              { name: "email", label: "Email", type: "email", placeholder: "you@example.com", id: "register-email" },
              { name: "password", label: "Password", type: "password", placeholder: "••••••••", id: "register-password" },
            ].map(({ name, label, type, placeholder, id }) => (
              <div key={name}>
                <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>{label}</label>
                <input id={id} {...register(name as keyof Form)} type={type} className="input" placeholder={placeholder} />
                {errors[name as keyof Form] && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors[name as keyof Form]?.message}</p>}
              </div>
            ))}
            <button type="submit" id="register-submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)", marginTop: "24px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--rose)", fontWeight: "600" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
