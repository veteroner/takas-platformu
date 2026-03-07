// ============================================================
// TAKAS PLATFORM - COMPREHENSIVE DATABASE SEED SCRIPT
// 100 Users + 120 Items with realistic Turkish content
// ============================================================

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

// ============================================================
// TURKISH NAME DATA
// ============================================================
const MALE_NAMES = [
  'Ahmet', 'Mehmet', 'Ali', 'Mustafa', 'Emre', 'Burak', 'Cem', 'Enes',
  'Fatih', 'Gökhan', 'Hakan', 'İbrahim', 'Kerem', 'Mert', 'Oğuz',
  'Onur', 'Serkan', 'Tolga', 'Uğur', 'Yusuf', 'Barış', 'Caner',
  'Doğan', 'Erdem', 'Ferhat', 'Hüseyin', 'Kaan', 'Can', 'Berk',
  'Arda', 'Taha', 'Umut', 'Volkan', 'Selim', 'Orhan', 'Deniz',
  'Furkan', 'Göktuğ', 'Halil', 'İlker', 'Koray', 'Levent', 'Murat',
  'Necati', 'Okan', 'Polat', 'Recep', 'Sinan', 'Tayfun', 'Yasin'
];

const FEMALE_NAMES = [
  'Ayşe', 'Fatma', 'Elif', 'Zeynep', 'Merve', 'Selin', 'İrem',
  'Büşra', 'Ceren', 'Derya', 'Esra', 'Gamze', 'Hande', 'İpek',
  'Kübra', 'Melis', 'Naz', 'Özge', 'Pelin', 'Seda', 'Sibel',
  'Tuğçe', 'Yasemin', 'Aslı', 'Başak', 'Cansu', 'Dilara', 'Ece',
  'Fulya', 'Gizem', 'Hilal', 'Kardelen', 'Lale', 'Mine', 'Nihan',
  'Nur', 'Özlem', 'Rüya', 'Simge', 'Şeyma', 'Tuba', 'Yağmur',
  'Zara', 'Berra', 'Duygu', 'Ebru', 'Feride', 'Gül', 'Hazal', 'Ilgın'
];

const LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım',
  'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan',
  'Çetin', 'Kara', 'Koç', 'Kurt', 'Özkan', 'Şimşek', 'Polat',
  'Korkmaz', 'Erdoğan', 'Aktaş', 'Güneş', 'Tekin', 'Tan', 'Uçar',
  'Acar', 'Aksoy', 'Bal', 'Bayrak', 'Ceylan', 'Duran', 'Ergin',
  'Güler', 'Işık', 'Kaplan', 'Toprak', 'Sarı', 'Tunç', 'Uzun',
  'Varol', 'Zengin', 'Alkan', 'Başaran', 'Coşkun', 'Dinç', 'Eker'
];

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

// ============================================================
// IMAGE URLS (Open source - Unsplash, Picsum, Pravatar)
// ============================================================

// Using picsum.photos with category-descriptive seeds for reliability
function getItemImages(category, index) {
  const seeds = {
    clothing: [
      'tshirt', 'jacket', 'dress', 'jeans', 'sneakers', 'coat', 'sweater',
      'skirt', 'shirt', 'hoodie', 'blazer', 'scarf', 'hat', 'shorts', 'vest',
      'cardigan', 'blouse', 'trousers', 'boots', 'sandals'
    ],
    toys: [
      'lego', 'puzzle', 'doll', 'teddy', 'boardgame', 'rccar', 'blocks',
      'train', 'robot', 'plush', 'playset', 'marble', 'kite', 'figurine', 'yoyo'
    ],
    electronics: [
      'phone', 'headphone', 'tablet', 'gamepad', 'camera', 'speaker',
      'keyboard', 'mouse', 'monitor', 'charger', 'cable', 'earbuds',
      'powerbank', 'smartwatch', 'console'
    ],
    books: [
      'novel', 'textbook', 'comic', 'cookbook', 'history', 'science',
      'poetry', 'biography', 'children', 'art', 'travel', 'selfhelp',
      'mystery', 'fantasy', 'romance'
    ],
    sports: [
      'yogamat', 'dumbbell', 'racket', 'football', 'basketball', 'bicycle',
      'skateboard', 'helmet', 'gloves', 'bat', 'ball', 'net', 'rope',
      'weights', 'treadmill'
    ],
    home: [
      'lamp', 'vase', 'cushion', 'rug', 'mirror', 'clock', 'frame',
      'plant', 'candle', 'basket', 'shelf', 'curtain', 'towel', 'blanket', 'mug'
    ],
    other: [
      'backpack', 'wallet', 'sunglasses', 'umbrella', 'toolbox', 'guitar',
      'chess', 'binoculars', 'camping', 'fishing'
    ]
  };

  const catSeeds = seeds[category] || seeds.other;
  const baseSeed = catSeeds[index % catSeeds.length];
  const numImages = 2 + Math.floor(Math.random() * 3); // 2-4 images
  const images = [];
  
  for (let i = 0; i < numImages; i++) {
    images.push(`https://picsum.photos/seed/${baseSeed}_${category}_${index}_${i}/800/600`);
  }
  return images;
}

