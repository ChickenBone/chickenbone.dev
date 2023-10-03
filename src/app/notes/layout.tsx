import { Inter } from 'next/font/google'
import portfolio from '@/data/portfolio.json'

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: "Notes | chickenbone.dev",
  description: "Written in Next.js, Tailwind CSS, and Typescript. Using CPW's API to get the latest stocking reports.",
  url: portfolio.publicUrl,
  image: portfolio.profileImage,
}

export default function RootLayout(Props: RootLayoutProps) {
  return (
    <div>
      {Props.children}
    </div>
  )
}
