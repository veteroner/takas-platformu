'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getClientStorageItem } from '@/lib/clientStorage'

/**
 * İlk açılışta kullanıcıyı dil seçim sayfasına yönlendir
 * Sadece giriş yapmamış kullanıcılar için
 */
export default function LanguageGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Dil seçimi sayfasındaysa bypass et
    if (pathname === '/language-selection') {
      setIsReady(true)
      return
    }

    // Login/register sayfalarında bypass et
    if (pathname === '/login' || pathname === '/register') {
      setIsReady(true)
      return
    }

    // Daha önce dil seçimi yapılmış mı kontrol et
    const hasSelectedLanguage = getClientStorageItem('language-selected')
    
    if (!hasSelectedLanguage) {
      // İlk açılış - dil seçimine yönlendir
      router.replace('/language-selection')
    } else {
      setIsReady(true)
    }
  }, [pathname, router])

  // Yönlendirme sırasında boş ekran göster
  if (!isReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return <>{children}</>
}
