export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white px-8 py-28 text-black lg:px-20">
      <section className="mx-auto max-w-3xl space-y-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
          GURLY Customer Care
        </p>
        <h1 className="font-serif text-5xl">Privacy Policy</h1>
        <p className="text-sm leading-8 text-neutral-600">
          GURLY uses customer information only to process orders, support delivery,
          manage service requests, and improve the store experience. We do not sell
          customer data.
        </p>
        <p className="text-sm leading-8 text-neutral-600">
          Payment details are handled by the selected payment provider. Contact
          care@gurly.com for privacy, correction, or deletion requests.
        </p>
      </section>
    </main>
  )
}
