'use client'

export default function KvkkPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
          KVKK Aydınlatma Metni
        </h1>
        <p className="text-sm text-gray-500">Son Güncelleme: 10 Aralık 2025</p>
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-l-4 border-purple-500">
        <p className="text-sm text-gray-700">
          <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu</strong> kapsamında, 
          kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla bu metin hazırlanmıştır.
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
          <p><strong>VKN:</strong> 8361000730</p>
          <p><strong>Adres:</strong> Mevlana Mahallesi No:8 Kapı No:23, 06949 Sincan/Ankara</p>
          <p><strong>Telefon:</strong> 0543 509 84 85</p>
          <p><strong>E-posta:</strong> bilgi@teknovagroup.com</p>
          <p><strong>Veri Sorumlusu Temsilcisi:</strong> İsa Bozkurt</p>
        </div>
      </section>

      {/* İşlenen Veriler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          2. İşlenen Kişisel Veriler
        </h2>
        <p className="text-gray-600 mb-4">
          TakaZone platformunu kullandığınızda aşağıdaki kişisel verileriniz işlenmektedir:
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-700 mb-2">■ Kimlik Bilgileri</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ad, soyad</li>
              <li>• Profil fotoğrafı</li>
              <li>• Doğum tarihi (yaş doğrulaması)</li>
            </ul>
          </div>
          
          <div className="bg-pink-50 rounded-xl p-4">
            <h3 className="font-semibold text-pink-700 mb-2">■ İletişim Bilgileri</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• E-posta adresi</li>
              <li>• Telefon numarası</li>
              <li>• Konum bilgisi (izninizle)</li>
            </ul>
          </div>
          
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="font-semibold text-orange-700 mb-2">■ Kullanıcı Bilgileri</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Kullanıcı adı ve şifre (şifreli)</li>
              <li>• İlan içerikleri ve fotoğraflar</li>
              <li>• Mesaj içerikleri</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-700 mb-2">■ İşlem Bilgileri</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Platform kullanım geçmişi</li>
              <li>• Beğeni ve etkileşimler</li>
              <li>• Cihaz ve tarayıcı bilgileri</li>
            </ul>
          </div>
        </div>
      </section>

      {/* İşleme Amaçları */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          3. Veri İşleme Amaçları
        </h2>
        <p className="text-gray-600 mb-4">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Hesap oluşturma ve üyelik hizmetlerinin sunulması</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Takas işlemlerinin gerçekleştirilmesi ve eşleştirme yapılması</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Kullanıcılar arası mesajlaşma hizmetinin sağlanması</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Platform güvenliğinin sağlanması ve dolandırıcılığın önlenmesi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Yasal yükümlülüklerin yerine getirilmesi</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500 mt-1">✓</span>
            <span>Hizmet kalitesinin artırılması ve kullanıcı deneyiminin iyileştirilmesi</span>
          </li>
        </ul>
      </section>

      {/* Hukuki Sebepler */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          4. Hukuki Sebepler
        </h2>
        <p className="text-gray-600 mb-4">
          Kişisel verileriniz, KVKK'nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
        </p>
        
        <ul className="space-y-2 text-gray-700">
          <li>■ Açık rızanızın bulunması</li>
          <li>■ Sözleşmenin kurulması veya ifası için gerekli olması</li>
          <li>■ Hukuki yükümlülüğümüzün yerine getirilmesi</li>
          <li>■ Meşru menfaatlerimiz için veri işlenmesinin zorunlu olması</li>
        </ul>
      </section>

      {/* Veri Aktarımı */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          5. Veri Aktarımı
        </h2>
        <p className="text-gray-600 mb-4">
          Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda aşağıdaki taraflarla paylaşılabilir:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ <strong>Yetkili Kamu Kurumları:</strong> Yasal zorunluluk halinde</p>
          <p>■ <strong>Hizmet Sağlayıcılar:</strong> Sunucu barındırma, teknik destek</p>
          <p>■ <strong>İş Ortakları:</strong> Ödeme ve bildirim hizmetleri</p>
        </div>
        
        <div className="bg-amber-50 rounded-xl p-4 mt-4 border-l-4 border-amber-400">
          <p className="text-sm text-gray-700">
            <strong>Önemli:</strong> Verileriniz yurt dışına aktarılması durumunda, KVKK'nın 9. maddesi 
            kapsamında gerekli güvenlik önlemleri alınmaktadır.
          </p>
        </div>
      </section>

      {/* Saklama Süresi */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          6. Saklama Süresi
        </h2>
        <p className="text-gray-600 mb-4">
          Kişisel verileriniz, işleme amaçlarının gerektirdiği süre boyunca ve yasal yükümlülükler 
          çerçevesinde saklanmaktadır:
        </p>
        
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm text-gray-700">
          <p>■ Hesap verileri: Üyelik süresince + hesap kapatmadan sonra 6 ay</p>
          <p>■ İşlem kayıtları: 10 yıl (Vergi mevzuatı gereği)</p>
          <p>■ Mesajlaşma verileri: 2 yıl</p>
          <p>■ Log kayıtları: 2 yıl (5651 sayılı Kanun gereği)</p>
        </div>
      </section>

      {/* Haklarınız */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          7. KVKK Kapsamındaki Haklarınız
        </h2>
        <p className="text-gray-600 mb-4">
          KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
        </p>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Kişisel verilerinizin işlenip işlenmediğini öğrenme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>İşlenmişse buna ilişkin bilgi talep etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Yurt içi/dışı aktarılan üçüncü kişileri bilme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Eksik veya yanlış işlenmişse düzeltilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Silinmesini veya yok edilmesini isteme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Otomatik sistemlerle analiz sonucu aleyhinize çıkan sonuca itiraz etme</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">●</span>
            <span>Kanuna aykırı işleme nedeniyle zararınızın giderilmesini talep etme</span>
          </li>
        </ul>
      </section>

      {/* Başvuru */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          8. Başvuru Yöntemi
        </h2>
        <p className="text-gray-600 mb-4">
          Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerle bize başvurabilirsiniz:
        </p>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 space-y-3">
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📧</span>
            <strong>E-posta:</strong> bilgi@teknovagroup.com
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📞</span>
            <strong>Telefon:</strong> 0543 509 84 85
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">📍</span>
            <strong>Adres:</strong> Mevlana Mah. No:8 Kapı No:23, 06949 Sincan/Ankara
          </p>
          <p className="flex items-center gap-2">
            <span className="text-purple-500">🌐</span>
            <strong>Online:</strong> takazone.com/destek
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 mt-4 border-l-4 border-blue-400">
          <p className="text-sm text-gray-700">
            Başvurularınız <strong>30 gün</strong> içinde sonuçlandırılacaktır. Başvurular ücretsizdir, 
            ancak işlemin ayrıca bir maliyet gerektirmesi halinde Kişisel Verileri Koruma Kurulu 
            tarafından belirlenen ücret tarifesi uygulanabilir.
          </p>
        </div>
      </section>

      {/* Şikayet */}
      <section>
        <h2 className="text-lg font-semibold text-purple-700 border-b-2 border-purple-200 pb-2 mb-4">
          9. Şikayet Hakkı
        </h2>
        <p className="text-gray-600">
          Başvurunuzun reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde cevap 
          verilmemesi halinde <strong>Kişisel Verileri Koruma Kurulu'na</strong> şikayette bulunabilirsiniz.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Web: <a href="https://kvkk.gov.tr" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">kvkk.gov.tr</a>
        </p>
      </section>

      {/* Footer */}
      <div className="bg-gray-100 rounded-xl p-4 text-center text-sm text-gray-600">
        <p><strong>Teknova Tarım Hayvancılık Bilişim Reklam Ltd. Şti.</strong></p>
        <p className="mt-1">Bu aydınlatma metni 10.12.2025 tarihinde güncellenmiştir.</p>
      </div>
    </div>
  )
}
