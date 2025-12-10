'use client'

export default function CookiesPage() {
  return (
    <div className="prose prose-gray max-w-3xl mx-auto px-4 py-10">
      <h1>Çerez (Cookie) Politikası</h1>
      
      <p className="text-sm text-gray-600">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-green-400 my-6">
        <p className="text-sm font-medium">
          <strong>Çerez Yönetimi:</strong> Çerez tercihlerinizi Platform üzerindeki 
          yönetim panelinden dilediğiniz zaman değiştirebilirsiniz.
        </p>
      </div>

      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, web sitelerini ziyaret ettiğinizde tarayıcınızda saklanan 
        küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını, 
        kullanıcı deneyimini iyileştirmesini ve site sahiplerinin ziyaretçi 
        davranışlarını anlamasını sağlar.
      </p>

      <h2>2. Çerez Türleri ve Kullanım Amaçları</h2>
      
      <h3>2.1 Zorunlu Çerezler (Her Zaman Aktif)</h3>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm mb-3">
          Bu çerezler Platform'un temel işlevleri için gereklidir ve kapatılamaz.
        </p>
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-purple-100">
              <th className="border border-gray-300 px-3 py-2">Çerez Adı</th>
              <th className="border border-gray-300 px-3 py-2">Amaç</th>
              <th className="border border-gray-300 px-3 py-2">Süre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">session_token</td>
              <td className="border border-gray-300 px-3 py-2">Oturum yönetimi</td>
              <td className="border border-gray-300 px-3 py-2">Tarayıcı kapanana kadar</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">auth_token</td>
              <td className="border border-gray-300 px-3 py-2">Kimlik doğrulama</td>
              <td className="border border-gray-300 px-3 py-2">30 gün</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">csrf_token</td>
              <td className="border border-gray-300 px-3 py-2">Güvenlik</td>
              <td className="border border-gray-300 px-3 py-2">Oturum süresi</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">cookie_consent</td>
              <td className="border border-gray-300 px-3 py-2">Çerez tercih yönetimi</td>
              <td className="border border-gray-300 px-3 py-2">1 yıl</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>2.2 Performans Çerezleri (İsteğe Bağlı)</h3>
      <div className="bg-amber-50 p-4 rounded-lg">
        <p className="text-sm mb-3">
          Platform performansını ölçmek ve iyileştirmek için kullanılır.
        </p>
        <ul className="text-sm">
          <li><strong>Google Analytics:</strong> Ziyaretçi istatistikleri ve davranış analizi</li>
          <li><strong>Hotjar:</strong> Kullanıcı deneyimi haritaları ve heatmap</li>
          <li><strong>Performance Monitoring:</strong> Sayfa yükleme süreleri ve hata takibi</li>
          <li><strong>A/B Testing:</strong> Farklı versiyonların test edilmesi</li>
        </ul>
      </div>

      <h3>2.3 İşlevsel Çerezler (İsteğe Bağlı)</h3>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm mb-3">
          Kişiselleştirilmiş deneyim için tercihlerinizi hatırlar.
        </p>
        <ul className="text-sm">
          <li><strong>Dil Tercihi:</strong> Seçtiğiniz dil ayarını hatırlar</li>
          <li><strong>Tema Modu:</strong> Koyu/açık tema tercihini saklar</li>
          <li><strong>Konum Bilgisi:</strong> Seçtiğiniz şehir/bölge bilgisi</li>
          <li><strong>Arama Filtreleri:</strong> Sık kullanılan arama kriterleriniz</li>
          <li><strong>Görüntüleme Tercihi:</strong> Liste/kart görünümü seçimi</li>
        </ul>
      </div>

      <h3>2.4 Pazarlama Çerezleri (Açık Rıza Gerekli)</h3>
      <div className="bg-rose-50 p-4 rounded-lg">
        <p className="text-sm mb-3">
          Yalnızca açık rızanızla hedefli reklamlar için kullanılır.
        </p>
        <ul className="text-sm">
          <li><strong>Google Ads:</strong> Kişiselleştirilmiş reklamlar</li>
          <li><strong>Facebook Pixel:</strong> Sosyal medya reklamları</li>
          <li><strong>Retargeting:</strong> Ziyaret ettiğiniz ürünlerin hatırlatılması</li>
          <li><strong>Affiliate Tracking:</strong> Ortaklık programları takibi</li>
        </ul>
      </div>

      <h2>3. Üçüncü Taraf Çerezleri</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-purple-100">
            <th className="border border-gray-300 px-3 py-2">Sağlayıcı</th>
            <th className="border border-gray-300 px-3 py-2">Hizmet</th>
            <th className="border border-gray-300 px-3 py-2">Gizlilik Politikası</th>
            <th className="border border-gray-300 px-3 py-2">Opt-Out</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Google</td>
            <td className="border border-gray-300 px-3 py-2">Analytics, Ads</td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google Gizlilik
              </a>
            </td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                GA Opt-out
              </a>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Facebook</td>
            <td className="border border-gray-300 px-3 py-2">Pixel, Ads</td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://www.facebook.com/privacy/explanation" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                FB Gizlilik
              </a>
            </td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Reklam Ayarları
              </a>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Hotjar</td>
            <td className="border border-gray-300 px-3 py-2">Heatmap, Recording</td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://www.hotjar.com/legal/policies/privacy/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Hotjar Gizlilik
              </a>
            </td>
            <td className="border border-gray-300 px-3 py-2">
              <a href="https://www.hotjar.com/legal/compliance/opt-out/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Hotjar Opt-out
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h2>4. Çerez Yönetimi ve Kontrol</h2>
      
      <h3>4.1 Platform Üzerinden Yönetim</h3>
      <div className="bg-emerald-50 p-4 rounded-lg">
        <p className="text-sm mb-3">
          <strong>Çerez Tercih Merkezi:</strong> Hesap ayarlarınızdan çerez kategorilerini 
          ayrı ayrı yönetebilirsiniz.
        </p>
        <ul className="text-sm">
          <li>• Ana sayfa alt kısmındaki "Çerez Ayarları" linkine tıklayın</li>
          <li>• Hesap menüsünden "Gizlilik Ayarları" → "Çerez Tercihleri"</li>
          <li>• Değişiklikleriniz anında etkinleşir</li>
          <li>• İstediğiniz zaman tekrar değiştirebilirsiniz</li>
        </ul>
      </div>

      <h3>4.2 Tarayıcı Ayarları ile Yönetim</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-purple-50/50 p-4 rounded-lg">
          <h4 className="font-semibold">Chrome</h4>
          <p className="text-sm mt-2">
            Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri
          </p>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-lg">
          <h4 className="font-semibold">Firefox</h4>
          <p className="text-sm mt-2">
            Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri
          </p>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-lg">
          <h4 className="font-semibold">Safari</h4>
          <p className="text-sm mt-2">
            Tercihler → Gizlilik → Çerezleri engelle
          </p>
        </div>
        <div className="bg-purple-50/50 p-4 rounded-lg">
          <h4 className="font-semibold">Edge</h4>
          <p className="text-sm mt-2">
            Ayarlar → Çerezler ve site izinleri → Çerezleri yönet
          </p>
        </div>
      </div>

      <h3>4.3 Mobil Cihazlarda Yönetim</h3>
      <ul>
        <li><strong>iOS Safari:</strong> Ayarlar → Safari → Çerezleri Engelle</li>
        <li><strong>Android Chrome:</strong> Chrome → Ayarlar → Site ayarları → Çerezler</li>
        <li><strong>Mobil Uygulama:</strong> Uygulama içi gizlilik ayarları</li>
      </ul>

      <h2>5. Çerez Saklama Süreleri</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-purple-100">
            <th className="border border-gray-300 px-3 py-2">Çerez Türü</th>
            <th className="border border-gray-300 px-3 py-2">Tipik Saklama Süresi</th>
            <th className="border border-gray-300 px-3 py-2">Açıklama</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Oturum Çerezleri</td>
            <td className="border border-gray-300 px-3 py-2">Tarayıcı kapanana kadar</td>
            <td className="border border-gray-300 px-3 py-2">Geçici, otomatik silinir</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Kimlik Doğrulama</td>
            <td className="border border-gray-300 px-3 py-2">30 gün</td>
            <td className="border border-gray-300 px-3 py-2">Beni hatırla seçeneği</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Tercih Çerezleri</td>
            <td className="border border-gray-300 px-3 py-2">1 yıl</td>
            <td className="border border-gray-300 px-3 py-2">Dil, tema vb. ayarlar</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Analitik Çerezleri</td>
            <td className="border border-gray-300 px-3 py-2">2 yıl</td>
            <td className="border border-gray-300 px-3 py-2">Google Analytics standart</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Pazarlama Çerezleri</td>
            <td className="border border-gray-300 px-3 py-2">90 gün</td>
            <td className="border border-gray-300 px-3 py-2">Reklam hedefleme için</td>
          </tr>
        </tbody>
      </table>

      <h2>6. Çerez Reddinin Etkileri</h2>
      
      <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 my-6">
        <p className="text-sm">
          <strong>Önemli Bilgi:</strong> Zorunlu çerezleri reddetmeniz halinde 
          Platform'un bazı özelliklerini kullanamayabilirsiniz.
        </p>
      </div>

      <h3>6.1 Etkilenen Özellikler</h3>
      <ul>
        <li><strong>Oturum Yönetimi:</strong> Otomatik çıkış yapabilir</li>
        <li><strong>Tercihler:</strong> Dil ve tema ayarları sıfırlanır</li>
        <li><strong>Alışveriş Sepeti:</strong> Ürünler kaybedilebilir</li>
        <li><strong>Kişiselleştirme:</strong> Öneriler daha az alakalı olur</li>
        <li><strong>Analitik:</strong> Site iyileştirmelerine katkıda bulunamazsınız</li>
      </ul>

      <h2>7. Veri Güvenliği ve Korunması</h2>
      
      <ul>
        <li><strong>Şifreleme:</strong> Tüm çerez verileri şifrelenerek saklanır</li>
        <li><strong>Erişim Kontrolü:</strong> Yalnızca yetkili sistemler erişebilir</li>
        <li><strong>Güncel Tutma:</strong> Düzenli olarak eski çerezler temizlenir</li>
        <li><strong>Güvenlik Taraması:</strong> Zararlı çerez faaliyeti izlenir</li>
        <li><strong>Veri Minimizasyonu:</strong> Gereken minimum veri toplanır</li>
      </ul>

      <h2>8. Yasal Uyum ve Standartlar</h2>
      
      <p>Bu politika aşağıdaki yasal çerçevelere uygun hazırlanmıştır:</p>
      <ul>
        <li><strong>KVKK:</strong> 6698 sayılı Kişisel Verilerin Korunması Kanunu</li>
        <li><strong>GDPR:</strong> Avrupa Birliği Genel Veri Koruma Tüzüğü</li>
        <li><strong>ePrivacy Directive:</strong> AB eGizlilik Direktifi</li>
        <li><strong>CCPA:</strong> Kaliforniya Tüketici Gizlilik Yasası</li>
        <li><strong>5651 Sayılı Kanun:</strong> İnternet Ortamında Yapılan Yayınların Düzenlenmesi</li>
      </ul>

      <h2>9. Çerez Politikası Güncellemeleri</h2>
      
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm">
          Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler:
        </p>
        <ul className="text-sm mt-2">
          <li>• Platform üzerinden duyurulur</li>
          <li>• E-posta ile bildirilir</li>
          <li>• Çerez banner'ında uyarı verilir</li>
          <li>• Yeni rıza talep edilebilir</li>
        </ul>
      </div>

      <h2>10. İletişim ve Destek</h2>
      
      <div className="bg-purple-50/50 p-4 rounded-lg">
        <p>Çerezler hakkında sorularınız için:</p>
        <ul className="mt-2">
          <li><strong>E-posta:</strong> cerez@teknovagroup.com</li>
          <li><strong>Genel Destek:</strong> destek@teknovagroup.com</li>
          <li><strong>KVKK Birimi:</strong> kvkk@teknovagroup.com</li>
          <li><strong>Telefon:</strong> [Telefon numarası eklenecek]</li>
          <li><strong>Çalışma Saatleri:</strong> 09:00-18:00 (Pazartesi-Cuma)</li>
        </ul>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg mt-8 border border-purple-200">
        <p className="text-sm">
          <strong>Çerez Politikası Bilgileri:</strong><br/>
          <strong>Yürürlük Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Versiyon:</strong> 2.0<br/>
          <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Sonraki İnceleme:</strong> {new Date(Date.now() + 180*24*60*60*1000).toLocaleDateString('tr-TR')}<br/>
          <strong>Hazırlayan:</strong> Veri Koruma Sorumlusu<br/>
          <strong>Onaylayan:</strong> Hukuk İşleri Müdürü<br/>
          <strong>Dil:</strong> Türkçe (bağlayıcı versiyon)
        </p>
        
        <div className="mt-4 p-3 bg-green-100 rounded border-l-4 border-green-400">
          <p className="text-sm font-medium text-emerald-700">
            Çerez tercihlerinizi Platform'daki yönetim panelinden istediğiniz zaman 
            değiştirebilirsiniz. Teknik destek için yukarıdaki iletişim kanallarını kullanabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}


