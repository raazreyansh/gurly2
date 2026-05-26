import { InfoPage } from "@/components/content/InfoPage"

export const metadata = {
  title: "Support | GURLY",
  description: "Contact GURLY support for orders, returns, shipping, and account questions.",
}

export default function SupportPage() {
  return (
    <InfoPage
      eyebrow="Support"
      title="Support"
      description="Need help with an order, return, or product question? Use this page as the starting point for customer support."
      sections={[
        {
          title: "Order help",
          body: "For order status, shipping updates, or payment questions, include your order number and checkout email when contacting support.",
        },
        {
          title: "Returns",
          body: "Returns are reviewed against the product condition and return window. Keep packaging and proof of purchase available.",
        },
        {
          title: "Contact",
          body: "Email support@gurly.in with your name, order number if applicable, and a short description of the issue.",
        },
      ]}
    />
  )
}
