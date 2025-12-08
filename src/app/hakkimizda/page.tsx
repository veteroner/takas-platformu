'use client'

import { ArrowLeft, Repeat, Shield, Heart, Users, TrendingUp, Gift, Star } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  const features = [
    { icon: Repeat, title: 'Akıllı Takas', desc: 'Tinder tarzı kaydırma ile hızlı eşleşme' },
    { icon: Shield, title: 'Güvenli İşlem', desc: 'Doğrulanmış profiller, güvenli mesajlaşma' },
    { icon: Heart, title: 'Akıllı Eşleştirme', desc: 'Beden ve yaş grubu tercihleri' },
    { icon: Gift, title: 'Sürdürülebilir', desc: 'Çevreye duyarlı takas sistemi' }
  ]

  const stats = [
    { value: '50K+', label: 'Kullanıcı' },
    { value: '100K+', label: 'Ürün' },
    { value: '25K+', label: 'Başarılı Takas' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Hakkımızda</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <div className="text-5xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-white mb-2">TakasZone</h2>
          <p className="text-white/80">Çocuk Giysi ve Oyuncak Takas Platformu</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <p className="text-white/90 leading-relaxed">
            TakasZone, ailelerin kullanılmış çocuk kıyafetleri ve oyuncaklarını güvenli bir şekilde takas etmelerini sağlar. Tinder tarzı kaydırma arayüzü ile hızlı eşleşme ve sürdürülebilir tüketimi destekliyoruz.
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
            <TrendingUp className="w-5 h-5" /> Rakamlarla TakasZone
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
            <Star className="w-5 h-5" /> Nasıl Çalışır?
          </h3>
          <ol className="space-y-3">
            {['Kayıt ol ve profil oluştur', 'Ürünlerini yükle', 'Kaydır ve eşleş', 'Mesajlaş ve takas yap'].map((s, i) => (
              <li key={i} className="flex items-center gap-3 text-white/90">
                <span className="w-7 h-7 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-sm font-bold">{i+1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" /> Şirket Bilgileri
          </h3>
          <p className="text-white/80 text-sm mb-2">TEKNOVA TARIM HAYVANCILIK BİLİŞİM REKLAM LTD. ŞTİ.</p>
          <p className="text-white/60 text-sm">Mevlana Mahallesi No: 8/23, 06949 Sincan/Ankara</p>
          <p className="text-white/60 text-sm">bilgi@teknovagroup.com</p>
        </div>

        <Link href="/destek" className="block bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold py-4 rounded-2xl text-center">
          Destek ile İletişime Geç
        </Link>

        <p className="text-center text-white/50 text-sm py-4">© 2024 TEKNOVA - Tüm Hakları Saklıdır</p>
      </div>
    </div>
  )
}
