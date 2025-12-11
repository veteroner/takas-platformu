import type { Metadata } from "next";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TakaZone - Ürün Takas Uygulaması",
  description: "Beğen, eşleş, takas yap! Modern ürün takas platformu ile istediğin ürünleri bul ve takas et.",
  keywords: "takazone, takas, ürün değişimi, alışveriş, ikinci el, eşya takası",
  authors: [{ name: "TakaZone" }],
  creator: "TakaZone",
  publisher: "TakaZone",
  metadataBase: new URL('https://takazone.com'),
  openGraph: {
    title: "TakaZone",
    description: "Beğen, eşleş, takas yap! Modern ürün takas platformu",
    url: 'https://takazone.com',
    siteName: 'TakaZone',
    images: [
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
    title: 'TakaZone',
    description: 'Beğen, eşleş, takas yap! Modern ürün takas platformu',
    images: ['/icons/icon-512.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-512.png', color: '#EC4899' }
    ]
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover'
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EC4899' },
    { media: '(prefers-color-scheme: dark)', color: '#8B5CF6' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TakaZone'
  }
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
        <meta name="msapplication-TileColor" content="#EC4899" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* DNS prefetch & preconnect to speed up first load, helpful for WebView */}
        <link rel="dns-prefetch" href="//takazone.com" />
        <link rel="preconnect" href="https://takazone.com" crossOrigin="" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NetworkProvider>
          <SplashScreenManager />
          <ConsentGuard />
          <VersionGate />
          {children}
          <CookieBanner />
          <AnalyticsLoader />
          <OneSignalCapacitorInit />
          <NativeConsentInit />
        </NetworkProvider>
      </body>
    </html>
  );
}
