import Link from 'next/link'

const policyCards = [
  {
    title: 'Free Shipping',
    body: 'Every prepaid and cash-on-delivery order ships free across India. No minimum cart value is required.',
  },
  {
    title: '7-Day Return Request',
    body: 'Start a return within 7 days of delivery for eligible products that are unused, unworn, and packed with tags, invoice, and original packaging.',
  },
  {
    title: 'Quality Check First',
    body: 'Returned pieces are inspected before refund, replacement, or store credit is approved. Damaged, used, altered, or incomplete items cannot be accepted.',
  },
  {
    title: 'Hygiene-Safe Jewellery',
    body: 'For hygiene reasons, pierced earrings and opened hair accessories are returnable only if they arrive damaged, defective, or incorrect.',
  },
]

const steps = [
  'Email care@gurly.com with your order reference, product name, and photos if the item is damaged or incorrect.',
  'Our support team confirms eligibility and shares the return instructions.',
  'Pack the item securely with all original inclusions.',
  'After inspection, approved refunds or replacements are processed within 5-7 working days.',
]

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf8] text-black">
      <section className="border-b border-neutral-200 bg-white px-8 py-24 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-neutral-400">
              Customer Care
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-tight lg:text-7xl">
              Shipping & Returns
            </h1>
          </div>
          <p className="max-w-2xl text-sm font-medium leading-8 text-neutral-600">
            Built for a luxury accessories store: simple free shipping, clear return
            eligibility, hygiene-safe jewellery handling, and a support-led review
            process that protects customers without breaking fulfilment operations.
          </p>
        </div>
      </section>

      <section className="px-8 py-16 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {policyCards.map((card) => (
            <article key={card.title} className="border border-neutral-200 bg-white p-7">
              <h2 className="font-serif text-2xl">{card.title}</h2>
              <p className="mt-4 text-xs font-medium leading-7 text-neutral-600">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-8 pb-20 lg:px-20">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-neutral-200 bg-white p-8 lg:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
              How Returns Work
            </p>
            <div className="mt-8 space-y-5">
              {steps.map((step, index) => (
                <div key={step} className="grid grid-cols-[42px_1fr] gap-4">
                  <span className="grid h-10 w-10 place-items-center border border-neutral-200 font-mono text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-sm leading-7 text-neutral-600">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-neutral-200 bg-black p-8 text-white lg:p-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
              Important Notes
            </p>
            <div className="mt-8 space-y-6 text-sm leading-8 text-white/75">
              <p>
                Refunds are issued to the original payment method when possible. COD
                refunds may be completed through bank transfer after account details
                are verified by support.
              </p>
              <p>
                Gift sets must be returned as a complete set. Sale, final clearance,
                customised, and visibly used products are not eligible unless they
                arrived defective or incorrect.
              </p>
              <p>
                Shipping is free on new orders. Return pickup availability depends on
                courier coverage for the delivery pincode.
              </p>
            </div>
            <Link
              href="mailto:care@gurly.com"
              className="mt-10 inline-flex border border-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
            >
              Contact Care
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
