// ============================================================
// TAKAS PLATFORM - FIX: Populate public.users + Add items
// ============================================================

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

const CITIES = [
  'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana',
  'Konya', 'Gaziantep', 'Mersin', 'Kayseri', 'Eskişehir', 'Samsun',
  'Denizli', 'Trabzon', 'Diyarbakır', 'Sakarya', 'Muğla', 'Tekirdağ',
  'Kocaeli', 'Aydın', 'Balıkesir', 'Manisa', 'Malatya', 'Erzurum',
  'Hatay', 'Edirne', 'Çanakkale', 'Bolu', 'Kastamonu', 'Rize'
];

const BIOS = [
  'Kullanmadığım eşyaları değerlendirmek istiyorum 🔄',
  'Takas severim, sürdürülebilir yaşam ❤️',
  'Minimalist yaşam tarzını benimsedim, fazla eşyalarımı takasa çıkarıyorum',
  'İkinci el alışverişe bayılırım! Kaliteli ürünler paylaşıyorum',
  'Çocuklarımın büyüdüğü kıyafetleri ve oyuncakları takasa sunuyorum',
  'Teknoloji meraklısı, eski cihazlarımı takasa çıkarıyorum',
  'Kitap kurdu 📚 Okuduğum kitapları yeni sahipleriyle buluşturuyorum',
  'Spor tutkunu! Kullanmadığım ekipmanları değerlendiriyorum',
  'Ev dekorasyonu tutkunuyum, değiştirdiğim ürünleri paylaşıyorum',
  'Vintage parça koleksiyoncusu, özel parçalar burada!',
  'Sürdürülebilir moda destekçisi ♻️',
  'Çevreci bir yaşam için takas en güzel yol',
  'Gardırop temizliği yapıyorum, güzel parçalar sizi bekliyor',
  'Çocuk giyim ve oyuncak takasına açığım',
  'Her şeyin bir sahibi var, benim fazlam senin ihtiyacın olabilir',
  'Takas yaparak hem tasarruf ediyorum hem çevreye katkı sağlıyorum',
  'Kullanılmayan eşyalara yeni bir hayat veriyorum',
  'Alışveriş yerine takas! Hem ekonomik hem ekolojik',
  'Komşudan komşuya takas platformu harika bir fikir!',
  'Moda değişir ama kalite kalır, kaliteli parçalarımı paylaşıyorum'
];

function getAvatar(email) {
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`;
}

function getItemImages(category, index) {
  const numImages = 2 + Math.floor(Math.random() * 3);
  const images = [];
  for (let i = 0; i < numImages; i++) {
    images.push(`https://picsum.photos/seed/${category}_${index}_img${i}/800/600`);
  }
  return images;
}

