import { InfoPage } from "@/components/content/InfoPage"

export const metadata = {
  title: "Privacy Policy | GURLY",
  description: "How GURLY collects, uses, and protects customer information.",
}

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="We collect only the information needed to process orders, support customers, and improve the GURLY shopping experience."
      sections={[
        {
          title: "Information we collect",
          body: "We may collect your name, email, phone number, shipping address, order details, and payment status when you place an order or contact support.",
        },
        {
          title: "How we use information",
          body: "Customer information is used for checkout, order updates, returns, fraud prevention, support, and opt-in marketing communication.",
        },
        {
          title: "Data protection",
          body: "We keep customer data limited to authorized store operations and never sell personal information to third parties.",
        },
      ]}
    />
  )
}
