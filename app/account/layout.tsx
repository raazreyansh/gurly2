import { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Account | GURLY",
  description: "Manage your GURLY account, view orders, and update your settings.",
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
