import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thank You | QuoteLinker',
  description: 'Thank you for your quote request. We will be in touch shortly.',
}

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 