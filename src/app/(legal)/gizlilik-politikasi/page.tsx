'use client'

export default function PrivacyPage() {
  return (
    <div className="prose prose-gray max-w-3xl mx-auto px-4 py-10">
      <h1>Gizlilik Politikası</h1>
      
      <p className="text-sm text-gray-600">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <h2>1. Kapsam ve Uygulama Alanı</h2>
      <p>
        Bu Gizlilik Politikası, <strong>Teknova Tarım Hayvancılık Bilişim Reklam Limited Şirketi</strong> 
        ("Şirket", "biz", "Platform") tarafından sunulan takas platformu hizmetlerinde 
        <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong>, 
        <strong>Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR)</strong> ve ilgili mevzuat 
        kapsamında kişisel verilerin işlenmesine ilişkin esasları belirler.
      </p>
      
      <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400 my-6">
        <p className="text-sm font-medium">
          <strong>Önemli Hatırlatma:</strong> Bu Platform 18 yaş altı kullanıcılara yönelik değildir. 
          18 yaş altı bir kişinin verisini işlediğimizi öğrenirsek derhal sileriz.
        </p>
      </div>

      <h2>2. Veri Sorumlusu Bilgileri</h2>
      <ul>
        <li><strong>Unvan:</strong> Teknova Tarım Hayvancılık Bilişim Reklam Limited Şirketi</li>
        <li><strong>MERSİS No:</strong> 0836100073000001</li>
        <li><strong>Vergi Kimlik No:</strong> 8361000730</li>
        <li><strong>Vergi Dairesi:</strong> Sincan Vergi Dairesi Müdürlüğü</li>
        <li><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</li>
        <li><strong>Telefon:</strong> 0543 509 84 85</li>
        <li><strong>E-posta:</strong> bilgi@teknovagroup.com</li>
        <li><strong>Veri Sorumlusu Temsilcisi:</strong> İsa Bozkurt</li>
      </ul>

      <h2>3. Toplanan Kişisel Veriler ve Kaynakları</h2>
      
      <h3>3.1 Zorunlu Veriler</h3>
      <ul>
        <li><strong>Kimlik Verileri:</strong> Ad, soyad, doğum tarihi (yaş doğrulaması için)</li>
        <li><strong>İletişim Verileri:</strong> E-posta adresi, telefon numarası</li>
        <li><strong>Hesap Verileri:</strong> Kullanıcı adı, şifre (hashlenerek), profil fotoğrafı</li>
        <li><strong>Güvenlik Verileri:</strong> IP adresi, oturum bilgileri, cihaz kimliği</li>
      </ul>

      <h3>3.2 İsteğe Bağlı Veriler</h3>
      <ul>
        <li><strong>Profil Bilgileri:</strong> Biyografi, ilgi alanları, tercihler</li>
        <li><strong>Konum Verileri:</strong> Yaklaşık konum (şehir/ilçe düzeyinde)</li>
        <li><strong>Sosyal Medya:</strong> Bağlı hesap bilgileri (isteğe bağlı)</li>
      </ul>

      <h3>3.3 Otomatik Toplanan Veriler</h3>
      <ul>
        <li><strong>Teknik Veriler:</strong> Tarayıcı türü, işletim sistemi, ekran çözünürlüğü</li>
        <li><strong>Kullanım Verileri:</strong> Sayfa görüntülemeleri, tıklama verileri, oturum süresi</li>
        <li><strong>İletişim Verileri:</strong> Mesaj içerikleri, gönderim zamanları</li>
        <li><strong>İlan Verileri:</strong> Yüklenen fotoğraflar, açıklamalar, kategori bilgileri</li>
      </ul>

      <h2>4. Veri İşleme Amaçları ve Hukuki Dayanaklar</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-purple-100">
            <th className="border border-gray-300 px-4 py-2">Amaç</th>
            <th className="border border-gray-300 px-4 py-2">Hukuki Dayanak</th>
            <th className="border border-gray-300 px-4 py-2">KVKK Maddesi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Hesap oluşturma ve yönetimi</td>
            <td className="border border-gray-300 px-4 py-2">Sözleşmenin kurulması ve ifası</td>
            <td className="border border-gray-300 px-4 py-2">m.5/2-c</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Hizmet sunumu ve iyileştirme</td>
            <td className="border border-gray-300 px-4 py-2">Meşru menfaat</td>
            <td className="border border-gray-300 px-4 py-2">m.5/2-f</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Güvenlik ve dolandırıcılık önleme</td>
            <td className="border border-gray-300 px-4 py-2">Meşru menfaat</td>
            <td className="border border-gray-300 px-4 py-2">m.5/2-f</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">5651 sayılı Kanun gereği log tutma</td>
            <td className="border border-gray-300 px-4 py-2">Yasal yükümlülük</td>
            <td className="border border-gray-300 px-4 py-2">m.5/2-ç</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Pazarlama ve kişiselleştirme</td>
            <td className="border border-gray-300 px-4 py-2">Açık rıza</td>
            <td className="border border-gray-300 px-4 py-2">m.5/1</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Veri Aktarımı ve Üçüncü Taraflar</h2>
      
      <h3>5.1 Yurtiçi Aktarımlar</h3>
      <ul>
        <li><strong>Hukuk danışmanları:</strong> Hukuki süreçler için</li>
        <li><strong>Muhasebe firması:</strong> Mali yükümlülükler için</li>
        <li><strong>Güvenlik şirketleri:</strong> Siber güvenlik için</li>
        <li><strong>Yetkili kamu kurumları:</strong> Yasal zorunluluklar çerçevesinde</li>
      </ul>

      <h3>5.2 Yurtdışı Aktarımlar</h3>
      <p>
        Verileriniz <strong>Avrupa Birliği/İsveç (eu-north-1)</strong> bölgesinde konumlandırılan 
        Supabase altyapısında işlenmektedir. Bu aktarım GDPR'nin 45. maddesi kapsamında 
        <strong>"yeterlilik kararı"</strong> bulunan ülkeye yapıldığından ek güvence tedbirine ihtiyaç bulunmamaktadır.
      </p>
      
      <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 my-6">
        <p className="text-sm">
          <strong>Özel Kategorili Veri Uyarısı:</strong> Platform üzerinden özel kategorili 
          (hassas) kişisel veri paylaşımı yapmayınız. Bu tür veriler tespit edildiğinde 
          derhal silinecektir.
        </p>
      </div>

      <h2>6. Veri Saklama Süreleri</h2>
      <ul>
        <li><strong>Hesap Verileri:</strong> Hesap kapatılmasından itibaren 6 ay</li>
        <li><strong>İletişim Kayıtları:</strong> 5651 sayılı Kanun gereği 2 yıl</li>
        <li><strong>Finansal Kayıtlar:</strong> Vergi mevzuatı gereği 10 yıl</li>
        <li><strong>Pazarlama Verileri:</strong> Rıza geri çekilene kadar, azami 3 yıl</li>
        <li><strong>Güvenlik Logları:</strong> Olayın ciddiyetine göre 6 ay - 2 yıl</li>
        <li><strong>Çerez Verileri:</strong> Çerez türüne göre oturum sonu - 2 yıl</li>
      </ul>

      <h2>7. Veri Güvenliği Tedbirleri</h2>
      
      <h3>7.1 Teknik Tedbirler</h3>
      <ul>
        <li>SSL/TLS şifreleme (minimum TLS 1.2)</li>
        <li>Şifrelerin hash algoritması ile korunması (bcrypt)</li>
        <li>Veritabanı şifrelemesi (AES-256)</li>
        <li>Güvenlik duvarı ve saldırı tespit sistemleri</li>
        <li>Düzenli güvenlik testleri ve zafiyet taramaları</li>
        <li>Yedekleme ve felaket kurtarma planları</li>
      </ul>

      <h3>7.2 İdari Tedbirler</h3>
      <ul>
        <li>Erişim yetki matrisi ve rol bazlı yetkilendirme</li>
        <li>Personel gizlilik sözleşmeleri</li>
        <li>Veri güvenliği eğitimleri</li>
        <li>Veri ihlali müdahale prosedürleri</li>
        <li>Düzenli güvenlik denetimleri</li>
      </ul>

      <h2>8. Kişisel Veri Sahibinin Hakları (KVKK m.11)</h2>
      
      <p>Kişisel veri sahibi olarak sahip olduğunuz haklar:</p>
      
      <ul>
        <li><strong>Bilgi alma hakkı:</strong> Verilerinizin işlenip işlenmediğini öğrenme</li>
        <li><strong>Erişim hakkı:</strong> İşlenen verileriniz hakkında bilgi talep etme</li>
        <li><strong>Düzeltme hakkı:</strong> Yanlış veya eksik verilerin düzeltilmesini isteme</li>
        <li><strong>Silme hakkı:</strong> Verilerinizin silinmesini talep etme</li>
        <li><strong>İşlemenin durdurulması hakkı:</strong> Belirli durumlarda işlemenin durdurulmasını isteme</li>
        <li><strong>Aktarım hakkı:</strong> Verilerinizin aktarıldığı üçüncü kişilerin bildirilmesini isteme</li>
        <li><strong>İtiraz hakkı:</strong> Otomatik sistemlerle verilen kararlara itiraz etme</li>
        <li><strong>Tazminat hakkı:</strong> Hukuka aykırı işleme nedeniyle zararın tazminini isteme</li>
      </ul>

<h3>8.1 Hak Kullanımı Prosüdürü</h3>
      <p>
        Haklarınızı kullanmak için <strong>bilgi@teknovagroup.com</strong> adresine 
        kimlik belgesi fotokopisi ile birlikte başvurabilirsiniz. Başvurular:
      </p>
      <ul>
        <li>Kimlik doğrulaması yapıldıktan sonra değerlendirilir</li>
        <li>En geç 30 gün içinde sonuçlandırılır</li>
        <li>Gerekçeli ret durumunda sebepleri açıklanır</li>
        <li>Ücretli işlemler için makul ücret alınabilir</li>
      </ul>

      <h2>9. Çerezler ve Takip Teknolojileri</h2>
      <p>
        Detaylı bilgi için <strong>Çerez Politikası</strong> sayfamızı inceleyiniz. 
        Çerez tercihlerinizi Platform üzerindeki yönetim panelinden değiştirebilirsiniz.
      </p>

      <h2>10. Veri İhlali Bildirimi</h2>
      <p>
        Kişisel veri güvenliğini tehlikeye atan bir ihlal durumunda:
      </p>
      <ul>
        <li>KVKK Kuruluna 72 saat içinde bildirim yapılır</li>
        <li>Yüksek riskli ihlallerde veri sahipleri derhal bilgilendirilir</li>
        <li>Alınan tedbirler şeffaf şekilde paylaşılır</li>
      </ul>

      <h2>11. Küçüklerin Korunması</h2>
      <p>
        Bu Platform 18 yaş altı kişilerin kullanımına uygun değildir. 18 yaş altı bir kişiden 
        veri topladığımızı öğrenirsek derhal sileriz ve yasal temsilcisini bilgilendiririz.
      </p>

      <h2>12. Uluslararası Veri Aktarımı Güvenceleri</h2>
      <p>
        AB dışına veri aktarımında aşağıdaki güvenceler sağlanır:
      </p>
      <ul>
        <li>Standart Sözleşme Hükümleri (SCC)</li>
        <li>Bağlayıcı kurumsal kurallar</li>
        <li>Yeterlilik kararları</li>
        <li>Sertifikasyon programları</li>
      </ul>

      <h2>13. Politika Değişiklikleri</h2>
      <p>
        Bu politika gerektiğinde güncellenebilir. Önemli değişiklikler:
      </p>
      <ul>
        <li>Platform üzerinden duyurulur</li>
        <li>E-posta ile bildirilir</li>
        <li>Gerekli durumlarda yeniden rıza alınır</li>
        <li>Değişiklik tarihi ve versiyonu belirtilir</li>
      </ul>

      <h2>14. İletişim ve Şikayet</h2>
      <div className="bg-purple-50/50 p-4 rounded-lg">
        <p><strong>Veri Koruma Sorumlusu:</strong></p>
        <ul className="mt-2">
          <li><strong>E-posta:</strong> bilgi@teknovagroup.com</li>
          <li><strong>Telefon:</strong> 0543 509 84 85</li>
          <li><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</li>
          <li><strong>Website:</strong> takaszone.com</li>
        </ul>
        
        <p className="mt-4"><strong>Yetkili Kurumlar:</strong></p>
        <ul className="mt-2">
          <li><strong>KVKK Kurulu:</strong> kvkk.gov.tr</li>
          <li><strong>BTK:</strong> btk.gov.tr</li>
          <li><strong>Kişisel Verileri Koruma Kurulu Başvuru Formu:</strong> 
              <a href="https://kvkk.gov.tr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                kvkk.gov.tr
              </a>
          </li>
        </ul>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg mt-8 border border-purple-200">
        <p className="text-sm">
          <strong>Yürürlük Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Versiyon:</strong> 2.0<br/>
          <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Sonraki İnceleme Tarihi:</strong> {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('tr-TR')}<br/>
          <strong>Doküman Sahibi:</strong> Veri Koruma Sorumlusu<br/>
          <strong>Onaylayan:</strong> Genel Müdür
        </p>
      </div>
    </div>
  )
}


