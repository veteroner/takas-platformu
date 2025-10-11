'use client'

export default function CookiesPage() {
  return (
    <>
      <h1>Çerez (Cookie) Politikası</h1>
      
      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, web sitelerinin kullanıcının cihazında sakladığı küçük metin 
        dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını ve 
        kullanıcı deneyiminin iyileştirilmesini sağlar.
      </p>

      <h2>2. Çerez Türleri</h2>
      
      <h3>2.1 Zorunlu Çerezler</h3>
      <p>
        Platform için gerekli temel işlevleri sağlar. Bu çerezler olmadan 
        platform düzgün çalışmaz.
      </p>
      <ul>
        <li>Oturum yönetimi</li>
        <li>Güvenlik</li>
        <li>Temel platform işlevleri</li>
      </ul>

      <h3>2.2 Performans Çerezleri</h3>
      <p>
        Platform performansını ve kullanımını analiz etmek için kullanılır.
      </p>
      <ul>
        <li>Sayfa görüntüleme istatistikleri</li>
        <li>Kullanıcı etkileşim verileri</li>
        <li>Hata raporlama</li>
      </ul>

      <h3>2.3 İşlevsel Çerezler</h3>
      <p>
        Kişiselleştirilmiş deneyim sunmak için kullanılır.
      </p>
      <ul>
        <li>Dil tercihleri</li>
        <li>Tema ayarları</li>
        <li>Kullanıcı tercihleri</li>
      </ul>

      <h3>2.4 Pazarlama Çerezleri</h3>
      <p>
        Kişiselleştirilmiş reklamlar göstermek için kullanılır. 
        Bu çerezler yalnızca açık rızanız ile aktif olur.
      </p>

      <h2>3. Üçüncü Taraf Çerezler</h2>
      <p>Platform aşağıdaki üçüncü taraf hizmetleri kullanabilir:</p>
      <ul>
        <li><strong>Google Analytics:</strong> Web sitesi analizi</li>
        <li><strong>Supabase:</strong> Veri tabanı ve kimlik doğrulama</li>
        <li><strong>Reklam Ağları:</strong> Kişiselleştirilmiş reklamlar</li>
      </ul>

      <h2>4. Çerez Yönetimi</h2>
      
      <h3>4.1 Tarayıcı Ayarları</h3>
      <p>
        Çoğu tarayıcı çerezleri yönetmenize olanak tanır:
      </p>
      <ul>
        <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
        <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik</li>
        <li><strong>Safari:</strong> Tercihler → Gizlilik</li>
        <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
      </ul>

      <h3>4.2 Platform Ayarları</h3>
      <p>
        Platform üzerinden çerez tercihlerinizi yönetebilirsiniz. 
        Zorunlu çerezler hariç diğer çerez türlerini kapatabilirsiniz.
      </p>

      <h2>5. Çerez Saklama Süresi</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Çerez Türü</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Saklama Süresi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Oturum Çerezleri</td>
            <td className="border border-gray-300 px-4 py-2">Tarayıcı kapatılana kadar</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Kalıcı Çerezler</td>
            <td className="border border-gray-300 px-4 py-2">30 gün - 2 yıl arası</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Analitik Çerezler</td>
            <td className="border border-gray-300 px-4 py-2">2 yıl</td>
          </tr>
        </tbody>
      </table>

      <h2>6. Çerez Rızası</h2>
      <p>
        Platform ilk ziyaretinizde çerez kullanımı hakkında bilgilendirilir 
        ve rızanız alınır. Bu rızayı istediğiniz zaman geri çekebilirsiniz.
      </p>

      <h2>7. İletişim</h2>
      <p>
        Çerez politikası hakkında sorularınız için: <strong>cerez@takasplatform.com</strong>
      </p>

      <h2>8. Politika Güncellemeleri</h2>
      <p>
        Bu politika güncellenebilir. Değişiklikler platform üzerinden duyurulur.
      </p>

      <p className="text-sm text-gray-600 mt-8">
        <strong>Son güncelleme:</strong> 11 Ekim 2025<br/>
        <strong>Versiyon:</strong> 1.0
      </p>
    </>
  )
}


