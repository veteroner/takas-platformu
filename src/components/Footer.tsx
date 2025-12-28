'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface FooterProps {
  variant?: 'light' | 'dark' | 'transparent'
  className?: string
}

export default function Footer({ variant = 'transparent', className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const { t } = useTranslation(['common', 'home', 'about', 'matches', 'messages'])

  const bgClass = {
    light: 'bg-white border-t border-gray-200',
    dark: 'bg-gray-900 border-t border-gray-800',
    transparent: 'bg-black/10 backdrop-blur-lg border-t border-white/10'
  }[variant]

  const textClass = {
    light: 'text-gray-600',
    dark: 'text-gray-400',
    transparent: 'text-white/60'
  }[variant]

  const linkClass = {
    light: 'text-gray-700 hover:text-purple-600',
    dark: 'text-gray-300 hover:text-white',
    transparent: 'text-white/70 hover:text-white'
  }[variant]

  const legalLinks = [
    { href: '/gizlilik-politikasi', label: t('privacy') || 'Gizlilik Politikası' },
    { href: '/kvkk-aydinlatma', label: t('kvkk') || 'KVKK Aydınlatma' },
    { href: '/cerez-politikasi', label: t('cookies') || 'Çerez Politikası' },
    { href: '/uyelik-sozlesmesi', label: t('tos') || 'Üyelik Sözleşmesi' },
    { href: '/acik-riza', label: t('consent') || 'Açık Rıza Metni' },
  ]

  const quickLinks = [
    { href: '/feed', label: t('discover') || 'Keşfet' },
    { href: '/upload', label: t('addItem') || 'Ürün Ekle' },
    { href: '/matches', label: t('matches.title') || 'Eşleşmeler' },
    { href: '/messages', label: t('messages') || 'Mesajlar' },
  ]

  return (
    <footer className={`${bgClass} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className={`text-xl font-bold ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>
                TakaZone
              </span>
            </Link>
            <p className={`${textClass} text-sm`}>{t('footer.description') || 'İkinci el eşyalarını takas et, hem tasarruf et hem de sürdürülebilir bir dünyaya katkıda bulun.'}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {t('footer.quickLinks') || 'Hızlı Linkler'}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm ${linkClass} transition-colors`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className={`font-semibold mb-4 ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {t('footer.legal') || 'Yasal'}
            </h3>
            <ul className="space-y-2">
              {legalLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-sm ${linkClass} transition-colors`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={`font-semibold mb-4 ${variant === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {t('footer.contact') || 'İletişim'}
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:bilgi@teknovagroup.com" className={`text-sm ${linkClass} transition-colors`}>
                  bilgi@teknovagroup.com
                </a>
              </li>
              <li>
                <Link href="/data-privacy" className={`text-sm ${linkClass} transition-colors`}>
                  {t('footer.data') || 'Verilerim'}
                </Link>
              </li>
              <li>
                <Link href="/preferences" className={`text-sm ${linkClass} transition-colors`}>
                  {t('preferences.title') || 'Eşleştirme Tercihlerim'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${variant === 'light' ? 'border-gray-200' : 'border-white/10'} pt-6`}>
          {/* Mobile Legal Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:hidden">
            {legalLinks.map((link, index) => (
              <span key={link.href} className="flex items-center">
                <Link href={link.href} className={`text-xs ${linkClass} transition-colors`}>
                  {link.label}
                </Link>
                {index < legalLinks.length - 1 && (
                  <span className={`mx-2 ${textClass}`}>•</span>
                )}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${textClass}`}>
              © {currentYear} TakaZone. Tüm hakları saklıdır.
            </p>
            <p className={`text-sm ${textClass} flex items-center gap-1`}>
              Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> in Türkiye
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Compact footer for mobile pages
export function CompactFooter({ variant = 'transparent' }: { variant?: 'light' | 'dark' | 'transparent' }) {
  const textClass = {
    light: 'text-gray-500',
    dark: 'text-gray-500',
    transparent: 'text-white/50'
  }[variant]

  const linkClass = {
    light: 'text-gray-600 hover:text-purple-600',
    dark: 'text-gray-400 hover:text-white',
    transparent: 'text-white/60 hover:text-white'
  }[variant]

  const legalLinks = [
    { href: '/gizlilik-politikasi', label: 'Gizlilik' },
    { href: '/kvkk-aydinlatma', label: 'KVKK' },
    { href: '/uyelik-sozlesmesi', label: 'Sözleşme' },
  ]

  return (
    <div className="py-4 px-4 text-center">
      <div className="flex flex-wrap justify-center gap-3 mb-2">
        {legalLinks.map((link, index) => (
          <span key={link.href} className="flex items-center">
            <Link href={link.href} className={`text-xs ${linkClass} transition-colors`}>
              {link.label}
            </Link>
            {index < legalLinks.length - 1 && (
              <span className={`mx-2 ${textClass}`}>•</span>
            )}
          </span>
        ))}
      </div>
      <p className={`text-xs ${textClass}`}>
        © {new Date().getFullYear()} TakaZone
      </p>
    </div>
  )
}
