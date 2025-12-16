import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: "Dil Seçin - TakaZone",
  description: "Uygulamayı hangi dilde kullanmak istersiniz? Tercih ettiğiniz dili seçin.",
}

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
}

export default function LanguageSelectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}