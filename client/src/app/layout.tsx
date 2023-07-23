import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'Rekredhead Chat App',
   description: 'A Chatapp with user authentication',
}

export default function RootLayout({
   children,
}: {
   children: React.ReactNode
}) {
   return (
      <html lang="en">
         <body className={`${inter.className} flex items-center justify-center h-screen bg-slate-800 text-slate-100`}>
            {children}
         </body>
      </html>
   )
}
