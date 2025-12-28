'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Package, User, Search, Upload, Heart, Settings, ArrowLeft } from 'lucide-react'
import { useDeviceType } from '@/hooks/useDeviceType'
import Footer from '@/components/Footer'
import { useTranslation } from 'react-i18next'

interface DesktopLayoutProps {
  children: ReactNode
  title?: string
  showBackButton?: boolean
  showSearch?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl'
  centerContent?: boolean
}

const navItems = [
  { href: '/feed', label: 'Keşfet', icon: Home },
  { href: '/messages', label: 'Mesajlar', icon: MessageCircle },
  { href: '/my-items', label: 'Ürünlerim', icon: Package },
  { href: '/matches', label: 'Eşleşmeler', icon: Heart },
  { href: '/profile', label: 'Profil', icon: User },
]

export default function DesktopLayout({
  children,
  title,
  showBackButton = false,
  showSearch = false,
  maxWidth = '7xl',
  centerContent = false
}: DesktopLayoutProps) {
  const { isMobile } = useDeviceType()
  const pathname = usePathname()
  const { t } = useTranslation(['home', 'common', 'settings'])

  const navItems = [
    { href: '/feed', label: t('discover') || 'Keşfet', icon: Home },
    { href: '/messages', label: t('messages') || 'Mesajlar', icon: MessageCircle },
    { href: '/my-items', label: t('myItems') || 'Ürünlerim', icon: Package },
    { href: '/matches', label: t('matches') || 'Eşleşmeler', icon: Heart },
    { href: '/profile', label: t('profile') || 'Profil', icon: User },
  ]

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  }

  // Mobil görünüm - sadece children render et
  if (isMobile) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 via-pink-500 to-orange-400">
      {/* Desktop/Tablet Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 lg:px-8`}>
          <div className="flex items-center justify-between h-16">
            {/* Sol: Logo ve Back Button */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button 
                  onClick={() => window.history.back()}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
              )}
              <Link href="/feed" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="text-white font-bold text-xl hidden lg:block">TakaZone</span>
              </Link>
              
              {title && (
                <h1 className="text-white font-semibold text-lg ml-4 hidden md:block">{title}</h1>
              )}
            </div>

            {/* Orta: Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isActive
                        ? 'bg-white text-purple-600 shadow-lg'
                        : 'text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium hidden lg:block">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sağ: Arama ve Aksiyonlar */}
            <div className="flex items-center gap-3">
              {showSearch && (
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder') || 'Ürün ara...'}
                    className="pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-full text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                  />
                </div>
              )}
              
              <Link 
                href="/upload"
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                <Upload className="w-5 h-5" />
                <span className="hidden lg:block">{t('addItem') || 'Ürün Ekle'}</span>
              </Link>
              
              <Link
                href="/settings"
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 lg:px-8 py-6 ${centerContent ? 'flex justify-center' : ''}`}>
        {children}
      </main>

      {/* Footer */}
      <Footer variant="transparent" />
    </div>
  )
}

// Tablet/Desktop için sidebar navigation alternatifi
export function DesktopSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation(['home','common','settings'])
  const navItems = [
    { href: '/feed', label: t('discover') || 'Keşfet', icon: Home },
    { href: '/messages', label: t('messages') || 'Mesajlar', icon: MessageCircle },
    { href: '/my-items', label: t('myItems') || 'Ürünlerim', icon: Package },
    { href: '/matches', label: t('matches') || 'Eşleşmeler', icon: Heart },
    { href: '/profile', label: t('profile') || 'Profil', icon: User },
  ]
  
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white/10 backdrop-blur-md border-r border-white/20 min-h-screen p-4">
      <Link href="/feed" className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-linear-to-br from-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">T</span>
        </div>
        <span className="text-white font-bold text-2xl">TakaZone</span>
      </Link>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto">
        <Link 
          href="/upload"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-linear-to-r from-pink-500 to-orange-400 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <Upload className="w-5 h-5" />
          <span>{t('addItem') || 'Ürün Ekle'}</span>
        </Link>
        
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 mt-4 text-white/60 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>{t('settings.title') || 'Ayarlar'}</span>
        </Link>
      </div>
    </aside>
  )
}
