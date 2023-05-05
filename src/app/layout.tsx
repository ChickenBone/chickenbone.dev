import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { Header } from '@/components/header/header'
import { Backdrop } from '@/components/backdrop/backdrop'
import { Footer } from '@/components/footer/footer'
import Script from 'next/script'
import * as portfolio from '@/data/portfolio.json'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: portfolio.ogTitle,
  description: portfolio.ogDescription,
  url: portfolio.publicUrl,
  image: portfolio.profileImage,
}

export default function RootLayout(Props: RootLayoutProps) {
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
    </html>
  )
}
