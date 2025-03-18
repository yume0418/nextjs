import './globals.css'
import { Noto_Sans_JP } from 'next/font/google'
import Navigation from '@/app/ui/Navigation'

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className}`}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-gray-200 p-4">
            <div className="container mx-auto text-center">
              &copy; 2024 My Blog. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}