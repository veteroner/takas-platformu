'use client'

export default function MembershipAgreementPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          Üyelik Sözleşmesi
        </h1>
        <p className="text-sm text-gray-500">Son Güncelleme: 10 Aralık 2025</p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          Bu sözleşme, <strong>TakaZone</strong> platformunu kullanmanız için geçerli olan 
          şartları ve koşulları belirlemektedir. Platformu kullanarak bu koşulları kabul etmiş sayılırsınız.
        </p>
      </div>

      {/* Taraflar */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          1. Taraflar
        </h2>
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 mb-2">Platform Sahibi</h3>
            <p className="text-sm text-gray-600">Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</p>
            <p className="text-sm text-gray-600">MERSİS No: 0836100073000001</p>
            <p className="text-sm text-gray-600">VKN: 8361000730</p>
            <p className="text-sm text-gray-600">Adres: Mevlana Mah. No:8 Kapı No:23, 06949 Sincan/Ankara</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Üye</h3>
            <p className="text-sm text-gray-600">Platformda hesap oluşturan gerçek veya tüzel kişi</p>
          </div>
        </div>
      </section>

      {/* Tanımlar */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          2. Tanımlar
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Platform:</strong> TakaZone mobil uygulaması ve takazone.com web sitesi</p>
          <p>■ <strong>Takas:</strong> Üyeler arasında para karşılığı olmadan ürün değişimi</p>
          <p>■ <strong>Eşleşme:</strong> İki üyenin birbirinin ürününü beğenmesi sonucu oluşan durum</p>
          <p>■ <strong>İçerik:</strong> Üyelerin yüklediği fotoğraf, açıklama ve diğer materyaller</p>
        </div>
      </section>

      {/* Üyelik Şartları */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          3. Üyelik Şartları
        </h2>
        <div className="space-y-3">
          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-green-700 mb-2">✓ Kabul Edilen</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 18 yaşını doldurmuş gerçek kişiler</li>
              <li>• Türkiye'de yerleşik kişiler</li>
              <li>• Geçerli iletişim bilgilerine sahip kişiler</li>
            </ul>
          </div>
          
          <div className="bg-red-50 rounded-xl p-4 border-l-4 border-red-400">
            <h3 className="font-semibold text-red-700 mb-2">✗ Kabul Edilmeyen</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 18 yaşından küçükler (veli izni olmadan)</li>
              <li>• Daha önce hesabı kalıcı olarak askıya alınanlar</li>
              <li>• Sahte veya yanıltıcı bilgi verenler</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Üyenin Yükümlülükleri */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          4. Üyenin Yükümlülükleri
        </h2>
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 mb-2">📝 İçerik Kuralları</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Gerçek ve doğru ürün bilgisi paylaşmalısınız</li>
              <li>• Ürün fotoğrafları gerçeği yansıtmalıdır</li>
              <li>• Yasadışı ürün ilan edemezsiniz</li>
              <li>• Telif hakkı ihlali yapan içerik paylaşamazsınız</li>
            </ul>
          </div>
          
          <div className="bg-pink-50 rounded-xl p-4">
            <h3 className="font-semibold text-pink-700 mb-2">🤝 Takas Kuralları</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Eşleşilen kullanıcıyla iyi niyetli iletişim kurmalısınız</li>
              <li>• Anlaşılan takası tamamlamalısınız</li>
              <li>• Ürünü tanıtıldığı şekilde teslim etmelisiniz</li>
              <li>• Takas tamamlandıktan sonra değerlendirme yapmalısınız</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="font-semibold text-orange-700 mb-2">🚫 Yasaklar</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Spam veya rahatsız edici mesaj gönderemezsiniz</li>
              <li>• Başkalarının hesaplarına erişemezsiniz</li>
              <li>• Platform güvenliğini tehlikeye atacak işlem yapamazsınız</li>
              <li>• Platform dışında ödeme talep edemezsiniz</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Yasak Ürünler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          5. Yasak Ürünler
        </h2>
        <p className="text-gray-600 mb-4">
          Aşağıdaki ürünlerin ilanı kesinlikle yasaktır:
        </p>
        <div className="bg-red-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ Yasa dışı ürünler (silah, uyuşturucu vb.)</p>
          <p>■ Çalıntı veya kaçak ürünler</p>
          <p>■ Reçeteli ilaçlar ve tıbbi cihazlar</p>
          <p>■ Canlı hayvanlar (tehlikeli türler)</p>
          <p>■ Müstehcen içerikli ürünler</p>
          <p>■ Sahte veya kopya ürünler</p>
          <p>■ Patlayıcı ve yanıcı maddeler</p>
        </div>
      </section>

      {/* Platformun Hakları */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          6. Platformun Hakları
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">●</span>
            <span>Kurallara uymayan ilanları kaldırma hakkı</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">●</span>
            <span>Hesapları geçici veya kalıcı olarak askıya alma hakkı</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">●</span>
            <span>Platform kurallarını güncelleme hakkı</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">●</span>
            <span>Gerektiğinde yetkili makamlara bilgi verme hakkı</span>
          </li>
        </ul>
      </section>

      {/* Sorumluluk Sınırı */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          7. Sorumluluk Sınırı
        </h2>
        <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
          <p className="text-sm text-gray-700 mb-3">
            <strong>Önemli:</strong> TakaZone yalnızca bir aracı platformdur.
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Üyeler arasındaki takasların tarafı değiliz</li>
            <li>• Ürünlerin kalitesi veya durumu konusunda garanti vermiyoruz</li>
            <li>• Takas sonrası yaşanan anlaşmazlıklarda taraf değiliz</li>
            <li>• Platform kesintileri nedeniyle oluşan zararlardan sorumlu değiliz</li>
          </ul>
        </div>
      </section>

      {/* Fikri Mülkiyet */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          8. Fikri Mülkiyet
        </h2>
        <p className="text-gray-600 mb-4">
          Platform üzerindeki tüm marka, logo, tasarım ve içerikler Teknova'ya aittir.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
          <p>Üye olarak yüklediğiniz içeriklerin fikri mülkiyet hakkı size aittir. Ancak platform üzerinde 
          yayınlanması için bize sınırsız, dünya çapında, telifsiz kullanım lisansı vermiş olursunuz.</p>
        </div>
      </section>

      {/* Hesap Sonlandırma */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          9. Üyelik İptali
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Üye Tarafından</h3>
            <p className="text-sm text-gray-600">
              Hesabınızı istediğiniz zaman Ayarlar → Hesap → Hesabı Sil bölümünden silebilirsiniz.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Platform Tarafından</h3>
            <p className="text-sm text-gray-600">
              Sözleşme ihlallerinde hesabınızı önceden bildirmeksizin askıya alabiliriz.
            </p>
          </div>
        </div>
      </section>

      {/* Uyuşmazlık */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          10. Uyuşmazlık Çözümü
        </h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Uygulanacak Hukuk:</strong> Türkiye Cumhuriyeti kanunları</p>
          <p>■ <strong>Yetkili Mahkeme:</strong> Ankara Mahkemeleri ve İcra Daireleri</p>
          <p>■ <strong>Arabuluculuk:</strong> Zorunlu arabuluculuk kapsamındaki uyuşmazlıklar için öncelikle arabuluculuğa başvurulur</p>
        </div>
      </section>

      {/* İletişim */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          11. İletişim
        </h2>
        <p className="text-gray-600 mb-4">
          Sorularınız için bize ulaşın:
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
          <p className="flex items-center gap-2">
            <span className="text-purple-500">🌐</span>
            <strong>Website:</strong> takazone.com
          </p>
        </div>
      </section>

      {/* Değişiklikler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          12. Sözleşme Değişiklikleri
        </h2>
        <p className="text-gray-600">
          Bu sözleşmeyi önceden bildirimde bulunarak değiştirebiliriz. Önemli değişiklikler 
          için e-posta veya uygulama içi bildirim ile bilgilendirileceksiniz. Değişiklik sonrası 
          platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
        </p>
      </section>

      {/* Footer */}
      <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
        <p><strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong></p>
        <p className="mt-1">Bu üyelik sözleşmesi 10.12.2025 tarihinde güncellenmiştir.</p>
      </div>
    </div>
  )
}
