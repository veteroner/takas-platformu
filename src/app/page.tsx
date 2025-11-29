'use client'

import { ArrowRight, Sparkles, Heart, Package, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function WelcomePage() {
  
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
              <Package className="w-16 h-16 text-purple-600" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          Takas
        </h1>
        <p className="text-xl text-white/90 mb-2 font-medium">
          İhtiyacın Olmayan Eşyalarını
        </p>
        <p className="text-2xl text-white font-bold mb-8">
          Takas Et, Yeni Şeyler Keşfet! 🎁
        </p>

        <div className="space-y-4 mb-10 text-left">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Hızlı Eşleşme</p>
              <p className="text-white/80 text-sm">Kaydır, beğen, takas yap!</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Güvenli Platform</p>
              <p className="text-white/80 text-sm">Doğrulanmış kullanıcılar</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">Topluluk</p>
              <p className="text-white/80 text-sm">Binlerce aktif kullanıcı</p>
            </div>
          </div>
        </div>

        
        <div className="flex items-center justify-center gap-4 text-white/90">
          <Link href="/login" className="hover:text-white transition-colors font-medium">
            Giriş Yap
          </Link>
          <span className="text-white/50">•</span>
          <Link href="/login" className="hover:text-white transition-colors font-medium">
            Kayıt Ol
          </Link>
        </div>

        <p className="mt-8 text-white/60 text-sm">
          Ücretsiz, kolay ve eğlenceli! 🚀
        </p>
      </div>
    </div>
  )
}
