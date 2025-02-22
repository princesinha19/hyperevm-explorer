import '@/styles/globals.css'
import Providers from '@/components/Providers'
import { Metadata } from 'next'
import { NetworkProvider } from '@/contexts/NetworkContext'

export const metadata: Metadata = {
  title: 'HyperEVM Explorer',
  description: 'HyperEVM Explorer',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: '/favicon.ico',
        sizes: '180x180',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/_next/static/css/app/layout.css" 
          as="style"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.ico"
          sizes="32x32"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <NetworkProvider>
            {children}
          </NetworkProvider>
        </Providers>
      </body>
    </html>
  )
}