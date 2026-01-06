'use client'

import { ArrowLeft, Repeat, Shield, Heart, Users, TrendingUp, Gift, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function AboutPage() {
  const router = useRouter()
  const { t } = useTranslation('about')

  const features = [
    { icon: Repeat, title: t('features.smartSwap.title'), desc: t('features.smartSwap.description') },
    { icon: Shield, title: t('features.secureTransaction.title'), desc: t('features.secureTransaction.description') },
    { icon: Heart, title: t('features.smartMatching.title'), desc: t('features.smartMatching.description') },
    { icon: Gift, title: t('features.sustainable.title'), desc: t('features.sustainable.description') }
  ]

  const stats = [
    { value: '50K+', label: t('stats.users') },
    { value: '100K+', label: t('stats.products') },
    { value: '25K+', label: t('stats.successfulSwaps') }
  ]

  return (
    <div className="h-svh overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col">
      <header className="shrink-0 bg-black/20 backdrop-blur-lg border-b border-white/10 pt-safe">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">{t('title')}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <div className="text-5xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-white mb-2">TakaZone</h2>
          <p className="text-white/80">{t('subtitle')}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <p className="text-white/90 leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
              <f.icon className="w-8 h-8 text-pink-300 mb-2" />
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-white/70 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> {t('stats.title')}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-white/70 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" /> {t('howItWorks.title')}
          </h3>
          <ol className="space-y-3">
            {[t('howItWorks.step1'), t('howItWorks.step2'), t('howItWorks.step3'), t('howItWorks.step4')].map((s, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90">
                <span className="w-7 h-7 bg-linear-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold">{i+1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> {t('companyInfo.title')}
          </h3>
          <p className="text-white/80 text-sm mb-2 font-medium">TEKNOVA TARIM HAYVANCILIK BİLİŞİM REKLAM LTD. ŞTİ.</p>
          <div className="space-y-1 mt-3">
            <p className="text-white/70 text-sm">📍 Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</p>
            <p className="text-white/70 text-sm">📧 bilgi@teknovagroup.com</p>
            <p className="text-white/70 text-sm">📞 0543 509 84 85</p>
            <p className="text-white/70 text-sm">🏢 MERSİS: 0836100073000001</p>
            <p className="text-white/70 text-sm">🔢 VKN: 8361000730</p>
            <p className="text-white/70 text-sm">🏦 Vergi Dairesi: Sincan Vergi Dairesi Müdürlüğü</p>
            <p className="text-white/70 text-sm">👤 Veri Sorumlusu: İsa Bozkurt</p>
          </div>
        </div>

        <Link href="/destek" className="block bg-linear-to-r from-pink-500 to-orange-400 text-white font-semibold py-4 rounded-2xl text-center">
          Destek ile İletişime Geç
        </Link>

        <p className="text-center text-white/50 text-sm py-4">© 2024 TEKNOVA - Tüm Hakları Saklıdır</p>
        </div>
      </div>
    </div>
  )
}
