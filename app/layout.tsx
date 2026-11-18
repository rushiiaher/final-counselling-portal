import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { MotionConfig } from 'framer-motion'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

/* All fonts are self-hosted from app/fonts. next/font/google is not used because
   Turbopack intermittently fails to fetch Google Fonts on clean builds (Vercel).
   Each family has a basic-Latin file plus a fallback "-ext" file for extra
   characters such as the ₹ sign; the browser picks the right file per character. */
const inter = localFont({ src: './fonts/inter-latin.woff2', weight: '100 900', variable: '--font-inter', display: 'swap' })
const interExt = localFont({ src: './fonts/inter-latin-ext.woff2', weight: '100 900', variable: '--font-inter-ext', display: 'swap', preload: false })
const jakarta = localFont({ src: './fonts/plus-jakarta-sans-latin.woff2', weight: '200 800', variable: '--font-jakarta', display: 'swap' })
const jakartaExt = localFont({ src: './fonts/plus-jakarta-sans-latin-ext.woff2', weight: '200 800', variable: '--font-jakarta-ext', display: 'swap', preload: false })
const notoDevanagari = localFont({ src: './fonts/noto-sans-devanagari-devanagari.woff2', weight: '100 900', variable: '--font-devanagari', display: 'swap', preload: false })
// Urdu (Arabic script). Variable font — one file covers weights 400–700.
const notoNaskh = localFont({ src: './fonts/noto-naskh-arabic.woff2', weight: '400 700', variable: '--font-naskh', display: 'swap', preload: false })

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
      <body className={`${inter.variable} ${interExt.variable} ${jakarta.variable} ${jakartaExt.variable} ${notoDevanagari.variable} ${notoNaskh.variable} font-sans antialiased bg-page text-ink`}>
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
