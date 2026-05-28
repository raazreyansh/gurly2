'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      setEmail('')
      toast.success('Subscribed — check your inbox for confirmation')
    } catch (err) {
      toast.error('Subscription failed. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-pearl">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-xl bg-white p-8 sm:p-12 shadow-md">
          <h3 className="font-serif text-2xl text-brandBlack">Join Our Private List</h3>
          <p className="mt-2 text-neutral-600">Exclusive drops, early access and private sales.</p>

          <form onSubmit={subscribe} className="mt-6 sm:flex sm:items-center gap-4">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full sm:w-auto flex-1 px-4 py-3 border border-neutral-200 rounded-md outline-none" />
            <button type="submit" disabled={loading} className="mt-4 sm:mt-0 bg-brandBlack text-white px-6 py-3 rounded-md text-sm font-semibold">{loading ? 'Subscribing...' : 'Subscribe'}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
