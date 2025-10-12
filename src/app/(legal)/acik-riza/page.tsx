'use client'

export default function ConsentPage() {
  return (
    <div className="prose prose-gray max-w-3xl mx-auto px-4 py-10">
      <h1>Açık Rıza Metni ve Onay Formu</h1>
      
      <p className="text-sm text-gray-600">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 my-6">
        <p className="text-sm font-medium">
          <strong>Önemli Bilgi:</strong> Bu rıza metni tamamen isteğe bağlıdır. 
          Rıza vermemeniz Platform'un temel işlevlerini etkilemez.
        </p>
      </div>

      <h2>1. Açık Rızanın Kapsamı ve Amacı</h2>
      <p>
        Bu metin, <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 5. maddesinin 1. fıkrası</strong> 
        uyarınca açık rızanıza dayalı olarak gerçekleştirilen kişisel veri işleme faaliyetlerini düzenler.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3>Açık Rıza Gerektiren Faaliyetler:</h3>
        <ul className="text-sm mt-2">
          <li>• Pazarlama iletileri gönderimi</li>
          <li>• Kişiselleştirilmiş ürün önerileri</li>
          <li>• Davranışsal profil çıkarımı</li>
          <li>• Hedefli reklam gösterimi</li>
          <li>• Analitik ve pazarlama çerezleri</li>
          <li>• Konum tabanlı öneriler</li>
          <li>• Sosyal medya entegrasyonları</li>
        </ul>
      </div>

      <h2>2. Rıza Konuları ve Detayları</h2>
      
      <h3>2.1 Pazarlama İletişimi</h3>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800">Pazarlama İletileri</h4>
        <p className="text-sm mt-2">
          <strong>Kapsam:</strong> E-posta, SMS, push bildirimi ve telefon ile pazarlama iletileri<br/>
          <strong>Amaç:</strong> Yeni özellikler, kampanyalar, etkinlikler hakkında bilgilendirme<br/>
          <strong>Sıklık:</strong> Haftada maksimum 3 e-posta, ayda maksimum 4 SMS<br/>
          <strong>İçerik:</strong> Takas fırsatları, platform güncellemeleri, özel teklifler
        </p>
        <div className="mt-3 p-2 bg-yellow-100 rounded">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Pazarlama iletileri almayı kabul ediyorum</span>
          </label>
        </div>
      </div>

      <h3>2.2 Kişiselleştirme ve Profilleme</h3>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-800">Kişiselleştirilmiş Öneriler</h4>
        <p className="text-sm mt-2">
          <strong>Kapsam:</strong> Platform kullanım verilerinizin analiz edilmesi<br/>
          <strong>Amaç:</strong> Size uygun takas önerileri ve içerik kişiselleştirmesi<br/>
          <strong>Yöntem:</strong> Makine öğrenmesi algoritmaları ve davranış analizi<br/>
          <strong>Sonuç:</strong> Daha alakalı ürün önerileri ve gelişmiş kullanıcı deneyimi
        </p>
        <div className="mt-3 p-2 bg-purple-100 rounded">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Kişiselleştirilmiş öneriler almayı kabul ediyorum</span>
          </label>
        </div>
      </div>

      <h3>2.3 Konum Tabanlı Hizmetler</h3>
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800">Konum Bilgisi Kullanımı</h4>
        <p className="text-sm mt-2">
          <strong>Kapsam:</strong> Yaklaşık konum bilginizin (şehir/ilçe) kullanımı<br/>
          <strong>Amaç:</strong> Yakınınızdaki takas fırsatlarının gösterilmesi<br/>
          <strong>Hassasiyet:</strong> Kesin konum değil, yalnızca genel bölge bilgisi<br/>
          <strong>Güvenlik:</strong> Konum bilgisi şifrelenerek saklanır
        </p>
        <div className="mt-3 p-2 bg-green-100 rounded">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Konum tabanlı öneriler almayı kabul ediyorum</span>
          </label>
        </div>
      </div>

      <h3>2.4 Analitik ve Pazarlama Çerezleri</h3>
      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-semibold text-red-800">Gelişmiş Çerez Kullanımı</h4>
        <p className="text-sm mt-2">
          <strong>Kapsam:</strong> Google Analytics, Facebook Pixel, Hotjar vb. araçlar<br/>
          <strong>Amaç:</strong> Platform kullanımının analizi ve iyileştirmesi<br/>
          <strong>Paylaşım:</strong> Anonim veriler üçüncü taraf analitik şirketlerle<br/>
          <strong>Faydalar:</strong> Daha iyi kullanıcı deneyimi ve platform geliştirme
        </p>
        <div className="mt-3 p-2 bg-red-100 rounded">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm">Analitik ve pazarlama çerezlerini kabul ediyorum</span>
          </label>
        </div>
      </div>

      <h2>3. İşlenecek Kişisel Veriler</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Veri Kategorisi</th>
            <th className="border border-gray-300 px-3 py-2">Veri Türleri</th>
            <th className="border border-gray-300 px-3 py-2">Kullanım Amacı</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">İletişim Bilgileri</td>
            <td className="border border-gray-300 px-3 py-2">E-posta, telefon, adres</td>
            <td className="border border-gray-300 px-3 py-2">Pazarlama iletileri</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Davranışsal Veriler</td>
            <td className="border border-gray-300 px-3 py-2">Tıklama, görüntüleme, arama</td>
            <td className="border border-gray-300 px-3 py-2">Kişiselleştirme</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Tercih Verileri</td>
            <td className="border border-gray-300 px-3 py-2">İlgi alanları, kategoriler</td>
            <td className="border border-gray-300 px-3 py-2">Öneriler</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Konum Bilgisi</td>
            <td className="border border-gray-300 px-3 py-2">Şehir, ilçe, bölge</td>
            <td className="border border-gray-300 px-3 py-2">Yerel öneriler</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Cihaz Bilgileri</td>
            <td className="border border-gray-300 px-3 py-2">Tarayıcı, OS, ekran</td>
            <td className="border border-gray-300 px-3 py-2">Optimizasyon</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Veri Paylaşımı ve Aktarımı</h2>
      
      <h3>4.1 Pazarlama ve Analitik Ortakları</h3>
      <ul>
        <li><strong>E-posta Servisleri:</strong> Mailchimp, SendGrid (pazarlama iletileri)</li>
        <li><strong>SMS Servisleri:</strong> Netgsm, İletimerkezi (SMS bildirimleri)</li>
        <li><strong>Analitik Araçları:</strong> Google Analytics, Hotjar (kullanım analizi)</li>
        <li><strong>Reklam Ağları:</strong> Google Ads, Facebook Ads (hedefli reklamlar)</li>
        <li><strong>CRM Sistemleri:</strong> Müşteri ilişkileri yönetimi</li>
      </ul>

      <h3>4.2 Veri Güvenliği Tedbirleri</h3>
      <ul>
        <li>Tüm aktarımlar şifreli kanallarla (HTTPS/TLS)</li>
        <li>Veri işleme sözleşmeleri ile koruma</li>
        <li>Düzenli güvenlik denetimleri</li>
        <li>Erişim loglarının tutulması</li>
        <li>GDPR uyumlu veri işleme anlaşmaları</li>
      </ul>

      <h2>5. Rızanın Süresi ve Yönetimi</h2>
      
      <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
        <h3>Rıza Süresi ve Koşulları</h3>
        <ul className="text-sm mt-2">
          <li><strong>Süre:</strong> Geri çekilene kadar, maksimum 3 yıl</li>
          <li><strong>Otomatik Yenileme:</strong> Yoktur, süre sonunda tekrar onay gerekir</li>
          <li><strong>Güncellenme:</strong> Platform değişikliklerinde yeniden rıza talep edilir</li>
          <li><strong>Kayıt:</strong> Tüm rıza işlemleri tarih/saat ile kayıt altına alınır</li>
        </ul>
      </div>

      <h3>5.1 Rızayı Geri Çekme Yolları</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800">Platform Üzerinden</h4>
          <ul className="text-sm mt-2">
            <li>• Hesap Ayarları → Gizlilik</li>
            <li>• E-posta altında "Abonelik İptal"</li>
            <li>• SMS'de "IPTAL" yazarak yanıtla</li>
            <li>• Push bildirimi ayarları</li>
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Direkt İletişim</h4>
          <ul className="text-sm mt-2">
            <li>• E-posta: riza@teknovagroup.com</li>
            <li>• KVKK: kvkk@teknovagroup.com</li>
            <li>• Telefon: [Numara eklenecek]</li>
            <li>• Canlı destek: Platform üzerinden</li>
          </ul>
        </div>
      </div>

      <h2>6. Rıza Geri Çekmenin Sonuçları</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Rıza Türü</th>
            <th className="border border-gray-300 px-3 py-2">Geri Çekme Süresi</th>
            <th className="border border-gray-300 px-3 py-2">Etki</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Pazarlama İletileri</td>
            <td className="border border-gray-300 px-3 py-2">24 saat</td>
            <td className="border border-gray-300 px-3 py-2">E-posta/SMS durur</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Kişiselleştirme</td>
            <td className="border border-gray-300 px-3 py-2">72 saat</td>
            <td className="border border-gray-300 px-3 py-2">Genel öneriler gösterilir</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Konum Hizmetleri</td>
            <td className="border border-gray-300 px-3 py-2">Anında</td>
            <td className="border border-gray-300 px-3 py-2">Yakın konum önerileri durur</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Analitik Çerezler</td>
            <td className="border border-gray-300 px-3 py-2">Sonraki ziyaret</td>
            <td className="border border-gray-300 px-3 py-2">İstatistiklerde yer almazsınız</td>
          </tr>
        </tbody>
      </table>

      <h2>7. Yasal Haklar ve Güvenceler</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3>KVKK Kapsamındaki Haklarınız</h3>
        <ul className="text-sm mt-2">
          <li><strong>Rızayı Geri Çekme:</strong> Herhangi bir gerekçe göstermeden</li>
          <li><strong>Veri Portabilite:</strong> Verilerinizi başka platforma taşıma</li>
          <li><strong>Erişim Hakkı:</strong> İşlenen verilerinizi öğrenme</li>
          <li><strong>Düzeltme Hakkı:</strong> Yanlış verilerin düzeltilmesi</li>
          <li><strong>Silme Hakkı:</strong> Pazarlama verilerinin silinmesi</li>
          <li><strong>İtiraz Hakkı:</strong> Otomatik kararlara itiraz etme</li>
        </ul>
      </div>

      <h2>8. Rıza Verme Süreci</h2>
      
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-green-800 font-semibold">Elektronik Rıza Onay Formu</h3>
        
        <div className="mt-4 space-y-4">
          <div className="p-3 bg-white rounded border">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1" />
              <span className="text-sm">
                <strong>Pazarlama İletişimi:</strong> E-posta, SMS ve push bildirimi ile 
                pazarlama iletileri almayı, kampanya ve özel tekliflerden haberdar olmayı kabul ediyorum.
              </span>
            </label>
          </div>
          
          <div className="p-3 bg-white rounded border">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1" />
              <span className="text-sm">
                <strong>Kişiselleştirme:</strong> Platform kullanım verilerimin analiz edilerek 
                kişiselleştirilmiş ürün önerileri ve içerik gösterilmesini kabul ediyorum.
              </span>
            </label>
          </div>
          
          <div className="p-3 bg-white rounded border">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1" />
              <span className="text-sm">
                <strong>Konum Hizmetleri:</strong> Yaklaşık konum bilgimin kullanılarak 
                yerel takas önerilerinin gösterilmesini kabul ediyorum.
              </span>
            </label>
          </div>
          
          <div className="p-3 bg-white rounded border">
            <label className="flex items-start">
              <input type="checkbox" className="mr-3 mt-1" />
              <span className="text-sm">
                <strong>Analitik Çerezler:</strong> Google Analytics, Hotjar gibi analitik 
                araçlarla platform kullanımımın anonim olarak analiz edilmesini kabul ediyorum.
              </span>
            </label>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <label className="flex items-start">
            <input type="checkbox" className="mr-3 mt-1" required />
            <span className="text-sm font-medium">
              Yukarıdaki açık rıza metnini okudum, anladım ve seçimlerimi bilinçli olarak yaptım. 
              Bu rızamı istediğim zaman geri çekebileceğimi biliyorum.
            </span>
          </label>
        </div>
        
        <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
          Rızamı Vererek Devam Et
        </button>
      </div>

      <h2>9. İletişim ve Destek</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3>Rıza Yönetimi ve Sorularınız İçin</h3>
        <ul className="mt-2">
          <li><strong>Rıza İşlemleri:</strong> riza@teknovagroup.com</li>
          <li><strong>KVKK Sorumlusu:</strong> kvkk@teknovagroup.com</li>
          <li><strong>Genel Destek:</strong> destek@teknovagroup.com</li>
          <li><strong>Telefon:</strong> [Telefon numarası eklenecek]</li>
          <li><strong>Canlı Destek:</strong> Platform üzerinden 7/24</li>
          <li><strong>Çalışma Saatleri:</strong> 09:00-18:00 (Pazartesi-Cuma)</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mt-8 border border-blue-200">
        <p className="text-sm">
          <strong>Açık Rıza Metni Bilgileri:</strong><br/>
          <strong>Hazırlık Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Yürürlük Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Versiyon:</strong> 2.0<br/>
          <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Geçerlilik Süresi:</strong> 3 yıl (yenileme gerekir)<br/>
          <strong>Hukuki Dayanak:</strong> KVKK m.5/1, GDPR m.7<br/>
          <strong>Hazırlayan:</strong> Veri Koruma Sorumlusu<br/>
          <strong>Onaylayan:</strong> Hukuk İşleri Müdürü
        </p>
        
        <div className="mt-4 p-3 bg-green-100 rounded border-l-4 border-green-400">
          <p className="text-sm font-medium text-green-800">
            <strong>Hatırlatma:</strong> Bu rıza tamamen isteğe bağlıdır ve Platform'un 
            temel işlevlerini kullanmak için gerekli değildir. Rızanızı istediğiniz zaman 
            geri çekebilir ve değiştirebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}


