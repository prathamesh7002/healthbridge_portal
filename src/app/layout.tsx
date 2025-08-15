import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from '@/lib/auth-provider';
import { HelpProvider } from '@/contexts/HelpContext';
import Head from 'next/head';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'HealthBridge - Your Personal Health Portal',
  description: 'A modern healthcare management platform for managing appointments, medical records, and connecting with healthcare providers.',
  applicationName: 'HealthBridge',
  generator: 'Next.js',
  keywords: ['healthcare', 'medical', 'appointments', 'patient portal', 'health records'],
  authors: [{ name: 'HealthBridge Team' }],
  creator: 'HealthBridge Technologies',
  publisher: 'HealthBridge',
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
  metadataBase: new URL('https://healthbridge.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'hi': '/hi',
      'mr': '/mr',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://healthbridge.vercel.app',
    title: 'HealthBridge - Your Personal Health Portal',
    description: 'Manage your health records, book appointments, and connect with healthcare providers.',
    siteName: 'HealthBridge',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HealthBridge - Your Personal Health Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HealthBridge - Your Personal Health Portal',
    description: 'Manage your health records, book appointments, and connect with healthcare providers.',
    images: ['/images/twitter-image.jpg'],
    creator: '@healthbridge',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#2563eb',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HealthBridge',
    startupImage: '/splash-screens/iphone5_splash.png',
  },
  other: {
    'msapplication-TileColor': '#2563eb',
    'msapplication-config': '/browserconfig.xml',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  minimumScale: 1,
  viewportFit: 'cover',
  userScalable: true,
};

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <HelpProvider>
                  {children}
                  <Toaster />
                </HelpProvider>
            </ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
