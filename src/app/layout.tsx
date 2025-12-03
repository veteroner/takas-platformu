import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import ConsentGuard from "@/components/ConsentGuard";
import AnalyticsLoader from "@/components/AnalyticsLoader";
import OneSignalCapacitorInit from "@/components/OneSignalCapacitorInit";
import AdsInit from "@/components/AdsInit";
import NativeConsentInit from "@/components/NativeConsentInit";
import VersionGate from "@/components/VersionGate";
import NetworkProvider from "@/components/NetworkProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Takas Platform - Ürün Takas Uygulaması",
  description: "Beğen, eşleş, takas yap! Modern ürün takas platformu ile istediğin ürünleri bul ve takas et.",
  keywords: "takas, ürün değişimi, alışveriş, ikinci el, eşya takası",
  authors: [{ name: "Takas Platform" }],
  creator: "Takas Platform",
  publisher: "TakaZone",
  metadataBase: new URL('https://takazone.com'),
  openGraph: {
    title: "TakaZone",
    description: "Beğen, eşleş, takas yap! Modern ürün takas platformu",
    url: 'https://takazone.com',
    siteName: 'TakaZone',
    images: [
      {
        url: '/icons/app-icon.svg',
        width: 512,
        height: 512,
        alt: 'Takas Platform Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Takas Platform',
    description: 'Beğen, eşleş, takas yap! Modern ürün takas platformu',
    images: ['/icons/app-icon.svg'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/icons/app-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/app-icon.svg', color: '#EC4899' }
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
    title: 'Takas'
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
        <meta name="apple-mobile-web-app-title" content="Takas" />
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
          <ConsentGuard />
          <VersionGate />
          {children}
          <CookieBanner />
          <AnalyticsLoader />
          <OneSignalCapacitorInit />
          <NativeConsentInit />
          <AdsInit />
        </NetworkProvider>
      </body>
    </html>
  );
}
