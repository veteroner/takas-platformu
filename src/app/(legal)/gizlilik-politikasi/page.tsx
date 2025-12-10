'use client'

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Gizlilik Politikası
        </h1>
        <p className="text-sm text-gray-500">Son Güncelleme: 10 Aralık 2025</p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          <strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong> olarak, 
          kullanıcılarımızın gizliliğini korumak önceliğimizdir. Bu politika, kişisel verilerinizin 
          nasıl toplandığını, kullanıldığını ve korunduğunu açıklamaktadır.
        </p>
      </div>

      {/* Veri Sorumlusu */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          1. Veri Sorumlusu
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p><strong>Şirket:</strong> Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</p>
          <p><strong>MERSİS No:</strong> 0836100073000001</p>
          <p><strong>VKN:</strong> 8361000730</p>
          <p><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</p>
          <p><strong>E-posta:</strong> bilgi@teknovagroup.com</p>
          <p><strong>Telefon:</strong> 0543 509 84 85</p>
        </div>
      </section>

      {/* Toplanan Veriler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          2. Toplanan Veriler
        </h2>
        <p className="text-gray-600 mb-4">
          TakaZone platformunu kullanırken aşağıdaki bilgilerinizi topluyoruz:
        </p>
        
        <div className="space-y-3">
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 mb-2">■ Hesap Bilgileri</h3>
            <p className="text-sm text-gray-600">Ad, soyad, e-posta, telefon, profil fotoğrafı</p>
          </div>
          
          <div className="bg-pink-50 rounded-xl p-4">
            <h3 className="font-semibold text-pink-700 mb-2">■ İçerik Bilgileri</h3>
            <p className="text-sm text-gray-600">Yüklediğiniz ürün fotoğrafları, açıklamalar, mesajlar</p>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="font-semibold text-orange-700 mb-2">■ Kullanım Bilgileri</h3>
            <p className="text-sm text-gray-600">Beğeniler, eşleşmeler, platform kullanım istatistikleri</p>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-700 mb-2">■ Teknik Bilgiler</h3>
            <p className="text-sm text-gray-600">IP adresi, cihaz bilgileri, tarayıcı türü, konum (izinle)</p>
          </div>
        </div>
      </section>

      {/* Kullanım Amaçları */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          3. Verilerin Kullanım Amaçları
        </h2>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Hesabınızı oluşturmak ve yönetmek</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Takas eşleştirmelerini gerçekleştirmek</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Kullanıcılar arası mesajlaşmayı sağlamak</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Platform güvenliğini sağlamak</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Hizmet kalitesini iyileştirmek</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Yasal yükümlülükleri yerine getirmek</span>
          </li>
        </ul>
      </section>

      {/* Veri Paylaşımı */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          4. Veri Paylaşımı
        </h2>
        <p className="text-gray-600 mb-4">
          Kişisel verilerinizi yalnızca aşağıdaki durumlarda üçüncü taraflarla paylaşırız:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Yasal Zorunluluk:</strong> Mahkeme kararı veya resmi talep halinde</p>
          <p>■ <strong>Hizmet Sağlayıcılar:</strong> Sunucu, e-posta, bildirim hizmetleri</p>
          <p>■ <strong>Güvenlik:</strong> Dolandırıcılık ve kötüye kullanımı önlemek için</p>
        </div>
        
        <div className="bg-green-50 rounded-xl p-4 mt-4 border-l-4 border-green-400">
          <p className="text-sm text-gray-700">
            <strong>Önemli:</strong> Verilerinizi hiçbir zaman reklam amaçlı olarak üçüncü taraflara satmıyoruz.
          </p>
        </div>
      </section>

      {/* Güvenlik */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          5. Veri Güvenliği
        </h2>
        <p className="text-gray-600 mb-4">
          Verilerinizi korumak için aşağıdaki güvenlik önlemlerini uyguluyoruz:
        </p>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">🔒</span>
            <span>SSL/TLS şifreleme ile güvenli veri iletimi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">��</span>
            <span>Şifrelerin hash algoritması ile saklanması</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">🔒</span>
            <span>Düzenli güvenlik güncellemeleri</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">🔒</span>
            <span>Erişim kontrolü ve yetkilendirme</span>
          </li>
        </ul>
      </section>

      {/* Çerezler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          6. Çerezler
        </h2>
        <p className="text-gray-600 mb-4">
          Platformumuzda aşağıdaki çerezleri kullanıyoruz:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Zorunlu Çerezler:</strong> Oturum yönetimi, güvenlik</p>
          <p>■ <strong>İşlevsel Çerezler:</strong> Tercihlerinizi hatırlama</p>
          <p>■ <strong>Analitik Çerezler:</strong> Platform kullanım istatistikleri</p>
        </div>
        
        <p className="text-sm text-gray-500 mt-3">
          Detaylı bilgi için <a href="/cerez-politikasi" className="text-purple-600 hover:underline">Çerez Politikası</a> sayfamızı ziyaret edin.
        </p>
      </section>

      {/* Haklarınız */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          7. Haklarınız
        </h2>
        <p className="text-gray-600 mb-4">
          KVKK kapsamında aşağıdaki haklara sahipsiniz:
        </p>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Verilerinize erişim talep etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Yanlış verilerin düzeltilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Verilerinizin silinmesini talep etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Veri işlemeye itiraz etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Verilerinizi taşıma</span>
          </li>
        </ul>
        
        <p className="text-sm text-gray-500 mt-3">
          Detaylı bilgi için <a href="/kvkk-aydinlatma" className="text-purple-600 hover:underline">KVKK Aydınlatma Metni</a> sayfamızı ziyaret edin.
        </p>
      </section>

      {/* İletişim */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          8. İletişim
        </h2>
        <p className="text-gray-600 mb-4">
          Gizlilik politikamızla ilgili sorularınız için bize ulaşın:
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📧</span>
            <strong>E-posta:</strong> bilgi@teknovagroup.com
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📞</span>
            <strong>Telefon:</strong> 0543 509 84 85
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">🌐</span>
            <strong>Website:</strong> takazone.com
          </p>
        </div>
      </section>

      {/* Değişiklikler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          9. Politika Değişiklikleri
        </h2>
        <p className="text-gray-600">
          Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması 
          halinde sizi e-posta veya uygulama içi bildirim ile bilgilendireceğiz.
        </p>
      </section>

      {/* Footer */}
      <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
        <p><strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong></p>
        <p className="mt-1">Bu gizlilik politikası 10.12.2025 tarihinde güncellenmiştir.</p>
      </div>
    </div>
  )
}
