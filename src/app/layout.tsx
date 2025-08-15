import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { Header } from '@/components/header/header'
import { Backdrop } from '@/components/backdrop/backdrop'
import { Footer } from '@/components/footer/footer'
import Script from 'next/script'
import portfolio from '@/data/portfolio'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(portfolio.publicUrl),
  title: {
    default: portfolio.ogTitle,
    template: portfolio.seo.titleTemplate,
  },
  description: portfolio.ogDescription,
  alternates: {
    canonical: portfolio.publicUrl,
  },
  openGraph: {
    title: portfolio.ogTitle,
    description: portfolio.ogDescription,
    url: portfolio.publicUrl,
    siteName: portfolio.siteName,
    images: [
      {
        url: portfolio.profileImage,
        width: 1200,
        height: 630,
        alt: portfolio.ogImageAlt,
      },
    ],
    type: portfolio.seo.openGraphType as any,
    locale: portfolio.seo.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: portfolio.ogTitle,
    description: portfolio.ogDescription,
    images: [portfolio.profileImage],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout(Props: RootLayoutProps) {
  // Person and WebSite JSON-LD sourced from portfolio.ts
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: portfolio.fullName,
    url: portfolio.publicUrl,
    image: portfolio.profileImage,
    jobTitle: portfolio.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: portfolio.worksFor.name,
    },
    sameAs: portfolio.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: portfolio.location.city,
      addressRegion: portfolio.location.region,
      addressCountry: portfolio.location.country,
    },
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: portfolio.siteName,
    url: portfolio.publicUrl,
  }

  return (
    <html lang="en">
      <body>
        <Providers>
          <Backdrop>

            <div className={inter.className + "w-screen h-fit lg:px-24 px-4 py-8 bg-transparent"}>
              <div className=' lg:px-24 px-4 py-8'>
                <Header
                  siteName={portfolio.siteName}
                  githubUrl={portfolio.githubUrl}
                  contactUrl={portfolio.email}
                  linkedinUrl={portfolio.linkedinUrl}
                />
              </div>
              <div>
                {Props.children}
              </div>
              <div className='py-8 mt-24'>
                <Footer />
              </div>
            </div>
          </Backdrop>
        </Providers>
        {/* Vercel Analytics and Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
      <Script strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${portfolio.gtag}`} />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);} 
          gtag('js', new Date());

          gtag('config', '${portfolio.gtag}');
        `}
      </Script>
      <Script id="ld-person" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(personJsonLd)}
      </Script>
      <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(websiteJsonLd)}
      </Script>
    </html>
  )
}