// ============================================================
// ITEM DEFINITIONS
// ============================================================
const ITEMS_BY_CATEGORY = {
  clothing: [
    { title: 'Zara Erkek Slim Fit Beyaz Gömlek', description: 'Zara marka, M beden, sadece 2 kez giyildi. Slim fit kesim, %100 pamuk kumaş. İş görüşmeleri için ideal. Ütülenmiş ve temiz durumda.', condition: 'like-new', value: 350 },
    { title: 'Nike Air Force 1 Beyaz Spor Ayakkabı', description: '42 numara Nike Air Force 1 klasik beyaz. Orijinal kutusunda, faturası mevcut. Hafif kullanım izleri var ama genel durumu çok iyi.', condition: 'good', value: 800 },
    { title: 'Mango Kadın Trençkot - Bej', description: 'Mango marka S beden trençkot. Sonbahar/kış sezonu için ideal. Kemer detaylı, iç astarı saten. Bir sezon giyildi.', condition: 'like-new', value: 600 },
    { title: "Levi's 501 Original Fit Kot Pantolon", description: "Levi's 501 orijinal kesim, 32/32 beden, koyu mavi yıkama. Klasik Amerikan kot pantolonu. 3-4 kez giyildi.", condition: 'like-new', value: 500 },
    { title: 'Adidas Originals Hoodie - Siyah', description: 'Adidas Originals serisi, L beden, ikonik üç çizgili hoodie. İçi tüylü, kışlık. Çok rahat bir sweatshirt.', condition: 'good', value: 400 },
    { title: 'H&M Yazlık Çiçekli Elbise', description: 'H&M marka S beden midi boy elbise. Çiçek desenli, hafif kumaş, yaz ayları için ideal. Yıkanmış ama hiç giyilmedi.', condition: 'new', value: 250 },
    { title: 'Koton Erkek Kışlık Mont - Haki', description: 'Koton marka XL beden kışlık mont. Su geçirmez kumaş, kapüşonlu. Çok sıcak tutuyor, bu kış aldım ama bedeni büyük geldi.', condition: 'new', value: 700 },
    { title: 'Converse Chuck Taylor All Star', description: 'Converse klasik siyah, 39 numara, unisex. Yüksek bilekli model. Çok az kullanılmış, yıkanmış temiz durumda.', condition: 'good', value: 350 },
    { title: 'Kadın İpek Şal - Mavi Tonları', description: 'El yapımı ipek şal, 180x60 cm. Mavi ve turkuaz tonlarında, özel tasarım. Hediye geldi ama kullanmıyorum.', condition: 'new', value: 450 },
    { title: "Defacto Erkek Polo Yaka Tişört 3'lü Set", description: 'Defacto marka M beden, siyah-beyaz-lacivert polo yaka tişört seti. %100 pamuk, yazlık. Hiç giyilmedi, etiketleri üzerinde.', condition: 'new', value: 300 },
    { title: "Pull&Bear Kadın Skinny Jean", description: 'Pull&Bear marka 36 beden, yüksek bel skinny jean. Koyu gri yıkama. Elastik kumaş, çok rahat. Bir sezon giyildi.', condition: 'good', value: 200 },
    { title: 'The North Face Polar Fleece Ceket', description: 'The North Face erkek M beden polar ceket, lacivert renk. Dağ gezileri ve outdoor aktiviteler için ideal.', condition: 'good', value: 550 },
    { title: 'Vakko Kadın Deri Çanta - Siyah', description: 'Vakko orijinal siyah deri omuz çantası. Orta boy, günlük kullanıma uygun. İç bölmeleri çok pratik. 1 yıllık.', condition: 'good', value: 900 },
    { title: 'Columbia Outdoor Yürüyüş Botu', description: 'Columbia Redmond III erkek bot, 43 numara. Waterproof, trekking için ideal. 2 dağ yürüyüşünde kullanıldı.', condition: 'like-new', value: 650 },
    { title: 'LC Waikiki Çocuk Kışlık Set', description: '5-6 yaş kışlık kıyafet seti: mont, kazak, pantolon. Çocuğum büyüdü, temiz ve bakımlı durumda.', condition: 'good', value: 350 },
    { title: 'Beymen Erkek Yün Kazak - Bordo', description: 'Beymen Club %100 merino yünü V yaka kazak, L beden. İtalyan kumaş, bordo renk. 2 kez giyildi.', condition: 'like-new', value: 750 },
    { title: 'Puma Kadın Tayt - Spor', description: 'Puma DryCell teknolojili spor taytı, S beden. Yüksek bel, cepli. Koşu ve yoga için ideal. 1 ay kullanıldı.', condition: 'like-new', value: 280 },
    { title: 'İpekyol Kadın Blazer Ceket', description: 'İpekyol marka 38 beden siyah blazer ceket. Oversize kesim, modern tasarım. İş ve günlük kombinler için mükemmel.', condition: 'good', value: 550 },
    { title: 'Erkek Vintage Deri Ceket', description: "Hakiki deri erkek ceket, L beden, koyu kahverengi. 90'lar vintage tarz. Çok karakterli bir parça, bakımlı durumda.", condition: 'fair', value: 800 },
    { title: 'Bebek Giyim Paketi 0-6 Ay', description: '15 parçalık bebek giyim seti: tulumlar, bodiler, şapkalar, patikler. Markalı ürünler (Chicco, Ebebek). Temiz, ütülenmiş.', condition: 'good', value: 400 },
  ],
  toys: [
    { title: 'LEGO City Polis Merkezi Seti (60316)', description: 'LEGO City Polis Merkezi, 668 parça. Tüm parçalar tam, kayıp yok. Kılavuz kitapçığı mevcut. 1 kez kuruldu.', condition: 'like-new', value: 600 },
    { title: 'Barbie Rüya Evi', description: '3 katlı, 8 odalı Barbie Rüya Evi. Mobilyaları ve aksesuarları dahil. Kızım büyüdü artık oynamıyor. Çok temiz durumda.', condition: 'good', value: 800 },
    { title: "Hot Wheels 20'li Araba Seti", description: 'Hot Wheels 20 adet metal oyuncak araba seti. Orijinal kutusu mevcut. Araba koleksiyonu başlatmak isteyenler için ideal.', condition: 'like-new', value: 350 },
    { title: 'Monopoly Türkiye Özel Edisyon', description: 'Monopoly Türkiye özel edisyon kutu oyunu. Tüm parçalar tam, kartlar sağlam. Aile oyun geceleri için harika!', condition: 'good', value: 200 },
    { title: 'Playmobil Korsan Gemisi', description: 'Playmobil 70411 Skull Pirate Ship. 132 parça, tüm figürler ve aksesuarlar dahil. Çocuğumun en sevdiği oyuncaktı.', condition: 'good', value: 500 },
    { title: 'Rubik Küp Koleksiyonu (3 adet)', description: '3x3, 4x4 ve Pyraminx Rubik küp seti. Speed cube modelleri, turnuva kalitesi. Bulmaca severler için harika set.', condition: 'like-new', value: 250 },
    { title: 'Bebek Oyun Matı - Eğitici', description: 'Piyano tuşlu bebek oyun matı, ışıklı ve sesli. 0-12 ay bebekler için ideal. Piller dahil. Temiz ve çalışır durumda.', condition: 'good', value: 300 },
    { title: 'Uzaktan Kumandalı Drone', description: 'Mini drone, HD kamera özellikli. 15 dk uçuş süresi, 100m menzil. Çantası ve yedek pervaneleri dahil.', condition: 'good', value: 700 },
    { title: 'Ahşap Tren Seti - 80 Parça', description: 'Doğal ahşap tren seti, boyalı ve toksik olmayan boya. Raylar, köprüler, binalar dahil. 3+ yaş, eğitici oyuncak.', condition: 'like-new', value: 400 },
    { title: 'Nerf Elite Blaster Seti', description: 'Nerf N-Strike Elite Disruptor + 30 adet yedek mermi. Orijinal kutu var. Çok az kullanıldı, mükemmel durumda.', condition: 'like-new', value: 350 },
    { title: 'Yapboz Koleksiyonu 1000 Parça (3 adet)', description: 'Ravensburger marka 3 adet 1000 parça yapboz: İstanbul manzarası, dünya haritası, Van Gogh tablosu. Hepsi tam.', condition: 'good', value: 300 },
    { title: 'Fisher-Price Eğitici Bloklar', description: 'Fisher-Price 50 parça renkli eğitici bloklar. Harf ve rakam baskılı, BPA-free plastik. 1-5 yaş arası çocuklar için.', condition: 'good', value: 200 },
    { title: 'Peluş Oyuncak Koleksiyonu', description: '5 adet büyük peluş oyuncak: ayı, tavşan, köpek, panda, unicorn. Hepsi yıkanmış ve hijyenik.', condition: 'good', value: 350 },
    { title: 'Scrabble Türkçe Orijinal', description: 'Mattel orijinal Türkçe Scrabble. Tüm harfler tam, tahta ve ayaklıklar sağlam. Kelime oyunu severler için.', condition: 'like-new', value: 180 },
    { title: 'Uzaktan Kumandalı Off-Road Araba', description: '1:16 ölçek 4WD off-road RC araba. Şarj edilebilir batarya, 30 dk kullanım süresi. Her zeminde gider.', condition: 'good', value: 450 },
  ],
  electronics: [
    { title: 'Apple AirPods Pro (2. Nesil)', description: 'Apple AirPods Pro 2. nesil, orijinal kutu ve şarj kablosu dahil. Aktif gürültü engelleme. 6 ay kullanıldı, garanti devam ediyor.', condition: 'like-new', value: 2500 },
    { title: 'Samsung Galaxy Tab A8 Tablet', description: 'Samsung Galaxy Tab A8, 10.5 inç, 64GB, Wi-Fi model. Kılıf ve ekran koruyucu hediye. Film izlemek ve çocuklar için ideal.', condition: 'good', value: 3000 },
    { title: 'JBL Flip 6 Bluetooth Hoparlör', description: 'JBL Flip 6 taşınabilir hoparlör, siyah renk. IP67 su geçirmez. 12 saat pil ömrü. Ses kalitesi mükemmel.', condition: 'like-new', value: 1500 },
    { title: 'PlayStation 5 DualSense Gamepad', description: 'PS5 DualSense kablosuz oyun kolu, beyaz. Haptic feedback ve adaptive trigger. Orijinal kutusu var.', condition: 'like-new', value: 1200 },
    { title: 'Xiaomi Mi Band 8 Akıllı Bileklik', description: 'Xiaomi Mi Band 8, AMOLED ekran, SpO2 sensör, uyku takibi. Yedek kayışlarla birlikte. 3 ay kullanıldı.', condition: 'like-new', value: 600 },
    { title: 'Logitech MX Master 3S Mouse', description: 'Logitech MX Master 3S kablosuz mouse. Ergonomik tasarım, sessiz tıklama. USB-C şarj. Home office için en iyisi.', condition: 'good', value: 1000 },
    { title: 'Kindle Paperwhite (2023)', description: 'Amazon Kindle Paperwhite 11. nesil, 16GB. 6.8 inç ekran, su geçirmez. İçinde 50+ e-kitap yüklü. Kılıf hediye.', condition: 'like-new', value: 2000 },
    { title: 'Anker PowerCore 26800 Powerbank', description: 'Anker PowerCore 26800mAh powerbank. 3 USB çıkışlı, hızlı şarj destekli. Seyahat için vazgeçilmez.', condition: 'good', value: 500 },
    { title: 'Canon EOS M50 Mark II Aynasız Kamera', description: 'Canon EOS M50 Mark II, 15-45mm kit lens ile. 4K video, döner ekran, Wi-Fi. Vlog ve fotoğrafçılık için ideal.', condition: 'good', value: 8000 },
    { title: 'Apple Watch SE (2. Nesil) 40mm', description: 'Apple Watch SE 2. nesil, 40mm, midnight renk. GPS model. Orijinal kutu, şarj kablosu, ekstra kayışlar dahil.', condition: 'good', value: 4000 },
    { title: 'Marshall Stanmore II Bluetooth Hoparlör', description: 'Marshall Stanmore II, siyah. Retro tasarım, harika ses kalitesi. Ev ve ofis için mükemmel. 1 yıl kullanıldı.', condition: 'good', value: 3500 },
    { title: 'Nintendo Switch Lite - Turkuaz', description: 'Nintendo Switch Lite, turkuaz renk. Taşınabilir oyun konsolu. Kılıf ve 2 oyun kartı dahil.', condition: 'good', value: 3000 },
    { title: 'Sony WH-1000XM5 Kulaklık', description: 'Sony WH-1000XM5 kablosuz ANC kulaklık, gümüş renk. Aktif gürültü engelleme, 30 saat pil. Taşıma çantası dahil.', condition: 'like-new', value: 4500 },
    { title: 'Raspberry Pi 4 Starter Kit', description: 'Raspberry Pi 4 Model B 8GB RAM + kasa + fan + güç kaynağı + 64GB SD kart. Hobi projeleri için harika.', condition: 'like-new', value: 1500 },
    { title: 'GoPro Hero 11 Black', description: 'GoPro Hero 11 Black aksiyon kamerası. 5.3K video, HyperSmooth 5.0. Su altı kılıfı, göğüs askısı, selfie çubuğu dahil.', condition: 'good', value: 5000 },
  ],
  books: [
    { title: 'Orhan Pamuk - İstanbul Hatıralar ve Şehir', description: 'Nobel ödüllü yazarımız Orhan Pamuk\'un İstanbul anlatısı. Yapı Kredi Yayınları, ciltli baskı.', condition: 'like-new', value: 80 },
    { title: 'Yuval Noah Harari - Sapiens (Türkçe)', description: 'İnsan türünün kısa tarihi. Kolektif Kitap yayınları, güncel baskı. Çok akıcı ve düşündürücü. Bir kez okundu.', condition: 'good', value: 60 },
    { title: 'Harry Potter Serisi Tam Set (7 Kitap)', description: 'Harry Potter serisi Türkçe çeviri, Yapı Kredi Yayınları. 7 kitap tam set. Koleksiyonluk durumda, özel kutusu var.', condition: 'good', value: 500 },
    { title: 'Sabahattin Ali - Kürk Mantolu Madonna', description: 'Yapı Kredi Yayınları baskısı. Türk edebiyatının klasik eseri. Temiz ve bakımlı.', condition: 'good', value: 35 },
    { title: 'İlber Ortaylı - Türklerin Tarihi', description: 'İlber Ortaylı\'nın kapsamlı Türk tarihi eseri. Kronik Kitap, ciltli. Tarih meraklıları için vazgeçilmez.', condition: 'like-new', value: 100 },
    { title: 'Çocuk Ansiklopedisi Seti (10 Cilt)', description: '10 ciltlik çocuk ansiklopedisi seti. Renkli resimli, büyük harfli. 7-12 yaş grubu için. Tüm ciltler eksiksiz.', condition: 'good', value: 300 },
    { title: 'Amin Maalouf - Semerkant', description: 'Amin Maalouf\'un tarihi romanı. Yapı Kredi Yayınları. Ömer Hayyam ve Haşhaşilerin hikayesi.', condition: 'good', value: 45 },
    { title: 'Dale Carnegie - İnsan İlişkilerinde Başarı', description: 'Kişisel gelişim klasiği. Türkçe çeviri, son baskı. İş hayatı ve sosyal ilişkiler için altın kurallar.', condition: 'good', value: 50 },
    { title: 'Türk Mutfağı - 500 Tarif', description: 'Kapsamlı Türk mutfağı kitabı. 500 geleneksel tarif, adım adım fotoğraflarla. Yemek yapmayı öğrenmek isteyenler için.', condition: 'like-new', value: 120 },
    { title: 'Antoine de Saint-Exupéry - Küçük Prens', description: 'Küçük Prens, orijinal çizimleriyle. Koleksiyonluk ciltli baskı, Türkçe. Zamansız bir klasik.', condition: 'new', value: 75 },
    { title: 'Stephen Hawking - Zamanın Kısa Tarihi', description: 'Bilim tarihinin en popüler kitabı. Türkçe çeviri, Alfa Yayınları. Evrenin gizemlerini anlaşılır dille anlatıyor.', condition: 'good', value: 55 },
    { title: 'Elif Şafak - Aşk (10 Yıl Özel Baskısı)', description: 'Elif Şafak\'ın dünya çapında ses getiren romanı. Doğan Kitap özel baskısı. Mevlana ve Şems anlatısı.', condition: 'like-new', value: 65 },
    { title: 'Manga Seti - Naruto (1-20. Cilt)', description: 'Naruto manga serisi ilk 20 cilt. Türkçe çeviri, Gerekli Şeyler Yayınları. Tüm ciltler sağlam.', condition: 'good', value: 600 },
    { title: 'KPSS Hazırlık Seti 2025', description: '2025 KPSS tam hazırlık seti: Genel Yetenek, Genel Kültür, Eğitim Bilimleri. 3 yayınevinden derleme.', condition: 'good', value: 400 },
    { title: 'Stefan Zweig Seti (5 Kitap)', description: 'Stefan Zweig eserleri: Satranç, Bilinmeyen Kadının Mektubu, Sabırsız Yürek, Korku, Olağanüstü Bir Gece.', condition: 'like-new', value: 200 },
  ],
  sports: [
    { title: 'Yoga Matı + Blok + Kayış Seti', description: 'TPE yoga matı (6mm, kaymaz), 2 adet köpük blok, pamuk yoga kayışı. Başlangıç seti olarak ideal.', condition: 'like-new', value: 350 },
    { title: 'Wilson Pro Staff Tenis Raketi', description: 'Wilson Pro Staff 97, 315g. Kordajı yeni çekildi. Grip bandı yeni. İntermediate seviye oyuncular için.', condition: 'good', value: 1200 },
    { title: 'Kettlebell Set (8kg + 12kg + 16kg)', description: '3 adet demir kettlebell seti: 8, 12 ve 16 kg. CrossFit ve fonksiyonel antrenman için. Pas yok.', condition: 'good', value: 600 },
    { title: 'Adidas UCL Futbol Topu', description: 'Adidas UEFA Champions League resmi maç topu. FIFA Quality Pro onaylı. 2 maçta kullanıldı.', condition: 'like-new', value: 400 },
    { title: 'Decathlon Kamp Çadırı 3 Kişilik', description: 'Quechua Fresh&Black 3 kişilik kamp çadırı. Karanlık iç mekan, kolay kurulum. 5 kamp gezisinde kullanıldı.', condition: 'good', value: 800 },
    { title: 'Bisiklet Kaskı + Eldiven + Gözlük', description: 'Yetişkin bisiklet kask seti: kask (L), yarım parmak eldiven, UV korumalı gözlük.', condition: 'good', value: 300 },
    { title: "Direnç Bandı Seti (5'li)", description: '5 farklı direnç seviyesinde latex bantlar. Çanta ve egzersiz rehberi dahil. Evde antrenman için harika.', condition: 'like-new', value: 200 },
    { title: 'Spalding NBA Basketbol Topu', description: 'Spalding NBA resmi maç topu replikası. İç ve dış mekan kullanımına uygun. Grip kalitesi mükemmel.', condition: 'good', value: 350 },
    { title: 'Koşu Ayakkabısı Asics Gel-Nimbus 25', description: 'Asics Gel-Nimbus 25, 43 numara. Gel teknolojili, uzun mesafe koşuları için. 200 km koşuldu, hala çok rahat.', condition: 'good', value: 900 },
    { title: 'Yüzme Seti - Gözlük + Bone + Kulak Tıkacı', description: 'Arena yüzme gözlüğü (anti-fog), silikon bone, kulak tıkacı seti. Havuz ve deniz için.', condition: 'like-new', value: 250 },
    { title: 'Pilates Reformer Mini', description: 'Taşınabilir pilates reformer, katlanabilir tasarım. Ayak kayışları ve spring seti dahil.', condition: 'good', value: 1500 },
    { title: 'Dağ Bisikleti - 26" Jant', description: '26 jant, 21 vites dağ bisikleti. Shimano vites grubu, disk fren. Bakımı yapıldı, lastikler yeni.', condition: 'fair', value: 2000 },
    { title: 'Boks Eldiveni + Bandaj + Çanta', description: 'Venum 12oz boks eldiveni (kırmızı-siyah) + el bandajı (2 çift) + boks çantası. Başlangıç seti.', condition: 'good', value: 500 },
    { title: 'Kayak Gözlüğü Oakley', description: 'Oakley Flight Deck kayak gözlüğü. Anti-fog, UV korumalı, değiştirilebilir lens. Orijinal kutusu var.', condition: 'like-new', value: 800 },
    { title: 'Elektrikli Scooter - Xiaomi Mi', description: 'Xiaomi Mi Electric Scooter 3, siyah. 30 km menzil, 25 km/h max hız. Çok az kullanıldı, pil sağlığı %95.', condition: 'like-new', value: 4000 },
  ],
  home: [
    { title: 'IKEA Billy Kitaplık - Beyaz', description: 'IKEA Billy kitaplık, 80x28x202 cm, beyaz renk. 6 raflı, ayarlanabilir. Taşınma nedeniyle veriyorum.', condition: 'good', value: 500 },
    { title: 'Philips Hue Akıllı Aydınlatma Seti', description: 'Philips Hue Starter Kit: 3 ampul + Bridge. 16 milyon renk, uygulama kontrolü, sesli asistan uyumlu.', condition: 'like-new', value: 1200 },
    { title: 'Le Creuset Döküm Tencere 24cm', description: 'Le Creuset Signature döküm tencere, 24cm, kırmızı. Fırın ve ocak uyumlu. Yemeklere bambaşka lezzet katıyor.', condition: 'good', value: 2000 },
    { title: 'Dekoratif Ayna - Yuvarlak Altın Çerçeve', description: '60cm çapında yuvarlak dekoratif ayna. Altın metal çerçeve. Salon veya antre için şık aksesuar.', condition: 'new', value: 400 },
    { title: 'Kahve Makinesi - Nespresso Vertuo', description: 'Nespresso Vertuo Next kahve makinesi, siyah. Süt köpürtücü dahil. 50 adet kapsül hediye.', condition: 'good', value: 1500 },
    { title: 'El Yapımı Kilim 120x180cm', description: 'Anadolu motifli el dokuması kilim. %100 yün, doğal boyalar. 120x180 cm. Otantik dekorasyon.', condition: 'good', value: 1000 },
    { title: 'Dyson V8 Şarjlı Süpürge', description: 'Dyson V8 Absolute kablosuz süpürge. 40 dk çalışma süresi. Tüm başlıkları mevcut.', condition: 'good', value: 2500 },
    { title: 'Monstera Deliciosa - Büyük Saksılı', description: 'Monstera Deliciosa (Swiss Cheese Plant), 120cm boyunda. Dekoratif seramik saksıda. Çok sağlıklı.', condition: 'good', value: 350 },
    { title: 'Dekoratif Mum Seti (6 adet)', description: 'Soya mumu, el yapımı, 6 farklı koku: vanilya, lavanta, tarçın, gül, okyanus, çam. Hepsi yeni.', condition: 'new', value: 300 },
    { title: 'IKEA Poäng Koltuk + Tabure', description: 'IKEA Poäng sallanan koltuk + ayak taburesi. Huş ağacı çerçeve, gri kumaş minder. Okuma köşesi için.', condition: 'good', value: 700 },
    { title: 'Mutfak Robot - Arzum Crust Mix', description: 'Arzum Crust Mix 1500W mutfak robotu. Hamur yoğurma, doğrama, karıştırma. Tüm aparatları mevcut.', condition: 'like-new', value: 800 },
    { title: 'Pamuk Nevresim Takımı - Çift Kişilik', description: 'English Home %100 pamuk saten nevresim takımı. Çift kişilik, beyaz-gri çizgili. Yıkanmış ama kullanılmadı.', condition: 'new', value: 450 },
    { title: 'Vintage Ahşap Sehpa', description: 'El yapımı ahşap orta sehpa, ceviz kaplamalı. 90x50x45 cm. Retro/bohem tarz dekorasyona çok yakışır.', condition: 'fair', value: 600 },
    { title: 'Hava Temizleyici - Xiaomi Mi Air Purifier', description: 'Xiaomi Mi Air Purifier 3H, HEPA H13 filtre. 45m² alana kadar etkili. Alerji hastaları için ideal.', condition: 'good', value: 1200 },
    { title: 'Seramik Tabak Seti 18 Parça', description: 'Kütahya Porselen el boyaması seramik tabak seti. 6 düz, 6 derin, 6 tatlı tabağı. Geleneksel Türk desenleri.', condition: 'like-new', value: 500 },
  ],
  other: [
    { title: 'Kanvas Sırt Çantası - Vintage', description: 'Su geçirmez kanvas sırt çantası, kahverengi-haki. Laptop bölmeli (15.6"), çok gözlü.', condition: 'good', value: 300 },
    { title: 'Ray-Ban Wayfarer Güneş Gözlüğü', description: 'Ray-Ban Original Wayfarer, siyah çerçeve, yeşil cam. Orijinal kutu ve kılıf. Klasik model.', condition: 'like-new', value: 800 },
    { title: 'Ukulele - Soprano Başlangıç Seti', description: 'Soprano ukulele, maun ağacı. Taşıma çantası, yedek tel, akort cihazı dahil. Müzik başlangıcı için.', condition: 'like-new', value: 400 },
    { title: 'Satranç Takımı - Ahşap Turnuva Boy', description: 'Turnuva boy ahşap satranç takımı. Ağırlıklı taşlar, keçe tabanlı. Katlanır tahta 45x45 cm.', condition: 'good', value: 350 },
    { title: 'Camping Lamba + Şarj İstasyonu', description: 'Solar şarjlı camping lambası, USB çıkışlı. 3 ışık modu, acil durum SOS. Kamp ve doğa sporları için.', condition: 'like-new', value: 250 },
    { title: 'Polaroid Now+ Fotoğraf Makinesi', description: 'Polaroid Now+ i-Type instant kamera, siyah. 5 lens filtresi dahil. Bluetooth bağlantılı.', condition: 'good', value: 1500 },
    { title: 'Deri Cüzdan - El Yapımı', description: 'El yapımı hakiki deri cüzdan, kahverengi. 8 kart bölmeli, para gözü, RFID korumalı. Hediye kutusu ile.', condition: 'new', value: 400 },
    { title: 'Swiss Army Çakı - Victorinox', description: 'Victorinox Swiss Army Huntsman çakı, kırmızı. 15 fonksiyon. Orijinal kutu ve kılıf.', condition: 'like-new', value: 350 },
    { title: 'Teleskop - Celestron StarSense', description: 'Celestron StarSense Explorer LT 80AZ teleskop. Telefon uygulamasıyla gökyüzü keşfi. Tripod dahil.', condition: 'good', value: 2000 },
    { title: 'Resim Seti - Yağlı Boya Başlangıç', description: '24 renk yağlı boya, 10 fırça, 3 tuval (30x40), palet, tiner, şövale. Başlamak isteyenler için komple set.', condition: 'new', value: 500 },
  ]
};

