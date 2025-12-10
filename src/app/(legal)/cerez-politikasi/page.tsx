'use client'

export default function CookiePolicyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Çerez Politikası
        </h1>
        <p className="text-sm text-gray-500">Son Güncelleme: 10 Aralık 2025</p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          Bu sayfa, <strong>TakaZone</strong> platformunda kullanılan çerezleri ve 
          benzer teknolojileri açıklamaktadır.
        </p>
      </div>

      {/* Çerez Nedir */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          1. Çerez Nedir?
        </h2>
        <p className="text-gray-600">
          Çerezler, web siteleri tarafından cihazınıza yerleştirilen küçük metin 
          dosyalarıdır. Bu dosyalar, tercihlerinizi hatırlamak ve size daha iyi 
          bir deneyim sunmak için kullanılır.
        </p>
      </section>

      {/* Kullandığımız Çerezler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          2. Kullandığımız Çerezler
        </h2>
        
        <div className="space-y-4">
          {/* Zorunlu */}
          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-green-700 mb-2">🔒 Zorunlu Çerezler</h3>
            <p className="text-sm text-gray-600 mb-2">
              Platformun çalışması için gerekli olan çerezlerdir. Devre dışı bırakılamaz.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p>■ <strong>Oturum çerezleri:</strong> Giriş durumunuzu korur</p>
              <p>■ <strong>Güvenlik çerezleri:</strong> Hesabınızı korur</p>
              <p>■ <strong>Tercih çerezleri:</strong> Dil ve tema ayarlarınız</p>
            </div>
          </div>

          {/* Analitik */}
          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-700 mb-2">📊 Analitik Çerezler</h3>
            <p className="text-sm text-gray-600 mb-2">
              Platform kullanımını anlamamıza yardımcı olan çerezlerdir.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p>■ <strong>Sayfa görüntüleme:</strong> Hangi sayfaların ziyaret edildiği</p>
              <p>■ <strong>Kullanım süreleri:</strong> Ne kadar vakit geçirildiği</p>
              <p>■ <strong>Hata izleme:</strong> Teknik sorunları tespit etme</p>
            </div>
          </div>

          {/* İşlevsel */}
          <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-purple-700 mb-2">⚙️ İşlevsel Çerezler</h3>
            <p className="text-sm text-gray-600 mb-2">
              Gelişmiş özellikler ve kişiselleştirme için kullanılır.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p>■ <strong>Son aramalar:</strong> Arama geçmişiniz</p>
              <p>■ <strong>Favoriler:</strong> Beğendiğiniz ürünler</p>
              <p>■ <strong>Bildirim tercihleri:</strong> Hangi bildirimleri almak istediğiniz</p>
            </div>
          </div>

          {/* Reklam */}
          <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-orange-700 mb-2">📢 Reklam Çerezleri</h3>
            <p className="text-sm text-gray-600 mb-2">
              İlgi alanlarınıza uygun içerik göstermek için kullanılır.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
              <p>■ <strong>İlgi alanları:</strong> Beğendiğiniz kategoriler</p>
              <p>■ <strong>Reklam gösterimleri:</strong> Görüntülenen reklamlar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Çerez Yönetimi */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          3. Çerez Tercihlerinizi Yönetme
        </h2>
        <p className="text-gray-600 mb-4">
          Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:
        </p>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Tarayıcı Ayarları</h3>
            <p className="text-sm text-gray-600">
              Tarayıcınızın ayarlarından çerezleri engelleyebilir veya silebilirsiniz. 
              Ancak bu durumda platformun bazı özellikleri çalışmayabilir.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Uygulama Ayarları</h3>
            <p className="text-sm text-gray-600">
              TakaZone uygulamasının ayarlar bölümünden çerez tercihlerinizi güncelleyebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* Üçüncü Taraf Çerezleri */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          4. Üçüncü Taraf Çerezleri
        </h2>
        <p className="text-gray-600 mb-4">
          Hizmet kalitemizi artırmak için aşağıdaki üçüncü taraf hizmetlerini kullanıyoruz:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Google Analytics:</strong> Platform kullanım istatistikleri</p>
          <p>■ <strong>Firebase:</strong> Uygulama performansı ve hata takibi</p>
          <p>■ <strong>Sentry:</strong> Hata izleme ve raporlama</p>
        </div>
      </section>

      {/* Saklama Süresi */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          5. Çerez Saklama Süreleri
        </h2>
        
        <div className="bg-gray-50 rounded-xl p-4">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2 font-medium text-gray-700">Oturum Çerezleri</td>
                <td className="py-2 text-gray-600">Tarayıcı kapatılınca silinir</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Tercih Çerezleri</td>
                <td className="py-2 text-gray-600">1 yıl</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Analitik Çerezleri</td>
                <td className="py-2 text-gray-600">2 yıl</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Reklam Çerezleri</td>
                <td className="py-2 text-gray-600">90 gün</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* İletişim */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          6. İletişim
        </h2>
        <p className="text-gray-600 mb-4">
          Çerez politikamızla ilgili sorularınız için:
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📧</span>
            <strong>E-posta:</strong> bilgi@teknovagroup.com
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📞</span>
            <strong>Telefon:</strong> 0543 509 84 85
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
        <p><strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong></p>
        <p className="mt-1">Bu çerez politikası 10.12.2025 tarihinde güncellenmiştir.</p>
      </div>
    </div>
  )
}
