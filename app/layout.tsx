import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/providers"

export const metadata: Metadata = {
  title: {
    default: "GURLY — Premium Accessories",
    template: "%s | GURLY"
  },
  description: "Discover premium earrings, necklaces, bracelets and accessories curated for the modern woman.",
  keywords: ["earrings", "jewellery", "accessories", "fashion", "premium", "women"],
  openGraph: {
    title: "GURLY — Premium Accessories",
    description: "Discover premium earrings, necklaces, bracelets and accessories curated for the modern woman.",
    type: "website",
    locale: "en_IN",
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
