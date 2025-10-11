'use client'

export default function ConsentPage() {
  return (
    <>
      <h1>Açık Rıza Metni</h1>
      
      <h2>1. Açık Rıza Kapsamı</h2>
      <p>
        Bu metinle, aşağıda belirtilen faaliyetler için <strong>Takas Platform</strong> 
        tarafından kişisel verilerinizin işlenmesine açık rıza verdiğinizi beyan edersiniz.
      </p>

      <h2>2. Rıza Verilen Faaliyetler</h2>
      
      <h3>2.1 Pazarlama Faaliyetleri</h3>
      <ul>
        <li>E-posta ile pazarlama mesajları gönderimi</li>
        <li>SMS ile bilgilendirme ve promosyon mesajları</li>
        <li>Push bildirim gönderimi</li>
        <li>Kişiselleştirilmiş ürün önerileri</li>
        <li>Kampanya ve etkinlik duyuruları</li>
      </ul>

      <h3>2.2 Kişiselleştirme Faaliyetleri</h3>
      <ul>
        <li>Kullanıcı davranış analizi</li>
        <li>İlgi alanlarına göre içerik önerisi</li>
        <li>Kişiselleştirilmiş platform deneyimi</li>
        <li>Takas eşleştirme algoritması iyileştirme</li>
      </ul>

      <h3>2.3 Analitik ve Çerez Faaliyetleri</h3>
      <ul>
        <li>Üçüncü taraf analitik çerezler (Google Analytics)</li>
        <li>Reklam çerezleri</li>
        <li>Sosyal medya çerezleri</li>
        <li>Performans ve kullanım analizi</li>
      </ul>

      <h3>2.4 Konum Tabanlı Hizmetler</h3>
      <ul>
        <li>Yakın konumdaki takas fırsatları önerisi</li>
        <li>Konum bazlı filtreleme</li>
        <li>Mesafe hesaplaması</li>
        <li>Yerel etkinlik duyuruları</li>
      </ul>

      <h2>3. İşlenecek Kişisel Veriler</h2>
      <ul>
        <li>İletişim bilgileri (e-posta, telefon)</li>
        <li>Demografik bilgiler</li>
        <li>Platform kullanım verileri</li>
        <li>İlgi alanları ve tercihler</li>
        <li>Konum bilgileri (onay vermeniz halinde)</li>
        <li>Cihaz ve tarayıcı bilgileri</li>
      </ul>

      <h2>4. Veri Paylaşımı</h2>
      <p>
        Açık rıza kapsamında verileriniz aşağıdaki taraflarla paylaşılabilir:
      </p>
      <ul>
        <li>Pazarlama hizmeti sağlayıcıları</li>
        <li>Analitik servis sağlayıcıları (Google Analytics)</li>
        <li>Reklam ağları</li>
        <li>E-posta ve SMS servis sağlayıcıları</li>
      </ul>

      <h2>5. Rıza Süresi</h2>
      <p>
        Bu rıza, geri çekilene kadar geçerlidir. Rızanızı istediğiniz zaman 
        geri çekebilirsiniz.
      </p>

      <h2>6. Rızanın Geri Çekilmesi</h2>
      <p>
        Rızanızı aşağıdaki yollarla geri çekebilirsiniz:
      </p>
      <ul>
        <li>Hesap ayarlarından "Pazarlama İzinleri" bölümü</li>
        <li>E-posta mesajlarındaki "Abonelikten Çık" linki</li>
        <li>SMS mesajlarında "STOP" yazarak yanıtlama</li>
        <li><strong>riza@takasplatform.com</strong> adresine e-posta gönderme</li>
      </ul>

      <h2>7. Rıza Geri Çekilmesinin Sonuçları</h2>
      <p>
        Rızanızı geri çekmeniz halinde:
      </p>
      <ul>
        <li>Pazarlama mesajları gönderilmeyecektir</li>
        <li>Kişiselleştirme özellikleri devre dışı kalacaktır</li>
        <li>Analitik çerezler pasif hale gelecektir</li>
        <li>Temel platform hizmetleri etkilenmeyecektir</li>
      </ul>

      <h2>8. İletişim</h2>
      <p>
        Açık rıza ile ilgili sorularınız için: <strong>riza@takasplatform.com</strong>
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
        <p className="text-blue-800 font-medium">
          <strong>Önemli:</strong> Bu rıza tamamen isteğe bağlıdır. Rıza vermemeniz 
          veya geri çekmeniz durumunda Takas Platform'un temel hizmetlerini 
          kullanmaya devam edebilirsiniz.
        </p>
      </div>

      <p className="text-sm text-gray-600 mt-8">
        <strong>Son güncelleme:</strong> 11 Ekim 2025<br/>
        <strong>Versiyon:</strong> 1.0
      </p>
    </>
  )
}