function getAvatar(email) {
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`;
}

// ============================================================
// ITEM DEFINITIONS - Realistic Turkish content
// ============================================================
const ITEMS_BY_CATEGORY = {
  clothing: [
    { title: 'Zara Erkek Slim Fit Beyaz Gömlek', description: 'Zara marka, M beden, sadece 2 kez giyildi. Slim fit kesim, %100 pamuk kumaş. İş görüşmeleri için ideal. Ütülenmiş ve temiz durumda.', condition: 'like-new', value: 350 },
    { title: 'Nike Air Force 1 Beyaz Spor Ayakkabı', description: '42 numara Nike Air Force 1 klasik beyaz. Orijinal kutusunda, faturası mevcut. Hafif kullanım izleri var ama genel durumu çok iyi.', condition: 'good', value: 800 },
    { title: 'Mango Kadın Trençkot - Bej', description: 'Mango marka S beden trençkot. Sonbahar/kış sezonu için ideal. Kemer detaylı, iç astarı saten. Bir sezon giyildi.', condition: 'like-new', value: 600 },
    { title: 'Levi\'s 501 Original Fit Kot Pantolon', description: 'Levi\'s 501 orijinal kesim, 32/32 beden, koyu mavi yıkama. Klasik Amerikan kot pantolonu. 3-4 kez giyildi.', condition: 'like-new', value: 500 },
    { title: 'Adidas Originals Hoodie - Siyah', description: 'Adidas Originals serisi, L beden, ikonik üç çizgili hoodie. İçi tüylü, kışlık. Çok rahat bir sweatshirt.', condition: 'good', value: 400 },
    { title: 'H&M Yazlık Çiçekli Elbise', description: 'H&M marka S beden midi boy elbise. Çiçek desenli, hafif kumaş, yaz ayları için ideal. Yıkanmış ama hiç giyilmedi.', condition: 'new', value: 250 },
    { title: 'Koton Erkek Kışlık Mont - Haki', description: 'Koton marka XL beden kışlık mont. Su geçirmez kumaş, kapüşonlu. Çok sıcak tutuyor, bu kış aldım ama bedeni büyük geldi.', condition: 'new', value: 700 },
    { title: 'Converse Chuck Taylor All Star', description: 'Converse klasik siyah, 39 numara, unisex. Yüksek bilekli model. Çok az kullanılmış, yıkanmış temiz durumda.', condition: 'good', value: 350 },
    { title: 'Kadın İpek Şal - Mavi Tonları', description: 'El yapımı ipek şal, 180x60 cm. Mavi ve turkuaz tonlarında, özel tasarım. Hediye geldi ama kullanmıyorum.', condition: 'new', value: 450 },
    { title: 'Defacto Erkek Polo Yaka Tişört 3\'lü Set', description: 'Defacto marka M beden, siyah-beyaz-lacivert polo yaka tişört seti. %100 pamuk, yazlık. Hiç giyilmedi, etiketleri üzerinde.', condition: 'new', value: 300 },
    { title: 'Pull&Bear Kadın Skinny Jean', description: 'Pull&Bear marka 36 beden, yüksek bel skinny jean. Koyu gri yıkama. Elastik kumaş, çok rahat. Bir sezon giyildi.', condition: 'good', value: 200 },
    { title: 'The North Face Polar Fleece Ceket', description: 'The North Face erkek M beden polar ceket, lacivert renk. Dağ gezileri ve outdoor aktiviteler için ideal. Hafif ama sıcak tutar.', condition: 'good', value: 550 },
    { title: 'Vakko Kadın Deri Çanta - Siyah', description: 'Vakko orijinal siyah deri omuz çantası. Orta boy, günlük kullanıma uygun. İç bölmeleri çok pratik. 1 yıllık.', condition: 'good', value: 900 },
    { title: 'Columbia Outdoor Yürüyüş Botu', description: 'Columbia Redmond III erkek bot, 43 numara. Waterproof, trekking için ideal. 2 dağ yürüyüşünde kullanıldı.', condition: 'like-new', value: 650 },
    { title: 'LC Waikiki Çocuk Kışlık Set', description: '5-6 yaş kışlık kıyafet seti: mont, kazak, pantolon. Çocuğum büyüdü, temiz ve bakımlı durumda.', condition: 'good', value: 350 },
    { title: 'Beymen Erkek Yün Kazak - Bordo', description: 'Beymen Club %100 merino yünü V yaka kazak, L beden. İtalyan kumaş, bordo renk. Çok şık ve sıcak. 2 kez giyildi.', condition: 'like-new', value: 750 },
    { title: 'Puma Kadın Tayt - Spor', description: 'Puma DryCell teknolojili spor taytı, S beden. Yüksek bel, cepli. Koşu ve yoga için ideal. 1 ay kullanıldı.', condition: 'like-new', value: 280 },
    { title: 'İpekyol Kadın Blazer Ceket', description: 'İpekyol marka 38 beden siyah blazer ceket. Oversize kesim, modern tasarım. İş ve günlük kombinler için mükemmel.', condition: 'good', value: 550 },
    { title: 'Erkek Vintage Deri Ceket', description: 'Hakiki deri erkek ceket, L beden, koyu kahverengi. 90\'lar vintage tarz. Çok karakterli bir parça, bakımlı durumda.', condition: 'fair', value: 800 },
    { title: 'Bebek Giyim Paketi 0-6 Ay', description: '15 parçalık bebek giyim seti: tulumlar, bodiler, şapkalar, patikler. Markalı ürünler (Chicco, Ebebek). Temiz, ütülenmiş.', condition: 'good', value: 400 },
  ],
  toys: [
    { title: 'LEGO City Polis Merkezi Seti (60316)', description: 'LEGO City Polis Merkezi, 668 parça. Tüm parçalar tam, kayıp yok. Kılavuz kitapçığı mevcut. 1 kez kuruldu.', condition: 'like-new', value: 600 },
    { title: 'Barbie Rüya Evi', description: '3 katlı, 8 odalı Barbie Rüya Evi. Mobilyaları ve aksesuarları dahil. Kızım büyüdü artık oynamıyor. Çok temiz durumda.', condition: 'good', value: 800 },
    { title: 'Hot Wheels 20\'li Araba Seti', description: 'Hot Wheels 20 adet metal oyuncak araba seti. Orijinal kutusu mevcut. Araba koleksiyonu başlatmak isteyenler için ideal.', condition: 'like-new', value: 350 },
    { title: 'Monopoly Türkiye Özel Edisyon', description: 'Monopoly Türkiye özel edisyon kutu oyunu. Tüm parçalar tam, kartlar sağlam. Aile oyun geceleri için harika!', condition: 'good', value: 200 },
    { title: 'Playmobil Korsan Gemisi', description: 'Playmobil 70411 Skull Pirate Ship. 132 parça, tüm figürler ve aksesuarlar dahil. Çocuğumun en sevdiği oyuncaktı.', condition: 'good', value: 500 },
    { title: 'Rubik Küp Koleksiyonu (3 adet)', description: '3x3, 4x4 ve Pyraminx Rubik küp seti. Speed cube modelleri, turnuva kalitesi. Bulmaca severler için harika set.', condition: 'like-new', value: 250 },
    { title: 'Bebek Oyun Matı - Eğitici', description: 'Piyano tuşlu bebek oyun matı, ışıklı ve sesli. 0-12 ay bebekler için ideal. Piller dahil. Temiz ve çalışır durumda.', condition: 'good', value: 300 },
    { title: 'Uzaktan Kumandalı Drone', description: 'Mini drone, HD kamera özellikli. 15 dk uçuş süresi, 100m menzil. Çantası ve yedek pervaneleri dahil. Başlangıç seviyesi için ideal.', condition: 'good', value: 700 },
    { title: 'Ahşap Tren Seti - 80 Parça', description: 'Doğal ahşap tren seti, boyalı ve toksik olmayan boya. Raylar, köprüler, binalar dahil. 3+ yaş, eğitici oyuncak.', condition: 'like-new', value: 400 },
    { title: 'Nerf Elite Blaster Seti', description: 'Nerf N-Strike Elite Disruptor + 30 adet yedek mermi. Orijinal kutu var. Çok az kullanıldı, mükemmel durumda.', condition: 'like-new', value: 350 },
    { title: 'Yapboz Koleksiyonu 1000 Parça (3 adet)', description: 'Ravensburger marka 3 adet 1000 parça yapboz: İstanbul manzarası, dünya haritası, Van Gogh tablosu. Hepsi tam parça.', condition: 'good', value: 300 },
    { title: 'Fisher-Price Eğitici Bloklar', description: 'Fisher-Price 50 parça renkli eğitici bloklar. Harf ve rakam baskılı, BPA-free plastik. 1-5 yaş arası çocuklar için.', condition: 'good', value: 200 },
    { title: 'Peluş Oyuncak Koleksiyonu', description: '5 adet büyük peluş oyuncak: ayı, tavşan, köpek, panda, unicorn. Hepsi yıkanmış ve hijyenik. Çocuk odasını süsler.', condition: 'good', value: 350 },
    { title: 'Scrabble Türkçe Orijinal', description: 'Mattel orijinal Türkçe Scrabble. Tüm harfler tam, tahta ve ayaklıklar sağlam. Kelime oyunu severler için.', condition: 'like-new', value: 180 },
    { title: 'Uzaktan Kumandalı Off-Road Araba', description: '1:16 ölçek 4WD off-road RC araba. Şarj edilebilir batarya, 30 dk kullanım süresi. Her zeminde gider.', condition: 'good', value: 450 },
  ],
  electronics: [
    { title: 'Apple AirPods Pro (2. Nesil)', description: 'Apple AirPods Pro 2. nesil, orijinal kutu ve şarj kablosu dahil. Aktif gürültü engelleme özellikli. 6 ay kullanıldı, garanti devam ediyor.', condition: 'like-new', value: 2500 },
    { title: 'Samsung Galaxy Tab A8 Tablet', description: 'Samsung Galaxy Tab A8, 10.5 inç, 64GB, Wi-Fi model. Kılıf ve ekran koruyucu hediye. Film izlemek ve çocuklar için ideal.', condition: 'good', value: 3000 },
    { title: 'JBL Flip 6 Bluetooth Hoparlör', description: 'JBL Flip 6 taşınabilir hoparlör, siyah renk. IP67 su geçirmez. 12 saat pil ömrü. Ses kalitesi mükemmel.', condition: 'like-new', value: 1500 },
    { title: 'PlayStation 5 DualSense Gamepad', description: 'PS5 DualSense kablosuz oyun kolu, beyaz. Haptic feedback ve adaptive trigger. Orijinal kutusu var. Çok az kullanıldı.', condition: 'like-new', value: 1200 },
    { title: 'Xiaomi Mi Band 8 Akıllı Bileklik', description: 'Xiaomi Mi Band 8, AMOLED ekran, SpO2 sensör, uyku takibi. Yedek kayışlarla birlikte. 3 ay kullanıldı.', condition: 'like-new', value: 600 },
    { title: 'Logitech MX Master 3S Mouse', description: 'Logitech MX Master 3S kablosuz mouse. Ergonomik tasarım, sessiz tıklama. USB-C şarj. Home office için en iyisi.', condition: 'good', value: 1000 },
    { title: 'Kindle Paperwhite (2023)', description: 'Amazon Kindle Paperwhite 11. nesil, 16GB. 6.8 inç ekran, su geçirmez. İçinde 50+ e-kitap yüklü. Kılıf hediye.', condition: 'like-new', value: 2000 },
    { title: 'Anker PowerCore 26800 Powerbank', description: 'Anker PowerCore 26800mAh powerbank. 3 USB çıkışlı, hızlı şarj destekli. Seyahat için vazgeçilmez.', condition: 'good', value: 500 },
    { title: 'Canon EOS M50 Mark II Aynasız Kamera', description: 'Canon EOS M50 Mark II, 15-45mm kit lens ile. 4K video, döner ekran, Wi-Fi. Vlog ve fotoğrafçılık için ideal.', condition: 'good', value: 8000 },
    { title: 'Apple Watch SE (2. Nesil) 40mm', description: 'Apple Watch SE 2. nesil, 40mm, midnight renk. GPS model. Orijinal kutu, şarj kablosu, ekstra kayışlar dahil.', condition: 'good', value: 4000 },
    { title: 'Marshall Stanmore II Bluetooth Hoparlör', description: 'Marshall Stanmore II, siyah. Retro tasarım, harika ses kalitesi. Ev ve ofis için mükemmel. 1 yıl kullanıldı.', condition: 'good', value: 3500 },
    { title: 'Nintendo Switch Lite - Turkuaz', description: 'Nintendo Switch Lite, turkuaz renk. Taşınabilir oyun konsolu. Kılıf ve 2 oyun kartı dahil. Çok temiz durumda.', condition: 'good', value: 3000 },
    { title: 'Sony WH-1000XM5 Kulaklık', description: 'Sony WH-1000XM5 kablosuz ANC kulaklık, gümüş renk. Aktif gürültü engelleme, 30 saat pil. Taşıma çantası dahil.', condition: 'like-new', value: 4500 },
    { title: 'Raspberry Pi 4 Starter Kit', description: 'Raspberry Pi 4 Model B 8GB RAM + kasa + fan + güç kaynağı + 64GB SD kart. Hobi projeleri için harika başlangıç seti.', condition: 'like-new', value: 1500 },
    { title: 'GoPro Hero 11 Black', description: 'GoPro Hero 11 Black aksiyon kamerası. 5.3K video, HyperSmooth 5.0. Su altı kılıfı, göğüs askısı, selfie çubuğu dahil.', condition: 'good', value: 5000 },
  ],
  books: [
    { title: 'Orhan Pamuk - İstanbul Hatıralar ve Şehir', description: 'Nobel ödüllü yazarımız Orhan Pamuk\'un İstanbul anlatısı. Yapı Kredi Yayınları, ciltli baskı. Kitap çok iyi durumda.', condition: 'like-new', value: 80 },
    { title: 'Yuval Noah Harari - Sapiens (Türkçe)', description: 'İnsan türünün kısa tarihi. Kolektif Kitap yayınları, güncel baskı. Çok akıcı ve düşündürücü. Bir kez okundu.', condition: 'good', value: 60 },
    { title: 'Harry Potter Serisi Tam Set (7 Kitap)', description: 'Harry Potter serisi Türkçe çeviri, Yapı Kredi Yayınları. 7 kitap tam set. Koleksiyonluk durumda, özel kutusu var.', condition: 'good', value: 500 },
    { title: 'Sabahattin Ali - Kürk Mantolu Madonna', description: 'Yapı Kredi Yayınları baskısı. Türk edebiyatının klasik eseri. Temiz ve bakımlı. Lise/üniversite öğrencileri için ideal.', condition: 'good', value: 35 },
    { title: 'İlber Ortaylı - Türklerin Tarihi', description: 'İlber Ortaylı\'nın kapsamlı Türk tarihi eseri. Kronik Kitap, ciltli. Tarih meraklıları için vazgeçilmez kaynak.', condition: 'like-new', value: 100 },
    { title: 'Çocuk Ansiklopedisi Seti (10 Cilt)', description: '10 ciltlik çocuk ansiklopedisi seti. Renkli resimli, büyük harfli. 7-12 yaş grubu için. Tüm ciltler eksiksiz.', condition: 'good', value: 300 },
    { title: 'Amin Maalouf - Semerkant', description: 'Amin Maalouf\'un tarihi romanı. Yapı Kredi Yayınları. Ömer Hayyam ve Haşhaşilerin hikayesi. Çok etkileyici bir kitap.', condition: 'good', value: 45 },
    { title: 'Dale Carnegie - İnsan İlişkilerinde Başarı', description: 'Kişisel gelişim klasiği. Türkçe çeviri, son baskı. İş hayatı ve sosyal ilişkiler için altın kurallar.', condition: 'good', value: 50 },
    { title: 'Türk Mutfağı - 500 Tarif', description: 'Kapsamlı Türk mutfağı kitabı. 500 geleneksel tarif, adım adım fotoğraflarla. Yemek yapmayı öğrenmek isteyenler için.', condition: 'like-new', value: 120 },
    { title: 'Antoine de Saint-Exupéry - Küçük Prens', description: 'Küçük Prens, orijinal çizimleriyle. Koleksiyonluk ciltli baskı, Türkçe. Her yaştan okuyucu için zamansız bir klasik.', condition: 'new', value: 75 },
    { title: 'Stephen Hawking - Zamanın Kısa Tarihi', description: 'Bilim tarihinin en popüler kitabı. Türkçe çeviri, Alfa Yayınları. Evrenin gizemlerini anlaşılır bir dille anlatıyor.', condition: 'good', value: 55 },
    { title: 'Elif Şafak - Aşk (10 Yıl Özel Baskısı)', description: 'Elif Şafak\'ın dünya çapında ses getiren romanı. Doğan Kitap özel baskısı. Mevlana ve Şems-i Tebrizi anlatısı.', condition: 'like-new', value: 65 },
    { title: 'Manga Seti - Naruto (1-20. Cilt)', description: 'Naruto manga serisi ilk 20 cilt. Türkçe çeviri, Gerekli Şeyler Yayınları. Anime/manga severler için. Tüm ciltler sağlam.', condition: 'good', value: 600 },
    { title: 'KPSS Hazırlık Seti 2025', description: '2025 KPSS tam hazırlık seti: Genel Yetenek, Genel Kültür, Eğitim Bilimleri. 3 yayınevinden derleme, soru bankalarıyla birlikte.', condition: 'good', value: 400 },
    { title: 'Stefan Zweig Seti (5 Kitap)', description: 'Stefan Zweig eserleri: Satranç, Bilinmeyen Kadının Mektubu, Sabırsız Yürek, Korku, Olağanüstü Bir Gece. İş Bankası Yayınları.', condition: 'like-new', value: 200 },
  ],
  sports: [
    { title: 'Yoga Matı + Blok + Kayış Seti', description: 'TPE yoga matı (6mm, kaymaz), 2 adet köpük blok, pamuk yoga kayışı. Başlangıç seti olarak ideal. 3 ay kullanıldı.', condition: 'like-new', value: 350 },
    { title: 'Wilson Pro Staff Tenis Raketi', description: 'Wilson Pro Staff 97, 315g. Kordajı yeni çekildi. Grip bandı yeni. İntermediate seviye oyuncular için mükemmel.', condition: 'good', value: 1200 },
    { title: 'Kettlebell Set (8kg + 12kg + 16kg)', description: '3 adet demir kettlebell seti: 8, 12 ve 16 kg. CrossFit ve fonksiyonel antrenman için. Kaplama sağlam, pas yok.', condition: 'good', value: 600 },
    { title: 'Adidas UCL Futbol Topu', description: 'Adidas UEFA Champions League resmi maç topu. FIFA Quality Pro onaylı. 2 maçta kullanıldı, çok iyi durumda.', condition: 'like-new', value: 400 },
    { title: 'Decathlon Kamp Çadırı 3 Kişilik', description: 'Quechua Fresh&Black 3 kişilik kamp çadırı. Karanlık iç mekan, kolay kurulum. 5 kamp gezisinde kullanıldı.', condition: 'good', value: 800 },
    { title: 'Bisiklet Kaskı + Eldiven + Gözlük', description: 'Yetişkin bisiklet kask seti: kask (L), yarım parmak eldiven, UV korumalı gözlük. Şehir içi ve dağ bisikleti için.', condition: 'good', value: 300 },
    { title: 'Direnç Bandı Seti (5\'li)', description: '5 farklı direnç seviyesinde latex bantlar. Çanta ve egzersiz rehberi dahil. Evde antrenman için harika. Yeni gibi.', condition: 'like-new', value: 200 },
    { title: 'Spalding NBA Basketbol Topu', description: 'Spalding NBA resmi maç topu replikası. İç ve dış mekan kullanımına uygun. Grip kalitesi mükemmel.', condition: 'good', value: 350 },
    { title: 'Koşu Ayakkabısı Asics Gel-Nimbus 25', description: 'Asics Gel-Nimbus 25, 43 numara. Gel teknolojili, uzun mesafe koşuları için. 200 km koşuldu, hala çok rahat.', condition: 'good', value: 900 },
    { title: 'Yüzme Seti - Gözlük + Bone + Kulak Tıkacı', description: 'Arena yüzme gözlüğü (anti-fog), silikon bone, kulak tıkacı seti. Havuz ve deniz için. Çantası dahil.', condition: 'like-new', value: 250 },
    { title: 'Pilates Reformer Mini', description: 'Taşınabilir pilates reformer, katlanabilir tasarım. Ayak kayışları ve spring seti dahil. Evde pilates yapanlar için ideal.', condition: 'good', value: 1500 },
    { title: 'Dağ Bisikleti - 26" Jant', description: '26 jant, 21 vites dağ bisikleti. Shimano vites grubu, disk fren. Bakımı yapıldı, lastikler yeni. Hafta sonu kullanımı.', condition: 'fair', value: 2000 },
    { title: 'Boks Eldiveni + Bandaj + Çanta', description: 'Venum 12oz boks eldiveni (kırmızı-siyah) + el bandajı (2 çift) + boks çantası. Boks başlangıç seti.', condition: 'good', value: 500 },
    { title: 'Kayak Gözlüğü Oakley', description: 'Oakley Flight Deck kayak gözlüğü. Anti-fog, UV korumalı, değiştirilebilir lens. Orijinal kutusu ve kılıfı var.', condition: 'like-new', value: 800 },
    { title: 'Elektrikli Scooter - Xiaomi Mi', description: 'Xiaomi Mi Electric Scooter 3, siyah. 30 km menzil, 25 km/h max hız. Çok az kullanıldı, pil sağlığı %95.', condition: 'like-new', value: 4000 },
  ],
  home: [
    { title: 'IKEA Billy Kitaplık - Beyaz', description: 'IKEA Billy kitaplık, 80x28x202 cm, beyaz renk. 6 raflı, ayarlanabilir. Çok sağlam, taşınma nedeniyle satıyorum.', condition: 'good', value: 500 },
    { title: 'Philips Hue Akıllı Aydınlatma Seti', description: 'Philips Hue Starter Kit: 3 ampul + Bridge. 16 milyon renk, uygulama kontrolü, sesli asistan uyumlu. Ortam aydınlatması için harika.', condition: 'like-new', value: 1200 },
    { title: 'Le Creuset Döküm Tencere 24cm', description: 'Le Creuset Signature döküm tencere, 24cm, kırmızı. Fırın ve ocak uyumlu. Yemeklere bambaşka lezzet katıyor.', condition: 'good', value: 2000 },
    { title: 'Dekoratif Ayna - Yuvarlak Altın Çerçeve', description: '60cm çapında yuvarlak dekoratif ayna. Altın metal çerçeve. Salon, yatak odası veya antre için şık aksesuar.', condition: 'new', value: 400 },
    { title: 'Kahve Makinesi - Nespresso Vertuo', description: 'Nespresso Vertuo Next kahve makinesi, siyah. Farklı fincan boyutları, süt köpürtücü dahil. 50 adet kapsül hediye.', condition: 'good', value: 1500 },
    { title: 'El Yapımı Kilim 120x180cm', description: 'Anadolu motifli el dokuması kilim. %100 yün, doğal boyalar. 120x180 cm. Salon veya yatak odası için otantik dekorasyon.', condition: 'good', value: 1000 },
    { title: 'Dyson V8 Şarjlı Süpürge', description: 'Dyson V8 Absolute kablosuz süpürge. 40 dk çalışma süresi. Tüm başlıkları mevcut. Halı ve sert zemin için.', condition: 'good', value: 2500 },
    { title: 'Monstera Deliciosa - Büyük Saksılı', description: 'Monstera Deliciosa (Swiss Cheese Plant), 120cm boyunda. Dekoratif seramik saksıda. Ev bitkisi severler için. Çok sağlıklı.', condition: 'good', value: 350 },
    { title: 'Dekoratif Mum Seti (6 adet)', description: 'Soya mumu, el yapımı, 6 farklı koku: vanilya, lavanta, tarçın, gül, okyanus, çam. Cam kavanozlarda. Hepsi yeni.', condition: 'new', value: 300 },
    { title: 'IKEA Poäng Koltuk + Tabure', description: 'IKEA Poäng sallanan koltuk + ayak taburesi. Huş ağacı çerçeve, gri kumaş minder. Okuma köşesi için mükemmel.', condition: 'good', value: 700 },
    { title: 'Mutfak Robot - Arzum Crust Mix', description: 'Arzum Crust Mix 1500W mutfak robotu. Hamur yoğurma, doğrama, karıştırma. Tüm aparatları mevcut. 6 ay kullanıldı.', condition: 'like-new', value: 800 },
    { title: 'Pamuk Nevresim Takımı - Çift Kişilik', description: 'English Home %100 pamuk saten nevresim takımı. Çift kişilik, beyaz-gri çizgili. 2 yastık kılıfı dahil. Yıkanmış ama kullanılmadı.', condition: 'new', value: 450 },
    { title: 'Vintage Ahşap Sehpa', description: 'El yapımı ahşap orta sehpa, ceviz kaplamalı. 90x50x45 cm. Retro/bohem tarz dekorasyona çok yakışır.', condition: 'fair', value: 600 },
    { title: 'Hava Temizleyici - Xiaomi Mi Air Purifier', description: 'Xiaomi Mi Air Purifier 3H, HEPA H13 filtre. 45m² alana kadar etkili. Uygulama kontrolü. Alerji hastaları için ideal.', condition: 'good', value: 1200 },
    { title: 'Seramik Tabak Seti 18 Parça', description: 'Kütahya Porselen el boyaması seramik tabak seti. 6 düz, 6 derin, 6 tatlı tabağı. Geleneksel Türk desenleri.', condition: 'like-new', value: 500 },
  ],
  other: [
    { title: 'Kanvas Sırt Çantası - Vintage', description: 'Su geçirmez kanvas sırt çantası, kahverengi-haki. Laptop bölmeli (15.6"), çok gözlü. Okul ve günlük kullanım için.', condition: 'good', value: 300 },
    { title: 'Ray-Ban Wayfarer Güneş Gözlüğü', description: 'Ray-Ban Original Wayfarer, siyah çerçeve, yeşil cam. Orijinal kutu ve kılıf. Klasik model, her yüze yakışır.', condition: 'like-new', value: 800 },
    { title: 'Ukulele - Soprano Başlangıç Seti', description: 'Soprano ukulele, maun ağacı. Taşıma çantası, yedek tel, akort cihazı, öğretici kitapçık dahil. Müzik başlangıcı için.', condition: 'like-new', value: 400 },
    { title: 'Satranç Takımı - Ahşap Turnuva Boy', description: 'Turnuva boy ahşap satranç takımı. Ağırlıklı taşlar, keçe tabanlı. Katlanır tahta 45x45 cm. Şık hediye.', condition: 'good', value: 350 },
    { title: 'Camping Lamba + Şarj İstasyonu', description: 'Solar şarjlı camping lambası, USB çıkışlı (telefon şarj edilebilir). 3 ışık modu, acil durum SOS. Kamp ve doğa sporları için.', condition: 'like-new', value: 250 },
    { title: 'Polaroid Now+ Fotoğraf Makinesi', description: 'Polaroid Now+ i-Type instant kamera, siyah. 5 lens filtresi dahil. Bluetooth bağlantılı. 1 paket film hediye.', condition: 'good', value: 1500 },
    { title: 'Deri Cüzdan - El Yapımı', description: 'El yapımı hakiki deri cüzdan, kahverengi. 8 kart bölmeli, para gözü, RFID korumalı. Hediye kutusu ile.', condition: 'new', value: 400 },
    { title: 'Swiss Army Çakı - Victorinox', description: 'Victorinox Swiss Army Huntsman çakı, kırmızı. 15 fonksiyon: bıçak, makas, tornavida, tirbuşon vb. Orijinal kutu ve kılıf.', condition: 'like-new', value: 350 },
    { title: 'Teleskop - Celestron StarSense', description: 'Celestron StarSense Explorer LT 80AZ teleskop. Telefon uygulamasıyla gökyüzü keşfi. Tripod dahil. Astronomi meraklıları için giriş modeli.', condition: 'good', value: 2000 },
    { title: 'Resim Seti - Yağlı Boya Başlangıç', description: '24 renk yağlı boya, 10 fırça, 3 tuval (30x40), palet, tiner, şövale. Resim yapmaya başlamak isteyenler için komple set.', condition: 'new', value: 500 },
  ]
};

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed() {
  await client.connect();
  console.log('✅ Veritabanına bağlanıldı!\n');

  // Check current counts
  const existingUsers = await client.query('SELECT count(*) FROM public.users');
  const existingItems = await client.query('SELECT count(*) FROM public.items');
  console.log(`📊 Mevcut durum: ${existingUsers.rows[0].count} kullanıcı, ${existingItems.rows[0].count} ürün\n`);

  // ============================================================
  // STEP 1: Create 100 users in auth.users
  // ============================================================
  console.log('👤 100 kullanıcı oluşturuluyor...');
  
  const userIds = [];
  const userEmails = [];
  const userNames = [];
  const usedEmails = new Set();

  for (let i = 0; i < 100; i++) {
    const isFemale = i >= 50;
    const firstNames = isFemale ? FEMALE_NAMES : MALE_NAMES;
    const firstName = firstNames[i % 50];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    
    // Create unique email
    let emailBase = `${firstName.toLowerCase().replace(/[ğüşıöç]/g, c => {
      const map = {'ğ':'g','ü':'u','ş':'s','ı':'i','ö':'o','ç':'c'};
      return map[c] || c;
    })}.${lastName.toLowerCase().replace(/[ğüşıöç]/g, c => {
      const map = {'ğ':'g','ü':'u','ş':'s','ı':'i','ö':'o','ç':'c'};
      return map[c] || c;
    })}`;
    let email = `${emailBase}@takazone.com`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${emailBase}${counter}@takazone.com`;
      counter++;
    }
    usedEmails.add(email);

    const city = CITIES[i % CITIES.length];
    const bio = BIOS[i % BIOS.length];
    const avatar = getAvatar(email);
    const rating = (3.5 + Math.random() * 1.5).toFixed(2); // 3.50 - 5.00
    const totalTrades = Math.floor(Math.random() * 20);

    // Random creation date in the last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    try {
      // Insert into auth.users
      const authResult = await client.query(`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password,
          email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
          created_at, updated_at, is_sso_user, is_anonymous
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          $1,
          crypt('TakasDemo2024!', gen_salt('bf')),
          $2::timestamptz,
          '{"provider": "email", "providers": ["email"]}'::jsonb,
          $3::jsonb,
          $2::timestamptz,
          $2::timestamptz,
          false,
          false
        )
        RETURNING id
      `, [email, createdAt, JSON.stringify({name: fullName, firstName, lastName})]);

      const userId = authResult.rows[0].id;
      userIds.push(userId);
      userEmails.push(email);
      userNames.push(fullName);

      // Update public.users with rich profile data (trigger already created basic entry)
      await client.query(`
        UPDATE public.users SET
          avatar = $2,
          bio = $3,
          location = $4,
          rating = $5,
          total_trades = $6,
          first_name = $7,
          last_name = $8,
          display_name = $9,
          updated_at = NOW()
        WHERE id = $1
      `, [userId, avatar, bio, city, rating, totalTrades, firstName, lastName, fullName]);

      if ((i + 1) % 10 === 0) {
        console.log(`  ✓ ${i + 1}/100 kullanıcı oluşturuldu`);
      }
    } catch (err) {
      console.error(`  ✗ Kullanıcı ${i + 1} (${email}) hatası:`, err.message);
    }
  }

  console.log(`\n✅ ${userIds.length} kullanıcı başarıyla oluşturuldu!\n`);

  // ============================================================
  // STEP 2: Create items distributed across users
  // ============================================================
  console.log('📦 Ürünler oluşturuluyor...');
  
  let totalItems = 0;
  let userIndex = 0;

  for (const [category, items] of Object.entries(ITEMS_BY_CATEGORY)) {
    console.log(`\n  📂 Kategori: ${category} (${items.length} ürün)`);
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // Distribute items across users (round-robin with some variation)
      const ownerId = userIds[userIndex % userIds.length];
      userIndex += 1 + Math.floor(Math.random() * 2); // Skip 1-2 users for variety
      
      const ownerCity = CITIES[userIndex % CITIES.length];
      const images = getItemImages(category, i);
      
      // Random views and likes
      const views = Math.floor(Math.random() * 500) + 10;
      const likes = Math.floor(Math.random() * Math.min(views, 50));
      
      // Random creation date in the last 3 months
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
            $5, $6, $7, $8,
            $8, 'active', $9, $10, $11
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
      } catch (err) {
        console.error(`    ✗ Ürün hatası (${item.title}):`, err.message);
      }
    }
    console.log(`    ✓ ${items.length} ürün eklendi`);
  }

  console.log(`\n✅ Toplam ${totalItems} ürün başarıyla oluşturuldu!`);

  // ============================================================
  // STEP 3: Final statistics
  // ============================================================
  const finalUsers = await client.query('SELECT count(*) FROM public.users');
  const finalItems = await client.query('SELECT count(*) FROM public.items');
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

  console.log('\n' + '='.repeat(50));
  console.log('📊 FINAL STATISTICS');
  console.log('='.repeat(50));
  console.log(`👤 Toplam kullanıcı: ${finalUsers.rows[0].count}`);
  console.log(`📦 Toplam ürün: ${finalItems.rows[0].count}`);
  console.log('\n📂 Kategorilere göre:');
  byCategory.rows.forEach(r => console.log(`   ${r.category}: ${r.cnt} ürün`));
  console.log('\n🏷️ Duruma göre:');
  byCondition.rows.forEach(r => console.log(`   ${r.cnt}: ${r.cnt} ürün`));
  console.log('='.repeat(50));

  await client.end();
  console.log('\n✅ Seed işlemi tamamlandı! Veritabanı bağlantısı kapatıldı.');
}

seed().catch(err => {
  console.error('❌ FATAL ERROR:', err);
  client.end();
  process.exit(1);
});
