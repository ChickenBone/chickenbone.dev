import portfolio from '@/data/portfolio'
import type { Metadata } from 'next'


interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(portfolio.publicUrl),
  title: {
    default: `${portfolio.fullName} Notes`,
    template: `%s | ${portfolio.siteName}`,
  },
  description: portfolio.ogDescription,
  alternates: { canonical: '/notes' },
  openGraph: {
    title: `${portfolio.fullName} Notes`,
    description: portfolio.ogDescription,
    url: '/notes',
    siteName: portfolio.siteName,
    images: [
      { url: portfolio.profileImage, width: 1200, height: 630, alt: portfolio.ogImageAlt },
    ],
    type: portfolio.seo.openGraphType as any,
    locale: portfolio.seo.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${portfolio.fullName} Notes`,
    description: portfolio.ogDescription,
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
