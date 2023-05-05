import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { Header } from '@/components/header/header'
import { Backdrop } from '@/components/backdrop/backdrop'
import { Footer } from '@/components/footer/footer'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: 'Wyatt Whorton | chickenbone.dev',
  description: 'A portfolio website for Wyatt Whorton, a full-stack developer.',
  url: 'https://chickenbone.dev',
  image: 'https://chickenbone.dev/profile.png',
}

export default function RootLayout(Props: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Backdrop>
          <Providers>
              <div className={inter.className + "w-screen h-fit lg:px-24 px-4 py-8 bg-transparent"}>
                <div className=' lg:px-24 px-4 py-8'>
                  <Header
                    siteName="chickenbone"
                    githubUrl="https://github.com/chickenbone"
                    contactUrl="https://chickenbone.dev/contact"
                  />
                </div>
                <div>
                  {Props.children}
                </div>
                <div className='py-8 mt-24'>
                  <Footer />
                </div>
              </div>
          </Providers>
        </Backdrop>
      </body>
      <Script strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-60RDE7YH2R" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-60RDE7YH2R');
        `}
      </Script>
    </html>
  )
}
