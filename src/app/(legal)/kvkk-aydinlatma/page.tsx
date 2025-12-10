'use client'

export default function KvkkPage() {
  return (
    <div className="prose prose-gray max-w-3xl mx-auto px-4 py-10">
      <h1>KVKK Aydınlatma Metni</h1>
      
      <p className="text-sm text-gray-600">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 my-6">
        <p className="text-sm font-medium">
          <strong>KVKK Aydınlatma Yükümlülüğü:</strong> Bu metin, 6698 sayılı Kişisel Verilerin 
          Korunması Kanunu'nun 10. maddesi uyarınca hazırlanmıştır.
        </p>
      </div>

      <h2>1. Veri Sorumlusu Kimliği</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
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
      </div>

      <h2>2. İşlenen Kişisel Veriler ve Kategorileri</h2>
      
      <h3>2.1 Kimlik Verileri</h3>
      <ul>
        <li>Ad, soyad</li>
        <li>Doğum tarihi (yaş doğrulaması)</li>
        <li>Kimlik numarası (gerekli durumlarda)</li>
        <li>Profil fotoğrafı</li>
      </ul>

      <h3>2.2 İletişim Verileri</h3>
      <ul>
        <li>E-posta adresi</li>
        <li>Telefon numarası</li>
        <li>Açık adres bilgisi (opsiyonel)</li>
        <li>Konum bilgisi (yaklaşık - rıza ile)</li>
      </ul>

      <h3>2.3 Hesap ve Güvenlik Verileri</h3>
      <ul>
        <li>Kullanıcı adı</li>
        <li>Şifre (hashlenerek saklanır)</li>
        <li>IP adresi ve oturum bilgileri</li>
        <li>Cihaz kimliği ve tarayıcı bilgileri</li>
        <li>Güvenlik logları</li>
      </ul>

      <h3>2.4 İşlem ve İçerik Verileri</h3>
      <ul>
        <li>İlan içerikleri ve fotoğraflar</li>
        <li>Mesaj içerikleri</li>
        <li>Platform kullanım geçmişi</li>
        <li>Etkileşim verileri (beğeni, görüntüleme)</li>
        <li>Tercih ve ilgi alanları</li>
      </ul>

      <h3>2.5 Özel Kategorili Veriler</h3>
      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
        <p className="text-sm">
          <strong>Uyarı:</strong> Platform üzerinden özel kategorili (hassas) kişisel veri 
          paylaşımı yapmayınız. Bu tür veriler tespit edildiğinde derhal silinecektir.
        </p>
      </div>

      <h2>3. Veri İşleme Amaçları</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Amaç</th>
            <th className="border border-gray-300 px-4 py-2">Veri Kategorisi</th>
            <th className="border border-gray-300 px-4 py-2">Saklama Süresi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Hesap oluşturma ve yönetimi</td>
            <td className="border border-gray-300 px-4 py-2">Kimlik, İletişim, Hesap</td>
            <td className="border border-gray-300 px-4 py-2">Hesap kapatma + 6 ay</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Hizmet sunumu</td>
            <td className="border border-gray-300 px-4 py-2">Tüm veriler</td>
            <td className="border border-gray-300 px-4 py-2">Aktif kullanım süresi</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Güvenlik ve dolandırıcılık önleme</td>
            <td className="border border-gray-300 px-4 py-2">Güvenlik, IP, Cihaz</td>
            <td className="border border-gray-300 px-4 py-2">6 ay - 2 yıl</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">5651 sayılı Kanun gereği</td>
            <td className="border border-gray-300 px-4 py-2">İletişim logları</td>
            <td className="border border-gray-300 px-4 py-2">2 yıl</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Pazarlama (rıza ile)</td>
            <td className="border border-gray-300 px-4 py-2">İletişim, Tercihler</td>
            <td className="border border-gray-300 px-4 py-2">Rıza geri çekilene kadar</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Hukuki Sebepler (KVKK m.5)</h2>
      
      <h3>4.1 Açık Rıza Gerektiren İşlemler (m.5/1)</h3>
      <ul>
        <li>Pazarlama iletileri gönderimi</li>
        <li>Kişiselleştirilmiş öneriler</li>
        <li>Konum tabanlı hizmetler</li>
        <li>Analitik ve reklam çerezleri</li>
        <li>Sosyal medya entegrasyonları</li>
      </ul>

      <h3>4.2 Sözleşmenin İfası (m.5/2-c)</h3>
      <ul>
        <li>Hesap oluşturma ve yönetimi</li>
        <li>Takas platformu hizmetleri</li>
        <li>Mesajlaşma ve iletişim</li>
        <li>İlan yayınlama ve yönetimi</li>
      </ul>

      <h3>4.3 Hukuki Yükümlülük (m.5/2-ç)</h3>
      <ul>
        <li>5651 sayılı Kanun gereği log tutma</li>
        <li>Vergi mevzuatı gereklilikleri</li>
        <li>Tüketici mevzuatı yükümlülükleri</li>
        <li>Kişisel verilerin korunması mevzuatı</li>
      </ul>

      <h3>4.4 Meşru Menfaat (m.5/2-f)</h3>
      <ul>
        <li>Platform güvenliği ve istikrarı</li>
        <li>Dolandırıcılık önleme</li>
        <li>Hizmet iyileştirme ve geliştirme</li>
        <li>Teknik destek ve bakım</li>
      </ul>

      <h2>5. Veri Aktarımı ve Paylaşımı</h2>
      
      <h3>5.1 Yurtiçi Aktarımlar</h3>
      <ul>
        <li><strong>Hukuk Danışmanları:</strong> Hukuki süreçler için gerekli veriler</li>
        <li><strong>Muhasebe Firması:</strong> Mali kayıtlar ve faturalama</li>
        <li><strong>BT Destek Şirketi:</strong> Teknik bakım ve destek için</li>
        <li><strong>Güvenlik Şirketi:</strong> Siber güvenlik ve izleme</li>
        <li><strong>Kargo Şirketleri:</strong> Teslimat süreçleri için</li>
        <li><strong>Yetkili Kamu Kurumları:</strong> Yasal zorunluluk halinde</li>
      </ul>

      <h3>5.2 Yurtdışı Aktarımlar</h3>
      <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 my-4">
        <p className="text-sm">
          <strong>Güvenli Transfer:</strong> Verileriniz yalnızca AB/İsveç (eu-north-1) bölgesinde 
          bulunan Supabase altyapısında işlenmektedir. Bu aktarım GDPR'nin 45. maddesi 
          kapsamında "yeterlilik kararı" olan ülkeye yapıldığından ek güvence gerektirmez.
        </p>
      </div>

      <h2>6. Veri Saklama Süreleri ve İmha</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Veri Türü</th>
            <th className="border border-gray-300 px-4 py-2">Saklama Süresi</th>
            <th className="border border-gray-300 px-4 py-2">İmha Yöntemi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Hesap Verileri</td>
            <td className="border border-gray-300 px-4 py-2">Hesap kapatma + 6 ay</td>
            <td className="border border-gray-300 px-4 py-2">Güvenli silme</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">İletişim Logları</td>
            <td className="border border-gray-300 px-4 py-2">2 yıl (5651 sayılı Kanun)</td>
            <td className="border border-gray-300 px-4 py-2">Otomatik silme</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Mali Kayıtlar</td>
            <td className="border border-gray-300 px-4 py-2">10 yıl (Vergi mevzuatı)</td>
            <td className="border border-gray-300 px-4 py-2">Anonimleştirme</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Pazarlama Verileri</td>
            <td className="border border-gray-300 px-4 py-2">Rıza geri çekilene kadar</td>
            <td className="border border-gray-300 px-4 py-2">Derhal silme</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Güvenlik Logları</td>
            <td className="border border-gray-300 px-4 py-2">6 ay - 2 yıl</td>
            <td className="border border-gray-300 px-4 py-2">Otomatik silme</td>
          </tr>
        </tbody>
      </table>

      <h2>7. Kişisel Veri Sahibinin Hakları (KVKK m.11)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800">Temel Haklar</h4>
          <ul className="text-sm mt-2">
            <li>• Bilgi alma hakkı</li>
            <li>• Erişim hakkı</li>
            <li>• Düzeltme hakkı</li>
            <li>• Silme hakkı</li>
          </ul>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">İleri Haklar</h4>
          <ul className="text-sm mt-2">
            <li>• İşlemenin durdurulması</li>
            <li>• Aktarım bilgisi alma</li>
            <li>• İtiraz etme hakkı</li>
            <li>• Tazminat talep etme</li>
          </ul>
        </div>
      </div>

      <h3>7.1 Hak Kullanım Süreci</h3>
      <ol>
        <li><strong>Başvuru:</strong> bilgi@teknovagroup.com adresine kimlik belgesi ile</li>
        <li><strong>Kimlik Doğrulama:</strong> 3 iş günü içinde</li>
        <li><strong>Değerlendirme:</strong> En geç 30 gün içinde yanıt</li>
        <li><strong>Sonuç Bildirimi:</strong> E-posta veya yazılı olarak</li>
        <li><strong>İtiraz:</strong> KVKK Kuruluna başvuru hakkı</li>
      </ol>

      <h2>8. Güvenlik Tedbirleri</h2>
      
      <h3>8.1 Teknik Güvenlik Tedbirleri</h3>
      <ul>
        <li><strong>Şifreleme:</strong> SSL/TLS (min. TLS 1.2), AES-256 veritabanı şifreleme</li>
        <li><strong>Erişim Kontrolü:</strong> Rol bazlı yetkilendirme sistemi</li>
        <li><strong>Ağ Güvenliği:</strong> Güvenlik duvarı, DDoS koruması</li>
        <li><strong>İzleme:</strong> 7/24 güvenlik izleme ve log analizi</li>
        <li><strong>Yedekleme:</strong> Otomatik yedekleme ve felaket kurtarma</li>
        <li><strong>Test:</strong> Düzenli penetrasyon testleri ve zafiyet taraması</li>
      </ul>

      <h3>8.2 İdari Güvenlik Tedbirleri</h3>
      <ul>
        <li><strong>Personel Eğitimi:</strong> Düzenli KVKK ve güvenlik eğitimleri</li>
        <li><strong>Gizlilik Sözleşmeleri:</strong> Tüm çalışanlar için zorunlu</li>
        <li><strong>Erişim Yönetimi:</strong> En az yetki prensibi</li>
        <li><strong>Denetim:</strong> Düzenli iç denetim ve risk değerlendirmesi</li>
        <li><strong>Olay Müdahale:</strong> Veri ihlali müdahale planı</li>
      </ul>

      <h2>9. Çerezler ve Takip Teknolojileri</h2>
      
      <p>Detaylı bilgi için lütfen <strong>Çerez Politikası</strong> sayfamızı inceleyiniz.</p>
      
      <h3>9.1 Çerez Türleri</h3>
      <ul>
        <li><strong>Zorunlu Çerezler:</strong> Platform işlevselliği için gerekli</li>
        <li><strong>Performans Çerezleri:</strong> Analitik ve iyileştirme</li>
        <li><strong>İşlevsel Çerezler:</strong> Kişiselleştirme ve tercihler</li>
        <li><strong>Pazarlama Çerezleri:</strong> Reklam ve hedefleme (rıza ile)</li>
      </ul>

      <h2>10. Veri İhlali Bildirim Süreci</h2>
      
      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 my-6">
        <h4 className="font-semibold text-red-800">Veri İhlali Durumunda:</h4>
        <ul className="text-sm mt-2">
          <li>• KVKK Kuruluna 72 saat içinde bildirim</li>
          <li>• Yüksek riskli ihlallerde veri sahiplerine bildirim</li>
          <li>• Alınan tedbirlerin şeffaf paylaşımı</li>
          <li>• İhlal nedenlerinin ve önleyici tedbirlerin açıklanması</li>
        </ul>
      </div>

      <h2>11. Otomatik Karar Verme ve Profilleme</h2>
      
      <p>Platform'da kullanılan otomatik karar verme sistemleri:</p>
      <ul>
        <li><strong>Eşleştirme Algoritması:</strong> Takas önerileri için</li>
        <li><strong>Güvenlik Algoritması:</strong> Dolandırıcılık tespiti</li>
        <li><strong>Öneri Sistemi:</strong> İçerik ve kullanıcı önerileri</li>
        <li><strong>Risk Değerlendirme:</strong> Hesap güvenlik skoru</li>
      </ul>
      
      <p className="text-sm text-gray-600 mt-4">
        Bu sistemlere itiraz etme hakkınız bulunmaktadır. İtiraz için bilgi@teknovagroup.com 
        adresine başvurabilirsiniz.
      </p>

      <h2>12. İletişim ve Şikayet</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3>Veri Koruma Sorumlusu</h3>
        <ul className="mt-2">
          <li><strong>Veri Sorumlusu:</strong> İsa Bozkurt</li>
          <li><strong>E-posta:</strong> bilgi@teknovagroup.com</li>
          <li><strong>Telefon:</strong> 0543 509 84 85</li>
          <li><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</li>
          <li><strong>Çalışma Saatleri:</strong> 09:00-17:00 (Pazartesi-Cuma)</li>
        </ul>
        
        <h3 className="mt-4">Başvuru Kanalları</h3>
        <ul className="mt-2">
          <li><strong>Online Destek:</strong> takaszone.com/destek</li>
          <li><strong>KVKK Başvuru Sistemi:</strong> kvkk.gov.tr</li>
          <li><strong>Posta:</strong> Yukarıdaki adrese iadeli taahhütlü</li>
          <li><strong>Elden Teslim:</strong> Yukarıdaki adreste alındı belgesi ile</li>
        </ul>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg mt-8 border border-blue-200">
        <p className="text-sm">
          <strong>Aydınlatma Metni Bilgileri:</strong><br/>
          <strong>Hazırlık Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Yürürlük Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Versiyon:</strong> 2.0<br/>
          <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Sonraki İnceleme:</strong> {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('tr-TR')}<br/>
          <strong>Hazırlayan:</strong> Veri Koruma Sorumlusu<br/>
          <strong>Onaylayan:</strong> Genel Müdür<br/>
          <strong>Hukuki Dayanak:</strong> KVKK m.10, GDPR m.13-14
        </p>
        
        <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
          <p className="text-sm font-medium text-blue-800">
            Bu aydınlatma metni KVKK'nın 10. maddesi uyarınca veri sahiplerini bilgilendirmek 
            amacıyla hazırlanmıştır. Sorularınız için yukarıdaki iletişim kanallarını kullanabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}


