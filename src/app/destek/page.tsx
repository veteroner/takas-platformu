'use client'

import { ArrowLeft, Mail, MapPin, MessageCircle, HelpCircle, FileText } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SupportPage() {
  const router = useRouter()

  const faqItems = [
    {
      question: 'Takas nasıl yapılır?',
      answer: 'Beğendiğiniz ürünü sağa kaydırın. Karşı taraf da sizin ürününüzü beğenirse eşleşme gerçekleşir.'
    },
    {
      question: 'Ürün nasıl eklenir?',
      answer: 'Ana sayfadaki "+" butonuna tıklayın, ürün fotoğraflarını yükleyin, açıklama ve kategori seçin.'
    },
    {
      question: 'Hesabımı nasıl silebilirim?',
      answer: 'Ayarlar > Hesap > Hesabı Sil seçeneğinden hesabınızı kalıcı olarak silebilirsiniz.'
    },
    {
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz şifrelenerek saklanır ve KVKK uygun şekilde işlenir.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Destek</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
          <HelpCircle className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Nasıl yardımcı olabiliriz?</h2>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> İletişim
          </h3>
          <a href="mailto:bilgi@teknovagroup.com" className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-3">
            <Mail className="w-5 h-5 text-pink-300" />
            <div>
              <p className="text-white font-medium">E-posta</p>
              <p className="text-white/70 text-sm">bilgi@teknovagroup.com</p>
            </div>
          </a>
          <div className="flex items-start gap-3 p-3 bg-white/10 rounded-xl">
            <MapPin className="w-5 h-5 text-pink-300" />
            <div>
              <p className="text-white font-medium">Adres</p>
              <p className="text-white/70 text-sm">Mevlana Mahallesi No: 8/23<br/>06949 Sincan/Ankara</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5" /> Sık Sorulan Sorular
          </h3>
          {faqItems.map((item, i) => (
            <details key={i} className="mb-3">
              <summary className="p-3 bg-white/10 rounded-xl cursor-pointer text-white">{item.question}</summary>
              <p className="mt-2 p-3 text-white/70 text-sm">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Yasal Bilgiler
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/gizlilik-politikasi" className="p-3 bg-white/10 rounded-xl text-white/80 text-center text-sm">Gizlilik Politikası</Link>
            <Link href="/kvkk-aydinlatma" className="p-3 bg-white/10 rounded-xl text-white/80 text-center text-sm">KVKK</Link>
            <Link href="/uyelik-sozlesmesi" className="p-3 bg-white/10 rounded-xl text-white/80 text-center text-sm">Kullanım Şartları</Link>
            <Link href="/cerez-politikasi" className="p-3 bg-white/10 rounded-xl text-white/80 text-center text-sm">Çerez Politikası</Link>
          </div>
        </div>

        <p className="text-center text-white/50 text-sm py-4">© 2024 TEKNOVA TARIM HAYVANCILIK BİLİŞİM REKLAM LTD. ŞTİ.</p>
      </div>
    </div>
  )
}
