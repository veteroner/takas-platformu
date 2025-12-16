'use client'

import { ArrowRight, Sparkles, Heart, Users, Loader2 } from 'lucide-react'
import TakaIcon from '@/components/TakaIcon'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/auth'
import { CompactFooter } from '@/components/Footer'
import { useTranslation } from 'react-i18next'

export default function WelcomePage() {
  const { t } = useTranslation('common')
  
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (currentUser) {
          router.replace('/feed')
          return
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }
    checkUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">{t('loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div 
        className={`relative z-10 text-center max-w-md transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-full shadow-2xl">
              <TakaIcon className="w-16 h-16 text-purple-600" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          TakaZone
        </h1>
        <p className="text-xl text-white/90 mb-2 font-medium">
          {t('welcomePage.subtitle1')}
        </p>
        <p className="text-2xl text-white font-bold mb-8">
          {t('welcomePage.subtitle2')}
        </p>

        <div className="space-y-4 mb-10 text-left">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">{t('welcomePage.features.fastMatch.title')}</p>
              <p className="text-white/80 text-sm">{t('welcomePage.features.fastMatch.desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">{t('welcomePage.features.safePlatform.title')}</p>
              <p className="text-white/80 text-sm">{t('welcomePage.features.safePlatform.desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">{t('welcomePage.features.community.title')}</p>
              <p className="text-white/80 text-sm">{t('welcomePage.features.community.desc')}</p>
            </div>
          </div>
        </div>

        <Link
          href="/feed"
          className="group w-full bg-white text-purple-600 font-bold text-lg py-5 rounded-2xl shadow-2xl hover:shadow-white/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 mb-6"
        >
          <span>{t('welcomePage.ctaPrimary')}</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
        
        <div className="flex items-center justify-center gap-4 text-white/90">
          <Link href="/login" className="hover:text-white transition-colors font-medium">
            {t('welcomePage.login')}
          </Link>
          <span className="text-white/50">•</span>
          <Link href="/login" className="hover:text-white transition-colors font-medium">
            {t('welcomePage.signup')}
          </Link>
        </div>

        <p className="mt-8 text-white/60 text-sm">
          {t('welcomePage.footerNote')}
        </p>

        {/* Footer */}
        <CompactFooter variant="transparent" />
      </div>
    </div>
  )
}
