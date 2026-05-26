"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "@/services/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
})
type Form = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) })

  async function onSubmit({ email, password }: Form) {
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) { toast.error(error.message); setLoading(false); return }
    toast.success("Welcome back!")
    router.push("/account")
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <Link href="/" style={{ fontFamily: "var(--font-serif)", fontSize: "28px", fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", display: "block", textAlign: "center", marginBottom: "40px" }}>
          GURLY
        </Link>

        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "8px", padding: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "24px", fontWeight: "500", marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "28px" }}>Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Email</label>
              <input id="login-email" {...register("email")} type="email" className="input" placeholder="you@example.com" />
              {errors.email && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.email.message}</p>}
            </div>
            <div>
              <label style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal-light)", display: "block", marginBottom: "6px" }}>Password</label>
              <input id="login-password" {...register("password")} type="password" className="input" placeholder="••••••••" />
              {errors.password && <p style={{ fontSize: "11px", color: "var(--rose)", marginTop: "4px" }}>{errors.password.message}</p>}
            </div>
            <button type="submit" id="login-submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--muted)", marginTop: "24px" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--rose)", fontWeight: "600" }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
