'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'
import { Header } from '@/components/header/header'
import { Backdrop } from '@/components/backdrop/backdrop'
import { Footer } from '@/components/footer/footer'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
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
    </html>
  )
}
