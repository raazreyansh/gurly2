import { InfoPage } from "@/components/content/InfoPage"

export const metadata = {
  title: "Terms | GURLY",
  description: "GURLY store terms for purchases, shipping, returns, and customer support.",
}

export default function TermsPage() {
  return (
    <InfoPage
      eyebrow="Terms"
      title="Terms of Service"
      description="These terms explain the basic rules for shopping with GURLY, including orders, payments, shipping, and returns."
      sections={[
        {
          title: "Orders and payments",
          body: "Orders are confirmed after successful payment authorization. Prices, availability, and promotions may change until checkout is complete.",
        },
        {
          title: "Shipping and delivery",
          body: "Delivery timelines are estimates and may vary by location, carrier availability, and order volume.",
        },
        {
          title: "Returns and exchanges",
          body: "Eligible products can be returned within the posted return window when unused, undamaged, and returned with original packaging.",
        },
      ]}
    />
  )
}
