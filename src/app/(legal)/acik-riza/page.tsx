'use client'

export default function ConsentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Açık Rıza Metni
        </h1>
        <p className="text-sm text-gray-500">Son Güncelleme: 10 Aralık 2025</p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, 
          aşağıda belirtilen veri işleme faaliyetleri için açık rızanızı talep ediyoruz.
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
          <p><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</p>
          <p><strong>E-posta:</strong> bilgi@teknovagroup.com</p>
        </div>
      </section>

      {/* Rıza Gerektiren İşlemler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          2. Açık Rıza Gerektiren Veri İşlemleri
        </h2>
        <p className="text-gray-600 mb-4">
          Aşağıdaki işlemler için ayrı ayrı açık rızanızı talep ediyoruz:
        </p>

        <div className="space-y-4">
          {/* Pazarlama */}
          <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-purple-700 mb-2">📢 Pazarlama İletişimi</h3>
            <p className="text-sm text-gray-600 mb-3">
              E-posta, SMS veya push bildirim yoluyla kampanya, indirim ve yeni özellik 
              duyuruları gönderilmesi.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600">
              <p><strong>İşlenen Veriler:</strong> Ad, e-posta, telefon numarası</p>
              <p><strong>Amaç:</strong> Promosyon ve pazarlama iletişimi</p>
            </div>
          </div>

          {/* Profil Analizi */}
          <div className="bg-pink-50 rounded-xl p-4 border-l-4 border-pink-400">
            <h3 className="font-semibold text-pink-700 mb-2">📊 Kişiselleştirilmiş Öneriler</h3>
            <p className="text-sm text-gray-600 mb-3">
              Beğenileriniz ve kullanım alışkanlıklarınıza göre size özel ürün önerileri sunulması.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600">
              <p><strong>İşlenen Veriler:</strong> Beğeni geçmişi, arama geçmişi, kategori tercihleri</p>
              <p><strong>Amaç:</strong> Kişiselleştirilmiş kullanıcı deneyimi</p>
            </div>
          </div>

          {/* Konum */}
          <div className="bg-orange-50 rounded-xl p-4 border-l-4 border-orange-400">
            <h3 className="font-semibold text-orange-700 mb-2">📍 Konum Verisi</h3>
            <p className="text-sm text-gray-600 mb-3">
              Yakınınızdaki takas fırsatlarını göstermek için konum bilginizin kullanılması.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600">
              <p><strong>İşlenen Veriler:</strong> Cihaz konum bilgisi (şehir/ilçe düzeyinde)</p>
              <p><strong>Amaç:</strong> Yakındaki ürünleri filtreleme</p>
            </div>
          </div>

          {/* Üçüncü Taraf Paylaşım */}
          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-700 mb-2">🔗 Üçüncü Taraf Paylaşımı</h3>
            <p className="text-sm text-gray-600 mb-3">
              Reklam ve analiz amaçlı olarak anonim kullanım verilerinin iş ortaklarıyla paylaşılması.
            </p>
            <div className="bg-white/50 rounded-lg p-3 text-xs text-gray-600">
              <p><strong>İşlenen Veriler:</strong> Anonim kullanım istatistikleri</p>
              <p><strong>Amaç:</strong> Platform geliştirme ve reklam optimizasyonu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Rıza Özgürlüğü */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          3. Rıza Özgürlüğü
        </h2>
        
        <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Önemli:</strong> Bu rızalar tamamen isteğe bağlıdır.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Rıza vermemeniz halinde temel platform hizmetlerini kullanmaya devam edebilirsiniz</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Verdiğiniz rızayı istediğiniz zaman geri çekebilirsiniz</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Rıza geri çekilmesi önceki işlemleri geçersiz kılmaz</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Rıza Yönetimi */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          4. Rızanızı Nasıl Yönetirsiniz?
        </h2>
        <p className="text-gray-600 mb-4">
          Rıza tercihlerinizi aşağıdaki yöntemlerle değiştirebilirsiniz:
        </p>
        
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="font-semibold text-gray-700">Uygulama Ayarları</h3>
              <p className="text-sm text-gray-600">Profil → Ayarlar → Gizlilik bölümünden</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">📧</span>
            <div>
              <h3 className="font-semibold text-gray-700">E-posta ile</h3>
              <p className="text-sm text-gray-600">bilgi@teknovagroup.com adresine yazarak</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <h3 className="font-semibold text-gray-700">Telefon ile</h3>
              <p className="text-sm text-gray-600">0543 509 84 85 numarasını arayarak</p>
            </div>
          </div>
        </div>
      </section>

      {/* Yasal Dayanak */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          5. Yasal Dayanak
        </h2>
        <p className="text-gray-600 mb-4">
          Bu açık rıza metni aşağıdaki yasal düzenlemelere dayanmaktadır:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>6698 sayılı KVKK:</strong> Madde 5/1 ve Madde 6/2 (Açık rıza şartı)</p>
          <p>■ <strong>6563 sayılı ETK:</strong> Ticari elektronik ileti gönderimi</p>
          <p>■ <strong>Kişisel Verileri Koruma Kurulu kararları</strong></p>
        </div>
      </section>

      {/* Detaylı Bilgi */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          6. Detaylı Bilgi
        </h2>
        <p className="text-gray-600 mb-4">
          Veri işleme faaliyetlerimiz hakkında detaylı bilgi için:
        </p>
        
        <div className="flex flex-wrap gap-2">
          <a href="/kvkk-aydinlatma" className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm hover:bg-purple-200 transition">
            KVKK Aydınlatma Metni
          </a>
          <a href="/gizlilik-politikasi" className="bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm hover:bg-pink-200 transition">
            Gizlilik Politikası
          </a>
        </div>
      </section>

      {/* İletişim */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          7. İletişim
        </h2>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📧</span>
            <strong>E-posta:</strong> bilgi@teknovagroup.com
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📞</span>
            <strong>Telefon:</strong> 0543 509 84 85
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">🏢</span>
            <strong>Adres:</strong> Mevlana Mah. No:8 Kapı No:23, 06949 Sincan/Ankara
          </p>
        </div>
      </section>

      {/* Footer */}
      <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
        <p><strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong></p>
        <p className="mt-1">Bu açık rıza metni 10.12.2025 tarihinde güncellenmiştir.</p>
      </div>
    </div>
  )
}
