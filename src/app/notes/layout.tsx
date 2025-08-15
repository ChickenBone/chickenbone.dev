import { Inter } from 'next/font/google'
import portfolio from '@/data/portfolio'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: portfolio.pages.notes_rfm69?.title || `${portfolio.fullName} Notes | ${portfolio.siteName}`,
  description: portfolio.pages.notes_rfm69?.description || portfolio.ogDescription,
  alternates: { canonical: `${portfolio.publicUrl}/notes` },
  openGraph: {
    title: portfolio.pages.notes_rfm69?.title || `${portfolio.fullName} Notes` ,
    description: portfolio.pages.notes_rfm69?.description || portfolio.ogDescription,
    url: `${portfolio.publicUrl}/notes`,
    siteName: portfolio.siteName,
    images: [
      { url: portfolio.profileImage, width: 1200, height: 630, alt: portfolio.ogImageAlt },
    ],
    type: portfolio.seo.openGraphType as any,
    locale: portfolio.seo.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolio.pages.notes_rfm69?.title || `${portfolio.fullName} Notes` ,
    description: portfolio.pages.notes_rfm69?.description || portfolio.ogDescription,
    images: [portfolio.profileImage],
  },
}

export default function RootLayout(Props: RootLayoutProps) {
  return (
    <div>
      {Props.children}
    </div>
  )
}