// ============================================================
// MAIN
// ============================================================
async function seed() {
  await client.connect();
  console.log('✅ Veritabanına bağlanıldı!\n');

  // ============================================================
  // STEP 1: Create public.users entries for auth users that don't have one
  // ============================================================
  console.log('👤 Eksik public.users kayıtları oluşturuluyor...');
  
  // Get auth users without public.users entry
  const orphanedAuth = await client.query(`
    SELECT a.id, a.email, a.raw_user_meta_data, a.created_at
    FROM auth.users a
    LEFT JOIN public.users p ON a.id = p.id
    WHERE p.id IS NULL
    ORDER BY a.created_at
  `);
  
  console.log(`  ${orphanedAuth.rows.length} kullanıcı public.users tablosunda eksik\n`);

  let createdUsers = 0;
  for (let i = 0; i < orphanedAuth.rows.length; i++) {
    const au = orphanedAuth.rows[i];
    const meta = au.raw_user_meta_data || {};
    const name = meta.name || au.email.split('@')[0];
    const firstName = meta.firstName || name.split(' ')[0];
    const lastName = meta.lastName || name.split(' ').slice(1).join(' ') || '';
    const city = CITIES[i % CITIES.length];
    const bio = BIOS[i % BIOS.length];
    const avatar = getAvatar(au.email);
    const rating = (3.5 + Math.random() * 1.5).toFixed(2);
    const totalTrades = Math.floor(Math.random() * 20);

    try {
      await client.query(`
        INSERT INTO public.users (id, email, name, avatar, bio, location, created_at, updated_at, rating, total_trades, first_name, last_name, display_name)
        VALUES ($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::text, $7::timestamptz, NOW(), $8::numeric, $9::int, $10::text, $11::text, $12::text)
        ON CONFLICT (id) DO NOTHING
      `, [au.id, au.email, name, avatar, bio, city, au.created_at, rating, totalTrades, firstName, lastName, name]);
      createdUsers++;
    } catch (err) {
      console.error(`  ✗ Kullanıcı hatası (${au.email}):`, err.message);
    }
    
    if ((i + 1) % 10 === 0) {
      console.log(`  ✓ ${i + 1}/${orphanedAuth.rows.length} kullanıcı oluşturuldu`);
    }
  }
  console.log(`\n✅ ${createdUsers} yeni public.users kaydı oluşturuldu!\n`);

  // ============================================================
  // STEP 2: Also update existing users that are missing profile data
  // ============================================================
  console.log('🔄 Mevcut kullanıcı profilleri güncelleniyor...');
  const existingWithoutAvatar = await client.query(`
    SELECT id, email, name FROM public.users WHERE avatar IS NULL OR avatar = ''
  `);
  for (let i = 0; i < existingWithoutAvatar.rows.length; i++) {
    const u = existingWithoutAvatar.rows[i];
    const avatar = getAvatar(u.email);
    const bio = BIOS[i % BIOS.length];
    const city = CITIES[i % CITIES.length];
    await client.query(`
      UPDATE public.users SET avatar = $2, bio = COALESCE(NULLIF(bio, ''), $3), location = COALESCE(NULLIF(location, ''), $4)
      WHERE id = $1 AND (avatar IS NULL OR avatar = '')
    `, [u.id, avatar, bio, city]);
  }
  console.log(`  ✓ ${existingWithoutAvatar.rows.length} profil güncellendi\n`);

  // ============================================================
  // STEP 3: Get all user IDs for item distribution
  // ============================================================
  const allUsers = await client.query('SELECT id FROM public.users ORDER BY created_at');
  const userIds = allUsers.rows.map(r => r.id);
  console.log(`📊 Toplam ${userIds.length} kullanıcı mevcut\n`);

  if (userIds.length === 0) {
    console.error('❌ Kullanıcı bulunamadı! İşlem durduruluyor.');
    await client.end();
    return;
  }

  // ============================================================
  // STEP 4: Insert items
  // ============================================================
  console.log('📦 Ürünler oluşturuluyor...');
  
  let totalItems = 0;
  let userIdx = 0;

  for (const [category, items] of Object.entries(ITEMS_BY_CATEGORY)) {
    console.log(`\n  📂 Kategori: ${category} (${items.length} ürün)`);
    let catSuccess = 0;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const ownerId = userIds[userIdx % userIds.length];
      userIdx += 1 + Math.floor(Math.random() * 2);
      
      const ownerCity = CITIES[userIdx % CITIES.length];
      const images = getItemImages(category, i);
      
      const views = Math.floor(Math.random() * 500) + 10;
      const likes = Math.floor(Math.random() * Math.min(views, 50));
      
      const daysAgo = Math.floor(Math.random() * 90);
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      try {
        await client.query(`
          INSERT INTO public.items (
            id, title, description, category, condition,
            estimated_value, images, owner_id, created_at,
            updated_at, status, location, views, likes
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4,
            $5, $6, $7, $8::timestamptz,
            $8::timestamptz, 'active', $9, $10, $11
          )
        `, [
          item.title,
          item.description,
          category,
          item.condition,
          item.value,
          images,
          ownerId,
          createdAt,
          ownerCity,
          views,
          likes
        ]);
        totalItems++;
        catSuccess++;
      } catch (err) {
        console.error(`    ✗ Ürün hatası (${item.title}):`, err.message);
      }
    }
    console.log(`    ✓ ${catSuccess}/${items.length} ürün eklendi`);
  }

  console.log(`\n✅ Toplam ${totalItems} ürün başarıyla oluşturuldu!`);

  // ============================================================
  // STEP 5: Final statistics
  // ============================================================
  const finalUsers = await client.query('SELECT count(*) FROM public.users');
  const finalItems = await client.query('SELECT count(*) FROM public.items WHERE status = \'active\'');
  const byCategory = await client.query(`
    SELECT category, count(*) as cnt 
    FROM public.items 
    WHERE status = 'active' 
    GROUP BY category 
    ORDER BY cnt DESC
  `);
  const byCondition = await client.query(`
    SELECT condition, count(*) as cnt 
    FROM public.items 
    WHERE status = 'active' 
    GROUP BY condition 
    ORDER BY cnt DESC
  `);
  const topCities = await client.query(`
    SELECT location, count(*) as cnt 
    FROM public.users 
    WHERE location IS NOT NULL 
    GROUP BY location 
    ORDER BY cnt DESC 
    LIMIT 10
  `);

  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL İSTATİSTİKLER');
  console.log('='.repeat(50));
  console.log(`👤 Toplam kullanıcı: ${finalUsers.rows[0].count}`);
  console.log(`📦 Aktif ürün: ${finalItems.rows[0].count}`);
  console.log('\n📂 Kategorilere göre:');
  byCategory.rows.forEach(r => console.log(`   ${r.category}: ${r.cnt} ürün`));
  console.log('\n🏷️ Duruma göre:');
  byCondition.rows.forEach(r => console.log(`   ${r.condition}: ${r.cnt} ürün`));
  console.log('\n📍 En çok kullanıcı olan şehirler:');
  topCities.rows.forEach(r => console.log(`   ${r.location}: ${r.cnt} kullanıcı`));
  console.log('='.repeat(50));

  await client.end();
  console.log('\n✅ Seed işlemi tamamlandı! Veritabanı bağlantısı kapatıldı.');
}

seed().catch(err => {
  console.error('❌ FATAL ERROR:', err);
  client.end();
  process.exit(1);
});
