import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Noto_Sans_Devanagari, Noto_Naskh_Arabic } from 'next/font/google'
import { Toaster } from 'sonner'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const notoDevanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], weight: ['400', '500', '600'], variable: '--font-devanagari', display: 'swap', preload: false })
const notoNaskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '600'], variable: '--font-naskh', display: 'swap', preload: false })

export const metadata: Metadata = {
  title: 'District Counselling Center | Government of India',
  description: 'Official District Counselling Center portal — empowering youth through professional guidance, career counselling, mental wellness, and educational support.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  // RTL logic for Urdu
  const dir = locale === 'ur' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jakarta.variable} ${notoDevanagari.variable} ${notoNaskh.variable} font-sans antialiased bg-page text-ink`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <MotionConfig reducedMotion="user">
              <AuthProvider>
                {children}
                <Toaster position="top-right" richColors />
              </AuthProvider>
            </MotionConfig>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
