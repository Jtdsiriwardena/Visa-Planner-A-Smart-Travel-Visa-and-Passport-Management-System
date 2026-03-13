import './globals.css'
import { ReactNode } from 'react'


export const metadata = {
  title: 'Visa Planner',
  description: 'Plan trips and check visa requirements',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50">
        
        <main>{children}</main>
      </body>
    </html>
  )
}
