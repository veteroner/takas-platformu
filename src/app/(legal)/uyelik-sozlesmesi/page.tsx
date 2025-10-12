'use client'

export default function TermsPage() {
  return (
    <div className="prose prose-gray max-w-3xl mx-auto px-4 py-10">
      <h1>Üyelik Sözleşmesi ve Kullanım Şartları</h1>
      
      <p className="text-sm text-gray-600">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400 my-6">
        <p className="text-sm font-medium">
          <strong>Önemli Uyarı:</strong> Bu sözleşme hukuken bağlayıcıdır. 
          Platformu kullanmadan önce dikkatle okuyunuz ve kabul ettiğinizden emin olunuz.
        </p>
      </div>

      <h2>1. Tanımlar ve Kapsam</h2>
      
      <h3>1.1 Taraflar</h3>
      <ul>
        <li><strong>Platform:</strong> Teknova Group tarafından işletilen takas platformu</li>
        <li><strong>Şirket:</strong> Teknova Group ve/veya hukuki halefler</li>
        <li><strong>Kullanıcı:</strong> Platforma kayıt olan ve hizmetleri kullanan gerçek/tüzel kişiler</li>
        <li><strong>Üye:</strong> Kayıt işlemini tamamlamış ve hesap sahibi olan kullanıcılar</li>
        <li><strong>Hizmet:</strong> Platform üzerinden sunulan tüm özellik ve işlevler</li>
      </ul>

      <h3>1.2 Sözleşmenin Kapsamı</h3>
      <p>
        Bu sözleşme, <strong>6098 sayılı Türk Borçlar Kanunu</strong> ve <strong>6563 sayılı 
        Elektronik Ticaretin Düzenlenmesi Hakkında Kanun</strong> hükümleri uyarınca hazırlanmıştır. 
        Platform kullanımı bu şartların kabulü anlamına gelir.
      </p>

      <h2>2. Üyelik ve Hesap Yönetimi</h2>
      
      <h3>2.1 Üyelik Şartları</h3>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800">Genel Şartlar</h4>
        <ul className="text-sm mt-2">
          <li>• Minimum 18 yaş veya veli izni (13-18 yaş arası)</li>
          <li>• Türkiye Cumhuriyeti vatandaşı veya ikamet izinli</li>
          <li>• Doğru ve eksiksiz bilgi verme yükümlülüğü</li>
          <li>• Tek kişi başına tek hesap kuralı</li>
          <li>• Geçerli e-posta adresi ve telefon numarası</li>
          <li>• Kimlik doğrulama belgeleri (gerektiğinde)</li>
        </ul>
      </div>

      <h3>2.2 Yasak Durumlar</h3>
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-sm"><strong>Aşağıdaki durumda olan kişiler üye olamaz:</strong></p>
        <ul className="text-sm mt-2">
          <li>• Daha önce hesabı kapatılmış kullanıcılar</li>
          <li>• Yasal takibat altında olan kişiler (platformla ilgili)</li>
          <li>• Sahte bilgi ile daha önce kayıt oluşturanlar</li>
          <li>• Rekabet yasağı bulunan ticari kuruluşlar</li>
          <li>• Kara para aklama/terör finansmanı şüphesi bulunanlar</li>
        </ul>
      </div>

      <h3>2.3 Hesap Güvenliği ve Sorumluluklar</h3>
      <ul>
        <li><strong>Şifre Güvenliği:</strong> Güçlü şifre kullanma ve gizli tutma sorumluluğu</li>
        <li><strong>Hesap Paylaşımı:</strong> Kesinlikle yasaktır, tüm sorumluluk üyeye aittir</li>
        <li><strong>Şüpheli Aktivite:</strong> Derhal bildirme yükümlülüğü</li>
        <li><strong>Güncel Bilgiler:</strong> İletişim bilgilerini güncel tutma sorumluluğu</li>
        <li><strong>Yasal Sorumluluk:</strong> Hesap üzerinden gerçekleşen tüm işlemlerden sorumlu</li>
      </ul>

      <h2>3. Platform Kullanım Kuralları</h2>
      
      <h3>3.1 İzin Verilen Kullanımlar</h3>
      <div className="bg-green-50 p-4 rounded-lg">
        <ul className="text-sm">
          <li>✅ Kişisel eşyaların takası</li>
          <li>✅ Yasal ürün ve hizmet paylaşımı</li>
          <li>✅ Temiz ve dürüst iletişim</li>
          <li>✅ Platform kurallarına uygun davranış</li>
          <li>✅ Diğer kullanıcılara saygılı yaklaşım</li>
          <li>✅ Gerçek ve doğru ürün tanıtımları</li>
        </ul>
      </div>

      <h3>3.2 Kesinlikle Yasak Davranışlar</h3>
      <div className="bg-red-50 p-4 rounded-lg">
        <ul className="text-sm">
          <li>❌ Sahte, çalıntı veya kaçak ürün paylaşımı</li>
          <li>❌ Uyuşturucu, silah, patlayıcı madde takası</li>
          <li>❌ Müstehcen, pornografik içerik</li>
          <li>❌ Nefret söylemi, ayrımcılık, hakaret</li>
          <li>❌ Dolandırıcılık, aldatma, sahte kimlik</li>
          <li>❌ Spam, reklam, promosyon içeriği</li>
          <li>❌ Sistemi hackleme, virüs gönderme</li>
          <li>❌ Başkasının hesabını ele geçirme</li>
          <li>❌ Telif hakkı ihlali, marka taklidciliği</li>
          <li>❌ Kişisel veri çalma, gizlilik ihlali</li>
        </ul>
      </div>

      <h2>4. Yasak Ürün ve Hizmetler</h2>
      
      <table className="min-w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-3 py-2">Kategori</th>
            <th className="border border-gray-300 px-3 py-2">Yasak Ürünler</th>
            <th className="border border-gray-300 px-3 py-2">Yasal Dayanak</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Tehlikeli Maddeler</td>
            <td className="border border-gray-300 px-3 py-2">Silah, mühimmat, patlayıcı, kimyasal</td>
            <td className="border border-gray-300 px-3 py-2">Silah Kanunu, TMK</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Uyuşturucu</td>
            <td className="border border-gray-300 px-3 py-2">Uyuşturucu, sentetik uyarıcı, esrar</td>
            <td className="border border-gray-300 px-3 py-2">Uyuşturucu ile Mücadele Kanunu</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Kültür Varlıkları</td>
            <td className="border border-gray-300 px-3 py-2">Antika, arkeolojik eser, tarihi obje</td>
            <td className="border border-gray-300 px-3 py-2">Kültür ve Tabiat Varlıkları Kanunu</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Hayvan Ürünleri</td>
            <td className="border border-gray-300 px-3 py-2">Canlı hayvan, nesli tükenmiş türler</td>
            <td className="border border-gray-300 px-3 py-2">Hayvanları Koruma Kanunu, CITES</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Tıbbi Ürünler</td>
            <td className="border border-gray-300 px-3 py-2">Reçeteli ilaç, tıbbi cihaz, protez</td>
            <td className="border border-gray-300 px-3 py-2">İlaç ve Tıbbi Cihaz Kanunu</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Telif Hakları</td>
            <td className="border border-gray-300 px-3 py-2">Korsan film/müzik, sahte marka</td>
            <td className="border border-gray-300 px-3 py-2">Fikri Mülkiyet Kanunu</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-3 py-2">Finansal</td>
            <td className="border border-gray-300 px-3 py-2">Para, kredi kartı, casino jetonları</td>
            <td className="border border-gray-300 px-3 py-2">Bankacılık Kanunu, TCK</td>
          </tr>
        </tbody>
      </table>

      <h2>5. İşlem Güvenliği ve Sorumluluklar</h2>
      
      <h3>5.1 Platform Sorumluluğu</h3>
      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800">Platform Sağladıkları</h4>
        <ul className="text-sm mt-2">
          <li>• Güvenli altyapı ve şifreleme sistemi</li>
          <li>• Kullanıcı doğrulama araçları</li>
          <li>• Şikayet ve anlaşmazlık çözüm kanalları</li>
          <li>• Güvenlik ihlali durumunda bilgilendirme</li>
          <li>• Yasal yükümlülüklere uygun veri koruma</li>
        </ul>
      </div>

      <h3>5.2 Platform Sorumluluk Sınırları</h3>
      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
        <h4 className="font-semibold text-red-800">Platform Sorumlu Değildir</h4>
        <ul className="text-sm mt-2">
          <li>• Kullanıcılar arası anlaşmazlıklardan</li>
          <li>• Ürün kalitesi, orijinallik, işlevsellikten</li>
          <li>• Teslimat sorunları ve gecikmelerden</li>
          <li>• Kullanıcıların verdiği yanlış bilgilerden</li>
          <li>• Üçüncü taraf sebepli sistem kesintilerinden</li>
          <li>• Doğal afet, savaş gibi mücbir sebeplerden</li>
          <li>• Kullanıcıların hukuka aykırı davranışlarından</li>
        </ul>
      </div>

      <h3>5.3 Kullanıcı Sorumlulukları</h3>
      <ul>
        <li><strong>Ürün Tanıtımı:</strong> Doğru, eksiksiz ve dürüst bilgi verme</li>
        <li><strong>Yasal Uyum:</strong> Tüm yasalara uygun davranma sorumluluğu</li>
        <li><strong>İletişim:</strong> Nazik ve saygılı iletişim kurma</li>
        <li><strong>Teslimat:</strong> Anlaşma şartlarına uygun teslimat</li>
        <li><strong>Gizlilik:</strong> Diğer kullanıcıların kişisel verilerini koruma</li>
        <li><strong>Güvenlik:</strong> Hesap güvenliğini sağlama ve koruma</li>
      </ul>

      <h2>6. Fikri Mülkiyet Hakları</h2>
      
      <h3>6.1 Platform Hakları</h3>
      <ul>
        <li>Platform tasarımı, kodları, algoritmaları Teknova Group'a aittir</li>
        <li>Marka, logo, slogan hakları tamamen korunmaktadır</li>
        <li>Kullanıcı arayüzü ve deneyim tasarımları tescilli/korumalıdır</li>
        <li>Veritabanı yapısı ve içeriği fikri mülkiyet kapsamındadır</li>
      </ul>

      <h3>6.2 Kullanıcı İçerikleri</h3>
      <ul>
        <li><strong>Kullanıcı Hakları:</strong> Yüklenen içeriklerin orijinal hakları kullanıcıya aittir</li>
        <li><strong>Platform Lisansı:</strong> Platform, içerikleri kullanma/görüntüleme hakkına sahiptir</li>
        <li><strong>Paylaşım İzni:</strong> İçerikler platformda paylaşım amacıyla lisanslanır</li>
        <li><strong>Kaldırma Hakkı:</strong> İhlal durumunda platform içeriği kaldırabilir</li>
      </ul>

      <h2>7. Hesap Askıya Alma ve Kapatma</h2>
      
      <h3>7.1 Askıya Alma Sebepleri</h3>
      <div className="bg-orange-50 p-4 rounded-lg">
        <ul className="text-sm">
          <li>• Tekrarlayan kural ihlalleri</li>
          <li>• Şüpheli veya sahte hesap aktivitesi</li>
          <li>• Diğer kullanıcılardan çoklu şikayet</li>
          <li>• Güvenlik ihlali şüphesi</li>
          <li>• Yasal soruşturma süreci</li>
          <li>• Ödeme/dolandırıcılık şüphesi</li>
        </ul>
      </div>

      <h3>7.2 Kalıcı Kapatma Sebepleri</h3>
      <div className="bg-red-50 p-4 rounded-lg">
        <ul className="text-sm">
          <li>• Yasak ürün satışı/paylaşımı</li>
          <li>• Dolandırıcılık, sahte kimlik kullanımı</li>
          <li>• Ciddi güvenlik ihlalleri</li>
          <li>• Tekrarlanan ciddi kural ihlalleri</li>
          <li>• Yasal yükümlülük gereği hesap kapatma</li>
          <li>• Platform imajına zarar verici davranışlar</li>
        </ul>
      </div>

      <h3>7.3 İtiraz ve Geri Açma Süreci</h3>
      <ul>
        <li><strong>İtiraz Süresi:</strong> Kapatma kararından 15 gün içinde</li>
        <li><strong>İtiraz Adresi:</strong> itiraz@teknovagroup.com</li>
        <li><strong>Gerekli Belgeler:</strong> Kimlik, delil belgeleri</li>
        <li><strong>Değerlendirme Süresi:</strong> 30 iş günü</li>
        <li><strong>Karar Sonucu:</strong> E-posta ile bildirilir</li>
      </ul>

      <h2>8. Veri Koruma ve Gizlilik</h2>
      
      <h3>8.1 Kişisel Veri İşleme</h3>
      <p>
        <strong>6698 sayılı KVKK</strong> ve <strong>GDPR</strong> uyarınca kişisel verileriniz:
      </p>
      <ul>
        <li>Hizmet sunumu için gerekli olan sürece işlenir</li>
        <li>Yasal yükümlülükler gereği saklanır</li>
        <li>Güvenlik tedbirleri ile korunur</li>
        <li>İzniniz olmadan üçüncü taraflarla paylaşılmaz</li>
        <li>Talep halinde silinir veya düzeltilir</li>
      </ul>

      <h3>8.2 Çerez ve Takip Teknolojileri</h3>
      <ul>
        <li><strong>Zorunlu Çerezler:</strong> Platform işlevselliği için gerekli</li>
        <li><strong>Analitik Çerezler:</strong> Açık rıza ile kullanılır</li>
        <li><strong>Pazarlama Çerezleri:</strong> İsteğe bağlı, yönetilebilir</li>
        <li><strong>Üçüncü Taraf:</strong> Entegre servisler için sınırlı kullanım</li>
      </ul>

      <h2>9. Ödeme ve Finansal İşlemler</h2>
      
      <h3>9.1 Platform Ücretsizdir</h3>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm">
          Temel takas hizmetleri tamamen ücretsizdir. Gelecekte eklenen premium 
          özellikler için önceden bilgilendirme yapılacaktır.
        </p>
      </div>

      <h3>9.2 Gelecekteki Ücretli Hizmetler</h3>
      <ul>
        <li><strong>Premium Üyelik:</strong> Gelişmiş özellikler ve öncelik</li>
        <li><strong>Reklam Hizmetleri:</strong> Ürün tanıtımı ve görünürlük</li>
        <li><strong>Doğrulama Hizmetleri:</strong> Hızlı kimlik/ürün doğrulama</li>
        <li><strong>Lojistik Destek:</strong> Kargo ve teslimat koordinasyonu</li>
      </ul>

      <h3>9.3 İade ve İptal Politikası</h3>
      <p>
        Ücretli hizmetler için 14 günlük cayma hakkı mevcuttur 
        (6502 sayılı Tüketicinin Korunması Hakkında Kanun).
      </p>

      <h2>10. Yasal Uyuşmazlıklar ve Çözüm Yolları</h2>
      
      <h3>10.1 Öncelikli Çözüm Yolları</h3>
      <ol>
        <li><strong>Doğrudan İletişim:</strong> Kullanıcılar arası müzakere</li>
        <li><strong>Platform Arabuluculuğu:</strong> Çözüm ekibi desteği</li>
        <li><strong>Online Uyuşmazlık Çözümü:</strong> Dijital arabuluculuk</li>
        <li><strong>Tüketici Hakem Heyeti:</strong> Tüketici anlaşmazlıkları için</li>
      </ol>

      <h3>10.2 Yargı Yetkisi</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ul>
          <li><strong>Yetkili Mahkeme:</strong> İstanbul Mahkemeleri ve İcra Daireleri</li>
          <li><strong>Uygulanacak Hukuk:</strong> Türkiye Cumhuriyeti Kanunları</li>
          <li><strong>Dil:</strong> Türkçe (resmi dil)</li>
          <li><strong>Tebligat Adresi:</strong> Platform üzerinden kayıtlı adres</li>
        </ul>
      </div>

      <h2>11. Sözleşme Değişiklikleri</h2>
      
      <h3>11.1 Değişiklik Süreci</h3>
      <ul>
        <li><strong>Bildirim:</strong> 30 gün önceden e-posta ile duyuru</li>
        <li><strong>Platform Duyurusu:</strong> Ana sayfada görünür uyarı</li>
        <li><strong>Yürürlük:</strong> Belirtilen tarihten itibaren geçerli</li>
        <li><strong>Kabul:</strong> Platform kullanımı devam etme = kabul</li>
        <li><strong>Red:</strong> Hesap kapatma hakkı</li>
      </ul>

      <h3>11.2 Otomatik Güncelleme Durumları</h3>
      <ul>
        <li>Yasal değişiklik gerektiren düzenlemeler</li>
        <li>Güvenlik güncellemeleri</li>
        <li>Teknik altyapı değişiklikleri</li>
        <li>Yeni özellik ekleme</li>
      </ul>

      <h2>12. İletişim ve Destek</h2>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3>Teknova Group İletişim Bilgileri</h3>
        <ul className="mt-2">
          <li><strong>Genel Destek:</strong> destek@teknovagroup.com</li>
          <li><strong>Hukuki İşler:</strong> hukuk@teknovagroup.com</li>
          <li><strong>KVKK Sorumlusu:</strong> kvkk@teknovagroup.com</li>
          <li><strong>İtiraz ve Şikayet:</strong> itiraz@teknovagroup.com</li>
          <li><strong>Telefon:</strong> [Telefon numarası eklenecek]</li>
          <li><strong>Posta Adresi:</strong> [Fiziksel adres eklenecek]</li>
          <li><strong>Çalışma Saatleri:</strong> 09:00-18:00 (Pazartesi-Cuma)</li>
          <li><strong>Acil Destek:</strong> 7/24 online sistem üzerinden</li>
        </ul>
      </div>

      <h2>13. Son Hükümler</h2>
      
      <h3>13.1 Sözleşmenin Geçerliliği</h3>
      <ul>
        <li>Bu sözleşme elektronik ortamda kabul edilmiş sayılır</li>
        <li>Baskı halinde sağlanacak nüsha geçerlidir</li>
        <li>Herhangi bir maddenin geçersizliği diğerlerini etkilemez</li>
        <li>Türkçe metin her durumda esas alınır</li>
      </ul>

      <h3>13.2 Mücbir Sebepler</h3>
      <p>
        Doğal afet, savaş, salgın, internet kesintisi, siber saldırı gibi 
        kontrolümüz dışındaki durumlar nedeniyle oluşan gecikmeler veya 
        hizmet kesintilerinden platform sorumlu değildir.
      </p>

      <div className="bg-green-50 p-6 rounded-lg mt-8 border border-green-200">
        <h3>Sözleşme Onay Formu</h3>
        <div className="mt-4 space-y-3">
          <label className="flex items-start">
            <input type="checkbox" className="mr-3 mt-1" required />
            <span className="text-sm">
              <strong>Yaş Onayı:</strong> 18 yaşından büyük olduğumu veya yasal veli iznime 
              sahip olduğumu beyan ederim.
            </span>
          </label>
          
          <label className="flex items-start">
            <input type="checkbox" className="mr-3 mt-1" required />
            <span className="text-sm">
              <strong>Sözleşme Kabulü:</strong> Bu Üyelik Sözleşmesi'ni tamamen okuduğumu, 
              anladığımı ve kabul ettiğimi beyan ederim.
            </span>
          </label>
          
          <label className="flex items-start">
            <input type="checkbox" className="mr-3 mt-1" required />
            <span className="text-sm">
              <strong>Yasal Sorumluluk:</strong> Platform kullanımımda tüm yasal kurallara 
              uyacağımı ve sorumluluğunu kabul ettiğimi taahhüt ederim.
            </span>
          </label>
          
          <label className="flex items-start">
            <input type="checkbox" className="mr-3 mt-1" required />
            <span className="text-sm">
              <strong>Gizlilik Politikası:</strong> Gizlilik Politikası ve KVKK Aydınlatma 
              Metni'ni okuduğumu ve kabul ettiğimi beyan ederim.
            </span>
          </label>
        </div>
        
        <button className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors">
          Sözleşmeyi Kabul Ediyorum ve Üyeliğimi Tamamlıyorum
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <p className="text-sm">
          <strong>Sözleşme Bilgileri:</strong><br/>
          <strong>Hazırlık Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Yürürlük Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Versiyon:</strong> 2.0<br/>
          <strong>Son Güncelleme:</strong> {new Date().toLocaleDateString('tr-TR')}<br/>
          <strong>Hukuki Dayanak:</strong> TBK, ETK, KVKK, TKHK<br/>
          <strong>Hazırlayan:</strong> Hukuk İşleri Departmanı<br/>
          <strong>Onaylayan:</strong> Genel Müdür<br/>
          <strong>Denetim:</strong> Bağımsız hukuk firması
        </p>
      </div>
    </div>
  )
}