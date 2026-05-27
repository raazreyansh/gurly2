import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Analytics } from "@vercel/analytics/react"

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

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
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
