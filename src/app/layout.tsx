import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import ConsentGuard from "@/components/ConsentGuard";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import OneSignalCapacitorInit from "@/components/OneSignalCapacitorInit";
import NativeConsentInit from "@/components/NativeConsentInit";
import VersionGate from "@/components/VersionGate";
import NetworkProvider from "@/components/NetworkProvider";
import SplashScreenManager from "@/components/SplashScreenManager";
import I18nProvider from "@/components/I18nProvider";
import LanguageGuard from "@/components/LanguageGuard";
import HtmlLangDir from "@/components/HtmlLangDir";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TakaZone - Ürün Takas Uygulaması | Beğen, Eşleş, Takas Yap",
    template: "%s | TakaZone"
  },
  description: "Beğen, eşleş, takas yap! Modern ürün takas platformu ile istediğin ürünleri bul ve takas et. Kıyafet, oyuncak ve daha fazlası için güvenli takas platformu.",
  keywords: [
    "takazone",
    "takas",
    "ürün takası",
    "ürün değişimi",
    "alışveriş",
    "ikinci el",
    "eşya takası",
    "kıyafet takası",
    "oyuncak takası",
    "güvenli takas",
    "online takas",
    "ücretsiz takas"
  ],
  authors: [{ name: "TakaZone", url: "https://takazone.com" }],
  creator: "TakaZone",
  publisher: "TakaZone",
  metadataBase: new URL('https://takazone.com'),
  alternates: {
    canonical: 'https://takazone.com',
  },
  openGraph: {
    title: "TakaZone - Ürün Takas Uygulaması",
    description: "Beğen, eşleş, takas yap! Modern ürün takas platformu ile istediğin ürünleri bul ve takas et.",
    url: 'https://takazone.com',
    siteName: 'TakaZone',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TakaZone - Modern Ürün Takas Platformu',
      },
      {
        url: '/icons/icon-512.png',
        width: 512,
        height: 512,
        alt: 'TakaZone Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TakaZone - Ürün Takas Uygulaması',
    description: 'Beğen, eşleş, takas yap! Modern ürün takas platformu ile istediğin ürünleri bul ve takas et.',
    images: ['/og-image.png'],
    creator: '@takazone',
    site: '@takazone'
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-512.png', color: '#EC4899' }
    ]
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TakaZone'
  },
  verification: {
    google: 'google-site-verification-code-buraya',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'shopping',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EC4899' },
    { media: '(prefers-color-scheme: dark)', color: '#8B5CF6' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TakaZone" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'TakaZone',
              description: 'Modern ürün takas platformu ile istediğin ürünleri bul ve takas et.',
              url: 'https://takazone.com',
              applicationCategory: 'Shopping',
              operatingSystem: 'Web, iOS, Android',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'TRY'
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1250'
              }
            })
          }}
        />
        <meta name="msapplication-TileColor" content="#EC4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* DNS prefetch & preconnect to speed up first load, helpful for WebView */}
        <link rel="dns-prefetch" href="//takazone.com" />
        <link rel="preconnect" href="https://takazone.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          <NetworkProvider>
            <HtmlLangDir />
            <SplashScreenManager />
            <ConsentGuard />
            <VersionGate />
            <LanguageGuard>
              {children}
            </LanguageGuard>
            <CookieBanner />
            <AnalyticsLoader />
            <OneSignalCapacitorInit />
            <NativeConsentInit />
          </NetworkProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
