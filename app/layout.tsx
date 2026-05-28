import './globals.css'
import { playfair, inter } from '@/lib/fonts'
import StorefrontLayout from '@/components/layout/StorefrontLayout'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

export const metadata = {
  title: 'GURLY. — Premium Jewellery & Luxury Accessories',
  description: 'Unapologetic. Feminine. In Every Detail. Handcrafted luxury items for modern elegance.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <SmoothScrollProvider>
          <StorefrontLayout>{children}</StorefrontLayout>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
