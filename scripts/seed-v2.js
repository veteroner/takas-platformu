// ============================================================
// TAKAS PLATFORM - EXPANDED SEED V2
// Real product images from Unsplash + More users + More items
// ============================================================

const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

// Unsplash image helper
const U = (id, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

// ============================================================
// USER DATA
// ============================================================
const MALE_NAMES = [
  'Kağan', 'Alp', 'Doruk', 'Emir', 'Baran', 'Çağrı', 'Taylan',
  'Görkem', 'Atakan', 'Berkay', 'Cenk', 'Derin', 'Eymen', 'Firat',
  'Güney', 'Harun', 'İsmail', 'Kadir', 'Lütfi', 'Mahmut',
  'Nedim', 'Ogün', 'Poyraz', 'Rıza', 'Sarp', 'Taner', 'Utku',
  'Vedat', 'Yiğit', 'Zafer', 'Adem', 'Batuhan', 'Ceyhun', 'Devrim',
  'Eren', 'Ferit', 'Gürbüz', 'Haydar', 'İnan', 'Kenan', 'Latif',
  'Mazhar', 'Nadir', 'Oral', 'Refik', 'Semih', 'Tunahan', 'Ufuk',
  'Vefa', 'Yakup'
];

const FEMALE_NAMES = [
  'Azra', 'Buse', 'Ceyda', 'Damla', 'Eylül', 'Feyza', 'Gökçe',
  'Hira', 'Irmak', 'Jale', 'Kumsal', 'Lara', 'Meltem', 'Nehir',
  'Olcay', 'Pınar', 'Rana', 'Sevgi', 'Tülay', 'Ülkü', 'Vildan',
  'Yaren', 'Zühal', 'Arzu', 'Belgin', 'Cemre', 'Defne', 'Ezgi',
  'Filiz', 'Gonca', 'Havva', 'İnci', 'Kader', 'Leyla', 'Mehtap',
  'Nermin', 'Oya', 'Perihan', 'Rüveyda', 'Sevda', 'Tülin', 'Ümran',
  'Yıldız', 'Zeliha', 'Ayla', 'Bahar', 'Çiğdem', 'Didem', 'Esin', 'Ferda'
];

const LAST_NAMES = [
  'Albayrak', 'Bilgin', 'Candemir', 'Dağlı', 'Elmas', 'Fırtına',
  'Gökalp', 'Hatipoğlu', 'İncesu', 'Kabadayı', 'Liman', 'Mutlu',
  'Nalbantoğlu', 'Oğuztürk', 'Palabıyık', 'Sabancı', 'Taşkın',
  'Ulusoy', 'Yalçınkaya', 'Zorlu', 'Akbulut', 'Bozkurt', 'Candan',
  'Demirtaş', 'Eroğlu', 'Gençer', 'Harman', 'Karadeniz', 'Mercan',
  'Neşeli', 'Özkul', 'Peker', 'Savaş', 'Tuncer', 'Uysal', 'Vural',
  'Yavaş', 'Akarsu', 'Bulut', 'Çınar', 'Dalga', 'Ekinci', 'Güven',
  'Kutlu', 'Oruç', 'Pala', 'Sezer', 'Teke', 'Ünal', 'Yörük'
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
  'Minimalist yaşam tarzını benimsedim, takasa açığım',
  'İkinci el alışverişe bayılırım! Kaliteli ürünler paylaşıyorum',
  'Çocuklarımın büyüdüğü kıyafetleri ve oyuncakları takasa sunuyorum',
  'Teknoloji meraklısı, eski cihazlarımı takasa çıkarıyorum',
  'Kitap kurdu 📚 Okuduklarımı yeni sahipleriyle buluşturuyorum',
  'Spor tutkunu! Kullanmadığım ekipmanları değerlendiriyorum',
  'Ev dekorasyonu tutkunuyum, değiştirdiklerimi paylaşıyorum',
  'Vintage parça koleksiyoncusu, özel parçalar burada!',
  'Sürdürülebilir moda destekçisi ♻️',
  'Çevreci bir yaşam için takas en güzel yol 🌱',
  'Gardırop temizliği yapıyorum, güzel parçalar sizi bekliyor',
  'Çocuk giyim ve oyuncak takasına açığım 👶',
  'Benim fazlam senin ihtiyacın olabilir',
  'Hem tasarruf ediyorum hem çevreye katkı sağlıyorum',
  'Kullanılmayan eşyalara yeni bir hayat veriyorum ✨',
  'Alışveriş yerine takas! Hem ekonomik hem ekolojik',
  'Komşudan komşuya takas harika bir fikir!',
  'Moda değişir ama kalite kalır, kaliteli parçalarımı paylaşıyorum',
  'Hobi koleksiyonumu yeniliyorum, eski parçalar gidiyor 🎨',
  'Bebek ve çocuk ürünleri takasçısı 🍼',
  'Outdoor ve kamp ekipmanlarımı takas ediyorum ⛺',
  'Müzik aleti koleksiyonumu küçültüyorum 🎸',
  'Taşınıyorum, güzel eşyalara yeni ev arıyorum 🏠'
];

function turkishToAscii(str) {
  return str.replace(/[ğüşıöçĞÜŞİÖÇ]/g, c => {
    const map = { 'ğ':'g','ü':'u','ş':'s','ı':'i','ö':'o','ç':'c',
                  'Ğ':'G','Ü':'U','Ş':'S','İ':'I','Ö':'O','Ç':'C' };
    return map[c] || c;
  });
}

function getAvatar(email) {
  return `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`;
}

// ============================================================
// REAL PRODUCT IMAGES FROM UNSPLASH (curated per item)
// ============================================================
const ITEMS = [
  // ===================== CLOTHING (30) =====================
  {
    title: 'Zara Erkek Slim Fit Beyaz Gömlek',
    description: 'Zara marka, M beden, sadece 2 kez giyildi. Slim fit kesim, %100 pamuk kumaş. İş görüşmeleri için ideal.',
    category: 'clothing', condition: 'like-new', value: 350,
    images: [
      U('photo-1596755094514-f87e34085b2c'),
      U('photo-1598033129183-c4f50c736c10'),
      U('photo-1603252109303-2751441dd157'),
    ]
  },
  {
    title: 'Nike Air Force 1 Beyaz Spor Ayakkabı',
    description: '42 numara Nike Air Force 1 klasik beyaz. Orijinal kutusunda, faturası mevcut. Hafif kullanım izleri var.',
    category: 'clothing', condition: 'good', value: 800,
    images: [
      U('photo-1542291026-7eec264c27ff'),
      U('photo-1600269452121-4f2416e55c28'),
      U('photo-1595950653106-6c9ebd614d3a'),
    ]
  },
  {
    title: 'Mango Kadın Trençkot - Bej',
    description: 'Mango marka S beden trençkot. Sonbahar/kış sezonu için ideal. Kemer detaylı, iç astarı saten.',
    category: 'clothing', condition: 'like-new', value: 600,
    images: [
      U('photo-1544022613-e10091be389d'),
      U('photo-1591047139829-d91aecb6caea'),
      U('photo-1489987707025-afc232f7ea0f'),
    ]
  },
  {
    title: "Levi's 501 Original Fit Kot Pantolon",
    description: "Levi's 501 orijinal kesim, 32/32 beden, koyu mavi yıkama. Klasik kot pantolon. 3-4 kez giyildi.",
    category: 'clothing', condition: 'like-new', value: 500,
    images: [
      U('photo-1542272604-787c3835535d'),
      U('photo-1541099649105-f69ad21f3246'),
      U('photo-1582552938357-32b906df40cb'),
    ]
  },
  {
    title: 'Adidas Originals Hoodie - Siyah',
    description: 'Adidas Originals serisi, L beden, ikonik üç çizgili hoodie. İçi tüylü, kışlık.',
    category: 'clothing', condition: 'good', value: 400,
    images: [
      U('photo-1556821840-3a63f95609a7'),
      U('photo-1578768079470-f852748bc4ae'),
      U('photo-1614975059251-992f11792b9f'),
    ]
  },
  {
    title: 'H&M Yazlık Çiçekli Elbise',
    description: 'H&M marka S beden midi boy elbise. Çiçek desenli, hafif kumaş, yaz ayları için ideal.',
    category: 'clothing', condition: 'new', value: 250,
    images: [
      U('photo-1572804013309-59a88b7e92f1'),
      U('photo-1596783074918-c84cb06531ca'),
      U('photo-1612336307429-8a898d10e223'),
    ]
  },
  {
    title: 'Koton Erkek Kışlık Mont - Haki',
    description: 'Koton marka XL beden kışlık mont. Su geçirmez kumaş, kapüşonlu. Bedeni büyük geldi.',
    category: 'clothing', condition: 'new', value: 700,
    images: [
      U('photo-1544923246-77307dd270cb'),
      U('photo-1548883354-94bcfe321cbb'),
      U('photo-1557418669-b9212e5ac0f4'),
    ]
  },
  {
    title: 'Converse Chuck Taylor All Star',
    description: 'Converse klasik siyah, 39 numara, unisex. Yüksek bilekli model. Çok az kullanılmış.',
    category: 'clothing', condition: 'good', value: 350,
    images: [
      U('photo-1463100099107-aa0980c362e6'),
      U('photo-1607522370275-f14206abe5d3'),
      U('photo-1494496195158-c3becb4f2475'),
    ]
  },
  {
    title: 'İpek Şal - Mavi Tonları',
    description: 'El yapımı ipek şal, 180x60 cm. Mavi ve turkuaz tonlarında özel tasarım. Hediye geldi.',
    category: 'clothing', condition: 'new', value: 450,
    images: [
      U('photo-1601924638867-3a6de6b7a500'),
      U('photo-1606107557195-0e29a4b5b4aa'),
    ]
  },
  {
    title: "Defacto Erkek Polo Tişört 3'lü Set",
    description: 'Defacto M beden, siyah-beyaz-lacivert polo yaka tişört seti. %100 pamuk.',
    category: 'clothing', condition: 'new', value: 300,
    images: [
      U('photo-1586363104862-3a5e2ab60d99'),
      U('photo-1627225924765-552d49cf47ad'),
      U('photo-1581655353564-df123a1eb820'),
    ]
  },
  {
    title: 'The North Face Polar Fleece Ceket',
    description: 'The North Face erkek M beden polar ceket, lacivert. Outdoor için ideal. Hafif ama sıcak.',
    category: 'clothing', condition: 'good', value: 550,
    images: [
      U('photo-1591047139829-d91aecb6caea'),
      U('photo-1544923246-77307dd270cb'),
      U('photo-1551028719-00167b16eac5'),
    ]
  },
  {
    title: 'Vakko Kadın Deri Çanta - Siyah',
    description: 'Vakko orijinal siyah deri omuz çantası. Orta boy, günlük kullanıma uygun. 1 yıllık.',
    category: 'clothing', condition: 'good', value: 900,
    images: [
      U('photo-1548036328-c9fa89d128fa'),
      U('photo-1584917865442-de89df76afd3'),
      U('photo-1590874103328-eac38a683ce7'),
    ]
  },
  {
    title: 'Columbia Yürüyüş Botu - 43 Numara',
    description: 'Columbia Redmond III bot, waterproof. 2 dağ yürüyüşünde kullanıldı. Trekking için ideal.',
    category: 'clothing', condition: 'like-new', value: 650,
    images: [
      U('photo-1606107557195-0e29a4b5b4aa'),
      U('photo-1520639888713-7851133b1ed0'),
      U('photo-1542840410-3092f99611a3'),
    ]
  },
  {
    title: 'LC Waikiki Çocuk Kışlık Set - 5/6 Yaş',
    description: 'Kışlık kıyafet seti: mont, kazak, pantolon. Çocuğum büyüdü, temiz ve bakımlı.',
    category: 'clothing', condition: 'good', value: 350,
    images: [
      U('photo-1519238263530-99bdd11df2ea'),
      U('photo-1471286174890-9c112ffca5b4'),
      U('photo-1543854589-fdd4e2b91488'),
    ]
  },
  {
    title: 'Puma Kadın Spor Tayt',
    description: 'Puma DryCell S beden. Yüksek bel, cepli. Koşu ve yoga için ideal. 1 ay kullanıldı.',
    category: 'clothing', condition: 'like-new', value: 280,
    images: [
      U('photo-1506629082955-511b1aa562c8'),
      U('photo-1538805060514-97d9cc17730c'),
      U('photo-1518459031867-a89b944bffe4'),
    ]
  },
  {
    title: 'İpekyol Kadın Blazer Ceket',
    description: 'İpekyol 38 beden siyah oversize blazer. İş ve günlük kombinler için mükemmel.',
    category: 'clothing', condition: 'good', value: 550,
    images: [
      U('photo-1594938298603-c8148c4dae35'),
      U('photo-1591369822096-ffd140ec948f'),
      U('photo-1548624313-0396c75e4b1a'),
    ]
  },
  {
    title: 'Erkek Vintage Deri Ceket - L Beden',
    description: "Hakiki deri erkek ceket, koyu kahverengi. 90'lar vintage stil. Karakterli ve bakımlı.",
    category: 'clothing', condition: 'fair', value: 800,
    images: [
      U('photo-1551028719-00167b16eac5'),
      U('photo-1520975954732-35dd22299614'),
      U('photo-1521223890158-f9f7c3d5d504'),
    ]
  },
  {
    title: 'Bebek Giyim Paketi 0-6 Ay (15 Parça)',
    description: '15 parçalık bebek giyim seti: tulumlar, bodiler, şapkalar, patikler. Chicco, Ebebek markalı.',
    category: 'clothing', condition: 'good', value: 400,
    images: [
      U('photo-1522771930-78848d9293e8'),
      U('photo-1519689680058-324335c77eba'),
      U('photo-1515488042361-ee00e0ddd4e4'),
    ]
  },
  {
    title: 'New Balance 574 Spor Ayakkabı - Gri',
    description: 'New Balance 574 klasik gri, 41 numara. Retro stil, çok rahat. 2 ay giyildi.',
    category: 'clothing', condition: 'like-new', value: 700,
    images: [
      U('photo-1539185441755-769473a23570'),
      U('photo-1551107696-a4b0c5a0d9a2'),
      U('photo-1460353581641-37baddab0fa2'),
    ]
  },
  {
    title: 'Tommy Hilfiger Erkek Kazak - Lacivert',
    description: 'Tommy Hilfiger pamuklu kazak, L beden. Klasik logo detaylı. İş casual için mükemmel.',
    category: 'clothing', condition: 'good', value: 600,
    images: [
      U('photo-1576566588028-4147f3842f27'),
      U('photo-1614975059251-992f11792b9f'),
      U('photo-1578587018452-892bacefd3f2'),
    ]
  },
  {
    title: 'Kadın Keten Geniş Paça Pantolon - Beyaz',
    description: 'Yüksek bel keten pantolon, 38 beden. Yaz ayları için serin ve şık. Hiç giyilmedi.',
    category: 'clothing', condition: 'new', value: 300,
    images: [
      U('photo-1594633312681-425c7b97ccd1'),
      U('photo-1551854838-212c50b4c184'),
    ]
  },
  {
    title: 'Under Armour Erkek Spor Tişört',
    description: 'Under Armour HeatGear teknolojili spor tişörtü. L beden, nefes alan kumaş. Antrenmanda harika.',
    category: 'clothing', condition: 'like-new', value: 250,
    images: [
      U('photo-1581655353564-df123a1eb820'),
      U('photo-1627225924765-552d49cf47ad'),
    ]
  },
  {
    title: 'Dockers Erkek Chino Pantolon - Bej',
    description: 'Dockers slim tapered chino, 34 beden. Klasik bej renk, %98 pamuk. Ofis ve günlük kullanım.',
    category: 'clothing', condition: 'good', value: 400,
    images: [
      U('photo-1473966968600-fa801b869a1a'),
      U('photo-1624378439575-d8705ad7ae80'),
    ]
  },
  {
    title: 'Massimo Dutti Kadın Yün Palto - Siyah',
    description: 'Massimo Dutti %80 yün palto, 36 beden. Diz altı boy, zarif kesim. Bir kış giyildi.',
    category: 'clothing', condition: 'like-new', value: 1200,
    images: [
      U('photo-1539533113208-f6df8cc8b543'),
      U('photo-1544022613-e10091be389d'),
      U('photo-1520367445093-50dc08a59d9d'),
    ]
  },
  {
    title: 'Timberland Erkek Bot - Sarı Nubuk',
    description: 'Timberland 6-inch Premium, 44 numara. Klasik sarı nubuk. Sağlam yapı, hafif kullanılmış.',
    category: 'clothing', condition: 'good', value: 900,
    images: [
      U('photo-1520639888713-7851133b1ed0'),
      U('photo-1606107557195-0e29a4b5b4aa'),
      U('photo-1608256246200-53e635b5b65f'),
    ]
  },
  {
    title: 'Kadın Spor Sütyeni Nike - 2li Set',
    description: 'Nike Dri-FIT spor sütyeni 2li paket, S beden. Orta destek. Yoga ve fitness için ideal.',
    category: 'clothing', condition: 'new', value: 350,
    images: [
      U('photo-1538805060514-97d9cc17730c'),
      U('photo-1518459031867-a89b944bffe4'),
    ]
  },
  {
    title: 'Erkek Keten Gömlek - Açık Mavi',
    description: 'Saf keten erkek gömlek, M beden. Yazlık, rahat kesim. Plaj ve tatil için mükemmel.',
    category: 'clothing', condition: 'like-new', value: 300,
    images: [
      U('photo-1596755094514-f87e34085b2c'),
      U('photo-1603252109303-2751441dd157'),
    ]
  },
  {
    title: 'GAP Erkek Jean Ceket - Mavi',
    description: 'GAP denim ceket, L beden. Klasik mavi yıkama. Her kombine uyum sağlar. Çok az giyildi.',
    category: 'clothing', condition: 'like-new', value: 500,
    images: [
      U('photo-1576995853123-5a10305d93c0'),
      U('photo-1551537482-f2075a1d41f2'),
    ]
  },
  {
    title: 'Çocuk Okul Forması Seti - 7/8 Yaş',
    description: 'Lacivert okul forması: pantolon, gömlek, yelek, kravat. Bir yıl giyildi, temiz durumda.',
    category: 'clothing', condition: 'good', value: 250,
    images: [
      U('photo-1503919545889-aef636e10ad4'),
      U('photo-1519238263530-99bdd11df2ea'),
    ]
  },
  {
    title: 'Kadın Triko Hırka - Oversize Krem',
    description: 'Yumuşak örme oversize hırka, standart beden. Krem renk, rahat ve şık. Sonbahar için ideal.',
    category: 'clothing', condition: 'good', value: 350,
    images: [
      U('photo-1434389677669-e08b4cda3a40'),
      U('photo-1576566588028-4147f3842f27'),
    ]
  },

  // ===================== TOYS (25) =====================
  {
    title: 'LEGO City Polis Merkezi Seti (60316)',
    description: 'LEGO City Polis Merkezi, 668 parça. Tüm parçalar tam, kayıp yok. Kılavuz mevcut.',
    category: 'toys', condition: 'like-new', value: 600,
    images: [
      U('photo-1587654780014-1cfbae5c6f5a'),
      U('photo-1560961911-ba7ef651a56c'),
      U('photo-1596854407944-bf87f6fdd49e'),
    ]
  },
  {
    title: 'Barbie Rüya Evi',
    description: '3 katlı, 8 odalı Barbie Rüya Evi. Mobilyaları ve aksesuarları dahil. Kızım büyüdü.',
    category: 'toys', condition: 'good', value: 800,
    images: [
      U('photo-1613682988402-a12e3c5e3e3e'),
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1566576912321-d58ddd7a6088'),
    ]
  },
  {
    title: "Hot Wheels 20'li Araba Seti",
    description: 'Hot Wheels 20 adet metal oyuncak araba. Orijinal kutu mevcut. Koleksiyon başlatmak için ideal.',
    category: 'toys', condition: 'like-new', value: 350,
    images: [
      U('photo-1594787318286-3d835c1d207f'),
      U('photo-1581235707960-35f13de9cfdb'),
      U('photo-1596461404969-9ae70f2830c1'),
    ]
  },
  {
    title: 'Monopoly Türkiye Özel Edisyon',
    description: 'Monopoly Türkiye edisyonu kutu oyunu. Tüm parçalar tam. Aile gecelerine harika!',
    category: 'toys', condition: 'good', value: 200,
    images: [
      U('photo-1610890716171-6b1bb98ffd09'),
      U('photo-1585504198199-20277593b94f'),
      U('photo-1632501641765-e568d28b0015'),
    ]
  },
  {
    title: 'Playmobil Korsan Gemisi',
    description: 'Playmobil 70411 Korsan Gemisi. 132 parça, tüm figürler ve aksesuarlar dahil.',
    category: 'toys', condition: 'good', value: 500,
    images: [
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1566576912321-d58ddd7a6088'),
    ]
  },
  {
    title: 'Rubik Küp Koleksiyonu (3 adet)',
    description: '3x3, 4x4 ve Pyraminx Rubik küp seti. Speed cube, turnuva kalitesi.',
    category: 'toys', condition: 'like-new', value: 250,
    images: [
      U('photo-1577401239170-897942555fb3'),
      U('photo-1587654780014-1cfbae5c6f5a'),
    ]
  },
  {
    title: 'Bebek Oyun Matı - Eğitici Piyano',
    description: 'Piyano tuşlu bebek oyun matı, ışıklı ve sesli. 0-12 ay bebekler için ideal.',
    category: 'toys', condition: 'good', value: 300,
    images: [
      U('photo-1515488042361-ee00e0ddd4e4'),
      U('photo-1596461404969-9ae70f2830c1'),
    ]
  },
  {
    title: 'DJI Mini Drone - Başlangıç Seti',
    description: 'Mini drone, HD kamera. 15 dk uçuş, 100m menzil. Çanta ve yedek pervaneler dahil.',
    category: 'toys', condition: 'good', value: 700,
    images: [
      U('photo-1507582020474-9a35b7d455d9'),
      U('photo-1473968512647-3e447244af8f'),
      U('photo-1524143986875-3b098d78b363'),
    ]
  },
  {
    title: 'Ahşap Tren Seti - 80 Parça',
    description: 'Doğal ahşap tren seti. Raylar, köprüler, binalar dahil. 3+ yaş. Eğitici.',
    category: 'toys', condition: 'like-new', value: 400,
    images: [
      U('photo-1596461404969-9ae70f2830c1'),
      U('photo-1558618666-fcd25c85f7e7'),
    ]
  },
  {
    title: 'Nerf Elite Blaster + 30 Mermi',
    description: 'Nerf N-Strike Elite Disruptor + 30 yedek mermi. Orijinal kutu var.',
    category: 'toys', condition: 'like-new', value: 350,
    images: [
      U('photo-1566576912321-d58ddd7a6088'),
      U('photo-1560961911-ba7ef651a56c'),
    ]
  },
  {
    title: 'Ravensburger 1000 Parça Yapboz (3 adet)',
    description: 'İstanbul manzarası, dünya haritası, Van Gogh yapboz seti. Hepsi tam parça.',
    category: 'toys', condition: 'good', value: 300,
    images: [
      U('photo-1606503153255-59d6e4e3e6f1'),
      U('photo-1494059980473-813e73ee784b'),
    ]
  },
  {
    title: 'Fisher-Price Eğitici Blok Seti',
    description: 'Fisher-Price 50 parça renkli eğitici bloklar. Harf ve rakam baskılı. 1-5 yaş.',
    category: 'toys', condition: 'good', value: 200,
    images: [
      U('photo-1596461404969-9ae70f2830c1'),
      U('photo-1515488042361-ee00e0ddd4e4'),
    ]
  },
  {
    title: 'Peluş Oyuncak Koleksiyonu (5 adet)',
    description: 'Büyük peluş seti: ayı, tavşan, köpek, panda, unicorn. Hepsi yıkanmış ve hijyenik.',
    category: 'toys', condition: 'good', value: 350,
    images: [
      U('photo-1559715541-5daf8a0296d0'),
      U('photo-1563901935883-cb61f5d49be4'),
    ]
  },
  {
    title: 'Scrabble Türkçe Orijinal',
    description: 'Mattel orijinal Türkçe Scrabble. Tüm harfler tam, tahta sağlam.',
    category: 'toys', condition: 'like-new', value: 180,
    images: [
      U('photo-1585504198199-20277593b94f'),
      U('photo-1610890716171-6b1bb98ffd09'),
    ]
  },
  {
    title: '4WD Off-Road RC Araba',
    description: '1:16 ölçek 4WD RC araba. Şarj edilebilir, 30 dk kullanım. Her zeminde gider.',
    category: 'toys', condition: 'good', value: 450,
    images: [
      U('photo-1581235707960-35f13de9cfdb'),
      U('photo-1594787318286-3d835c1d207f'),
    ]
  },
  {
    title: 'LEGO Technic Yarış Arabası',
    description: 'LEGO Technic 42138 Ford Mustang Shelby GT500. 544 parça, koleksiyonluk.',
    category: 'toys', condition: 'like-new', value: 550,
    images: [
      U('photo-1587654780014-1cfbae5c6f5a'),
      U('photo-1560961911-ba7ef651a56c'),
      U('photo-1596854407944-bf87f6fdd49e'),
    ]
  },
  {
    title: 'Çocuk Mutfak Seti - Ahşap',
    description: 'Ahşap oyuncak mutfak seti: ocak, fırın, tezgah, mutfak aletleri. 3-8 yaş.',
    category: 'toys', condition: 'good', value: 600,
    images: [
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1566576912321-d58ddd7a6088'),
    ]
  },
  {
    title: 'UNO + Skip-Bo Kart Oyunu Seti',
    description: 'UNO ve Skip-Bo kart oyunları orijinal kutusu ile. Aile ve arkadaş buluşmalarına.',
    category: 'toys', condition: 'good', value: 120,
    images: [
      U('photo-1610890716171-6b1bb98ffd09'),
      U('photo-1632501641765-e568d28b0015'),
    ]
  },
  {
    title: 'Magnetik Yapı Blokları 100 Parça',
    description: 'Manyetik yapı blokları, 100 parça farklı şekiller. STEM eğitimi için harika. 3+ yaş.',
    category: 'toys', condition: 'like-new', value: 350,
    images: [
      U('photo-1596461404969-9ae70f2830c1'),
      U('photo-1515488042361-ee00e0ddd4e4'),
      U('photo-1587654780014-1cfbae5c6f5a'),
    ]
  },
  {
    title: 'Çocuk Bisikleti 16 Jant - Kırmızı',
    description: '16 jant çocuk bisikleti, 4-7 yaş arası. Yardımcı tekerlekler dahil. Bakımlı, az kullanılmış.',
    category: 'toys', condition: 'good', value: 500,
    images: [
      U('photo-1532298229144-0ec0c57515c7'),
      U('photo-1485965120184-e220f721d03e'),
    ]
  },
  {
    title: 'Bebek Beşik Mobili - Müzikli',
    description: 'Dönen müzikli bebek mobili. Hayvan figürlü, pastel renkler. Pilli, 3 melodi.',
    category: 'toys', condition: 'like-new', value: 200,
    images: [
      U('photo-1515488042361-ee00e0ddd4e4'),
      U('photo-1566576912321-d58ddd7a6088'),
    ]
  },
  {
    title: 'Telescope Çocuk Bilim Seti',
    description: 'Çocuk teleskopu + mikroskop + pusula bilim keşif seti. 8+ yaş. Eğitici ve eğlenceli.',
    category: 'toys', condition: 'good', value: 400,
    images: [
      U('photo-1564053489984-317bbd824340'),
      U('photo-1532094349884-543bc11b234d'),
    ]
  },
  {
    title: 'Play-Doh 24 Renk Oyun Hamuru',
    description: 'Play-Doh Mega Pack 24 renk oyun hamuru. Hiç açılmamış, orijinal kutusunda.',
    category: 'toys', condition: 'new', value: 180,
    images: [
      U('photo-1560961911-ba7ef651a56c'),
      U('photo-1596461404969-9ae70f2830c1'),
    ]
  },
  {
    title: 'Risk Strateji Oyunu - Türkçe',
    description: 'Risk Dünya Hakimiyeti strateji oyunu. Türkçe kurallar, tüm parçalar mevcut.',
    category: 'toys', condition: 'good', value: 250,
    images: [
      U('photo-1610890716171-6b1bb98ffd09'),
      U('photo-1585504198199-20277593b94f'),
    ]
  },
  {
    title: 'Çocuk Tabletli Çizim Tahtası LCD',
    description: '12 inç LCD çizim tahtası, renkli ekran. Pil ile çalışır, tekrar kullanılabilir.',
    category: 'toys', condition: 'like-new', value: 150,
    images: [
      U('photo-1596461404969-9ae70f2830c1'),
      U('photo-1558618666-fcd25c85f7e7'),
    ]
  },

  // ===================== ELECTRONICS (25) =====================
  {
    title: 'Apple AirPods Pro (2. Nesil)',
    description: 'AirPods Pro 2, orijinal kutu ve şarj kablosu. Aktif gürültü engelleme. 6 ay kullanıldı, garanti var.',
    category: 'electronics', condition: 'like-new', value: 2500,
    images: [
      U('photo-1600294037681-c80b4cb5b434'),
      U('photo-1606741965326-cb990ae36fce'),
      U('photo-1588423771073-b8903fde1c68'),
    ]
  },
  {
    title: 'Samsung Galaxy Tab A8 Tablet',
    description: 'Samsung Tab A8, 10.5 inç, 64GB, Wi-Fi. Kılıf ve ekran koruyucu hediye.',
    category: 'electronics', condition: 'good', value: 3000,
    images: [
      U('photo-1544244015-0df4b3ffc6b0'),
      U('photo-1561154464-82e9aab32f4d'),
      U('photo-1585790050230-5dd28404ccb9'),
    ]
  },
  {
    title: 'JBL Flip 6 Bluetooth Hoparlör',
    description: 'JBL Flip 6, siyah. IP67 su geçirmez. 12 saat pil. Ses kalitesi harika.',
    category: 'electronics', condition: 'like-new', value: 1500,
    images: [
      U('photo-1608043152269-423dbba4e7e1'),
      U('photo-1545454675-3531b543be5d'),
      U('photo-1589003077984-894e133dabab'),
    ]
  },
  {
    title: 'PS5 DualSense Kablosuz Oyun Kolu',
    description: 'PS5 DualSense gamepad, beyaz. Haptic feedback, adaptive trigger. Orijinal kutu.',
    category: 'electronics', condition: 'like-new', value: 1200,
    images: [
      U('photo-1606144042614-b2417e99c4e3'),
      U('photo-1592840496694-26d035b52b48'),
      U('photo-1605901309584-818e25960a8f'),
    ]
  },
  {
    title: 'Xiaomi Mi Band 8 Akıllı Bileklik',
    description: 'Mi Band 8, AMOLED ekran, SpO2 sensörü, uyku takibi. Yedek kayışlar dahil.',
    category: 'electronics', condition: 'like-new', value: 600,
    images: [
      U('photo-1575311373937-040b8e1fd5b6'),
      U('photo-1523395243481-163f8f6155ab'),
    ]
  },
  {
    title: 'Logitech MX Master 3S Mouse',
    description: 'Logitech MX Master 3S kablosuz mouse. Ergonomik, sessiz tıklama, USB-C şarj.',
    category: 'electronics', condition: 'good', value: 1000,
    images: [
      U('photo-1527864550417-7fd91fc51a46'),
      U('photo-1615663245857-ac93bb7c39e7'),
    ]
  },
  {
    title: 'Kindle Paperwhite (2023)',
    description: 'Kindle Paperwhite 11. nesil, 16GB. 6.8 inç, su geçirmez. 50+ e-kitap yüklü.',
    category: 'electronics', condition: 'like-new', value: 2000,
    images: [
      U('photo-1594980596870-8aa52a78f64c'),
      U('photo-1612108660816-8166b2e01791'),
    ]
  },
  {
    title: 'Anker PowerCore 26800 Powerbank',
    description: 'Anker 26800mAh powerbank. 3 USB çıkış, hızlı şarj. Seyahat için vazgeçilmez.',
    category: 'electronics', condition: 'good', value: 500,
    images: [
      U('photo-1609091839311-d5365f9ff1c5'),
      U('photo-1585338107529-13afc5f02586'),
    ]
  },
  {
    title: 'Canon EOS M50 II Aynasız Kamera',
    description: 'Canon EOS M50 II, 15-45mm kit lens. 4K video, döner ekran. Vlog için ideal.',
    category: 'electronics', condition: 'good', value: 8000,
    images: [
      U('photo-1516035069371-29a1b244cc32'),
      U('photo-1502920917128-1aa500764cbd'),
      U('photo-1510127034890-ba27508e9f1c'),
    ]
  },
  {
    title: 'Apple Watch SE (2. Nesil) 40mm',
    description: 'Apple Watch SE 2, 40mm midnight. GPS model. Orijinal kutu, ekstra kayışlar dahil.',
    category: 'electronics', condition: 'good', value: 4000,
    images: [
      U('photo-1546868871-af0de0ae72be'),
      U('photo-1434493789847-2a75b0eb6001'),
      U('photo-1551816230-ef5deaed4a26'),
    ]
  },
  {
    title: 'Marshall Stanmore II Hoparlör',
    description: 'Marshall Stanmore II Bluetooth, siyah. Retro tasarım, muhteşem ses. 1 yıl kullanıldı.',
    category: 'electronics', condition: 'good', value: 3500,
    images: [
      U('photo-1545454675-3531b543be5d'),
      U('photo-1608043152269-423dbba4e7e1'),
    ]
  },
  {
    title: 'Nintendo Switch Lite - Turkuaz',
    description: 'Nintendo Switch Lite turkuaz. Taşınabilir konsol. Kılıf ve 2 oyun kartı dahil.',
    category: 'electronics', condition: 'good', value: 3000,
    images: [
      U('photo-1578303512597-81e6cc155b3e'),
      U('photo-1605901309584-818e25960a8f'),
      U('photo-1612287230202-1ff1d85d1bdf'),
    ]
  },
  {
    title: 'Sony WH-1000XM5 Kulaklık',
    description: 'Sony WH-1000XM5 ANC kulaklık, gümüş. 30 saat pil, aktif gürültü engelleme.',
    category: 'electronics', condition: 'like-new', value: 4500,
    images: [
      U('photo-1583394838336-acd977736f90'),
      U('photo-1546435770-a3e426bf472b'),
      U('photo-1505740420928-5e560c06d30e'),
    ]
  },
  {
    title: 'GoPro Hero 11 Black Aksiyon Kamera',
    description: 'GoPro Hero 11, 5.3K video, HyperSmooth 5.0. Su altı kılıfı, aksesuar seti dahil.',
    category: 'electronics', condition: 'good', value: 5000,
    images: [
      U('photo-1526170375885-4d8ecf77b99f'),
      U('photo-1516035069371-29a1b244cc32'),
    ]
  },
  {
    title: 'Raspberry Pi 4 Starter Kit',
    description: 'Raspberry Pi 4 8GB + kasa + fan + güç kaynağı + 64GB SD. Hobi projeleri için.',
    category: 'electronics', condition: 'like-new', value: 1500,
    images: [
      U('photo-1629654297299-c8506221ca97'),
      U('photo-1518770660439-4636190af475'),
    ]
  },
  {
    title: 'Bose SoundLink Mini II Hoparlör',
    description: 'Bose SoundLink Mini II Special Edition, gümüş. Kompakt ama güçlü ses. 10 saat pil.',
    category: 'electronics', condition: 'good', value: 1800,
    images: [
      U('photo-1608043152269-423dbba4e7e1'),
      U('photo-1589003077984-894e133dabab'),
    ]
  },
  {
    title: 'iPad Air (5. Nesil) 64GB',
    description: 'iPad Air 5, M1 çip, 64GB, mor renk. Apple Pencil 2 destekli. Çok az kullanıldı.',
    category: 'electronics', condition: 'like-new', value: 8000,
    images: [
      U('photo-1544244015-0df4b3ffc6b0'),
      U('photo-1585790050230-5dd28404ccb9'),
      U('photo-1561154464-82e9aab32f4d'),
    ]
  },
  {
    title: 'Mechanical Keyboard - Keychron K2',
    description: 'Keychron K2 V2 mekanik klavye, Gateron Brown switch. RGB, kablosuz/kablolu.',
    category: 'electronics', condition: 'like-new', value: 1200,
    images: [
      U('photo-1587829741301-dc798b83add3'),
      U('photo-1595225476474-87563907a212'),
    ]
  },
  {
    title: 'Samsung Galaxy Buds 2 Pro',
    description: 'Galaxy Buds2 Pro, siyah. ANC, 360 Audio. Orijinal kutu ve ek kulak lastikleri.',
    category: 'electronics', condition: 'good', value: 1500,
    images: [
      U('photo-1590658268037-6bf12f032f55'),
      U('photo-1606741965326-cb990ae36fce'),
    ]
  },
  {
    title: 'DJI Osmo Mobile 6 Gimbal',
    description: 'DJI OM 6 smartphone gimbal stabilizer. Manyetik bağlantı, 3 eksenli. Video çekim için.',
    category: 'electronics', condition: 'like-new', value: 1800,
    images: [
      U('photo-1526170375885-4d8ecf77b99f'),
      U('photo-1502920917128-1aa500764cbd'),
    ]
  },
  {
    title: 'LG 27" 4K IPS Monitör',
    description: 'LG 27UL500, 27 inç 4K IPS. HDR10, %95 DCI-P3 renk gamı. Grafik tasarım ve video edit.',
    category: 'electronics', condition: 'good', value: 4000,
    images: [
      U('photo-1527443224154-c4a3942d3acf'),
      U('photo-1593640408182-31c70c8268f5'),
    ]
  },
  {
    title: 'Fujifilm Instax Mini 12 Fotoğraf Makinesi',
    description: 'Instax Mini 12, pembe. Anında baskı fotoğraf makinesi. 20 adet film hediye.',
    category: 'electronics', condition: 'like-new', value: 800,
    images: [
      U('photo-1526170375885-4d8ecf77b99f'),
      U('photo-1516035069371-29a1b244cc32'),
    ]
  },
  {
    title: 'Xbox Series S Oyun Konsolu',
    description: 'Xbox Series S beyaz. 1 kontrol kolu, HDMI kablo. 2 dijital oyun hediye.',
    category: 'electronics', condition: 'good', value: 5000,
    images: [
      U('photo-1605901309584-818e25960a8f'),
      U('photo-1612287230202-1ff1d85d1bdf'),
      U('photo-1606144042614-b2417e99c4e3'),
    ]
  },
  {
    title: 'Philips OneBlade Pro Tıraş Makinesi',
    description: 'Philips OneBlade Pro QP6520. Tıraş, trim, şekillendirme. Şarj standı, 4 tarak dahil.',
    category: 'electronics', condition: 'like-new', value: 600,
    images: [
      U('photo-1621607505115-a363e37dd6e4'),
      U('photo-1585386959984-a4155224a1ad'),
    ]
  },
  {
    title: 'TP-Link Mesh Wi-Fi 6 Sistemi (3lü)',
    description: 'TP-Link Deco X60 3lü mesh WiFi 6 sistemi. Tüm evi kapsayan hızlı internet.',
    category: 'electronics', condition: 'good', value: 2500,
    images: [
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1518770660439-4636190af475'),
    ]
  },

  // ===================== BOOKS (25) =====================
  {
    title: 'Orhan Pamuk - İstanbul Hatıralar ve Şehir',
    description: 'Nobel ödüllü yazarımızın İstanbul anlatısı. Yapı Kredi, ciltli baskı. Çok iyi durumda.',
    category: 'books', condition: 'like-new', value: 80,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1512820790803-83ca734da794'),
    ]
  },
  {
    title: 'Yuval Noah Harari - Sapiens (Türkçe)',
    description: 'İnsan türünün kısa tarihi. Kolektif Kitap, güncel baskı. Bir kez okundu.',
    category: 'books', condition: 'good', value: 60,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'Harry Potter Serisi Tam Set (7 Kitap)',
    description: 'HP serisi Türkçe çeviri, YKY. 7 kitap tam set, koleksiyonluk. Özel kutu dahil.',
    category: 'books', condition: 'good', value: 500,
    images: [
      U('photo-1618666012174-83b441c0bc76'),
      U('photo-1512820790803-83ca734da794'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'Sabahattin Ali - Kürk Mantolu Madonna',
    description: 'Türk edebiyatı klasiği. Yapı Kredi Yayınları. Temiz ve bakımlı durumda.',
    category: 'books', condition: 'good', value: 35,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1543002588-bfa74002ed7e'),
    ]
  },
  {
    title: 'İlber Ortaylı - Türklerin Tarihi',
    description: 'İlber Ortaylı kapsamlı tarih eseri. Kronik Kitap, ciltli. Tarih meraklıları için.',
    category: 'books', condition: 'like-new', value: 100,
    images: [
      U('photo-1512820790803-83ca734da794'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'Çocuk Ansiklopedisi (10 Cilt)',
    description: '10 ciltlik çocuk ansiklopedisi. Renkli resimli. 7-12 yaş. Tüm ciltler eksiksiz.',
    category: 'books', condition: 'good', value: 300,
    images: [
      U('photo-1481627834876-b7833e8f5570'),
      U('photo-1507842217343-583bb7270b66'),
    ]
  },
  {
    title: 'Küçük Prens - Koleksiyonluk Ciltli',
    description: 'Saint-Exupéry Küçük Prens, orijinal çizimleriyle. Ciltli Türkçe baskı. Zamansız klasik.',
    category: 'books', condition: 'new', value: 75,
    images: [
      U('photo-1543002588-bfa74002ed7e'),
      U('photo-1544947950-fa07a98d237f'),
    ]
  },
  {
    title: 'Stephen Hawking - Zamanın Kısa Tarihi',
    description: 'Bilim tarihinin en popüler kitabı. Alfa Yayınları Türkçe çeviri. Anlaşılır dil.',
    category: 'books', condition: 'good', value: 55,
    images: [
      U('photo-1495446815901-a7297e633e8d'),
      U('photo-1512820790803-83ca734da794'),
    ]
  },
  {
    title: 'Elif Şafak - Aşk (Özel Baskı)',
    description: 'Elif Şafak bestseller romanı. Doğan Kitap özel baskı. Mevlana ve Şems hikayesi.',
    category: 'books', condition: 'like-new', value: 65,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1543002588-bfa74002ed7e'),
    ]
  },
  {
    title: 'Manga - Naruto (1-20. Cilt)',
    description: 'Naruto manga ilk 20 cilt, Türkçe çeviri. Gerekli Şeyler. Tüm ciltler sağlam.',
    category: 'books', condition: 'good', value: 600,
    images: [
      U('photo-1618666012174-83b441c0bc76'),
      U('photo-1512820790803-83ca734da794'),
    ]
  },
  {
    title: 'Stefan Zweig Seti (5 Kitap)',
    description: 'Satranç, Bilinmeyen Kadının Mektubu, Sabırsız Yürek, Korku, Olağanüstü Bir Gece. İş Bankası.',
    category: 'books', condition: 'like-new', value: 200,
    images: [
      U('photo-1495446815901-a7297e633e8d'),
      U('photo-1507842217343-583bb7270b66'),
    ]
  },
  {
    title: 'Türk Mutfağı - 500 Tarif Kitabı',
    description: 'Kapsamlı Türk mutfağı kitabı. 500 tarif, adım adım fotoğraflı. Yemek severler için.',
    category: 'books', condition: 'like-new', value: 120,
    images: [
      U('photo-1466637574441-749b8f19452f'),
      U('photo-1490645935967-10de6ba17061'),
    ]
  },
  {
    title: 'Dale Carnegie - İnsan İlişkilerinde Başarı',
    description: 'Kişisel gelişim klasiği. Türkçe çeviri son baskı. İş hayatı için altın kurallar.',
    category: 'books', condition: 'good', value: 50,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'KPSS Hazırlık Seti 2026',
    description: '2026 KPSS tam set: Genel Yetenek, Genel Kültür, Eğitim Bilimleri. 3 yayınevi derleme.',
    category: 'books', condition: 'good', value: 400,
    images: [
      U('photo-1481627834876-b7833e8f5570'),
      U('photo-1456513080510-7bf3a84b82f8'),
    ]
  },
  {
    title: 'Dostoyevski - Suç ve Ceza',
    description: 'İş Bankası Kültür Yayınları. Dünya edebiyatı başyapıtı. Tam ve sansürsüz çeviri.',
    category: 'books', condition: 'good', value: 45,
    images: [
      U('photo-1543002588-bfa74002ed7e'),
      U('photo-1512820790803-83ca734da794'),
    ]
  },
  {
    title: 'Çizgili Defter + Planner Seti',
    description: 'Moleskine tarzı A5 defter (3 adet) + 2026 planner. Yazma ve planlama için.',
    category: 'books', condition: 'new', value: 150,
    images: [
      U('photo-1531346878377-a5be20888e57'),
      U('photo-1456513080510-7bf3a84b82f8'),
    ]
  },
  {
    title: 'Gabriel Garcia Marquez - Yüzyıllık Yalnızlık',
    description: 'Can Yayınları, Türkçe çeviri. Latin Amerika edebiyatının başyapıtı. Harika okundu.',
    category: 'books', condition: 'good', value: 50,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'Çocuk Kitapları Paketi (20 Kitap)',
    description: '20 adet çocuk hikaye kitabı, 3-8 yaş. Çeşitli yayınevleri. Renkli resimli, büyük punto.',
    category: 'books', condition: 'good', value: 250,
    images: [
      U('photo-1512820790803-83ca734da794'),
      U('photo-1507842217343-583bb7270b66'),
      U('photo-1481627834876-b7833e8f5570'),
    ]
  },
  {
    title: 'Japonca Öğrenme Seti (3 Kitap + CD)',
    description: 'Japonca başlangıç seti: Genki I, II + Kanji çalışma kitabı. CD ve çalışma kağıtları dahil.',
    category: 'books', condition: 'good', value: 350,
    images: [
      U('photo-1456513080510-7bf3a84b82f8'),
      U('photo-1481627834876-b7833e8f5570'),
    ]
  },
  {
    title: 'Ahmet Ümit - Beyoğlu Rapsodisi',
    description: 'Ahmet Ümit polisiye romanı. Everest Yayınları. İstanbul dedektif hikayesi.',
    category: 'books', condition: 'good', value: 40,
    images: [
      U('photo-1543002588-bfa74002ed7e'),
      U('photo-1544947950-fa07a98d237f'),
    ]
  },
  {
    title: 'Felsefe Tarihi Seti - Cevizkabuğu',
    description: 'Felsefe tarihi 4 cilt set: Antik Yunan, Orta Çağ, Modern, Çağdaş. Giriş düzeyi.',
    category: 'books', condition: 'like-new', value: 200,
    images: [
      U('photo-1507842217343-583bb7270b66'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },
  {
    title: 'İngilizce-Türkçe Oxford Sözlük',
    description: 'Oxford Advanced Learner\'s Dictionary + Türkçe karşılıklar. 100.000+ kelime.',
    category: 'books', condition: 'good', value: 80,
    images: [
      U('photo-1481627834876-b7833e8f5570'),
      U('photo-1456513080510-7bf3a84b82f8'),
    ]
  },
  {
    title: 'Nazım Hikmet - Bütün Şiirleri',
    description: 'Nazım Hikmet koleksiyonluk ciltli baskı, tüm şiirler. Yapı Kredi Yayınları.',
    category: 'books', condition: 'like-new', value: 120,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1543002588-bfa74002ed7e'),
    ]
  },
  {
    title: 'Yoga ve Meditasyon Rehberi',
    description: 'Başlangıçtan ileri seviyeye yoga rehberi. 200+ pozisyon fotoğraflı, meditasyon teknikleri.',
    category: 'books', condition: 'new', value: 90,
    images: [
      U('photo-1544947950-fa07a98d237f'),
      U('photo-1512820790803-83ca734da794'),
    ]
  },
  {
    title: 'Oğuz Atay - Tutunamayanlar',
    description: 'Türk edebiyatının başyapıtı. İletişim Yayınları. Postmodern Türk romanının öncüsü.',
    category: 'books', condition: 'good', value: 55,
    images: [
      U('photo-1543002588-bfa74002ed7e'),
      U('photo-1495446815901-a7297e633e8d'),
    ]
  },

  // ===================== SPORTS (25) =====================
  {
    title: 'Yoga Matı + Blok + Kayış Seti',
    description: 'TPE yoga matı (6mm, kaymaz), 2 köpük blok, pamuk kayış. 3 ay kullanıldı.',
    category: 'sports', condition: 'like-new', value: 350,
    images: [
      U('photo-1544367567-0f2fcb009e0b'),
      U('photo-1518611012118-696072aa579a'),
    ]
  },
  {
    title: 'Wilson Pro Staff Tenis Raketi',
    description: 'Wilson Pro Staff 97, 315g. Kordajı yeni çekildi. Intermediate oyuncular için.',
    category: 'sports', condition: 'good', value: 1200,
    images: [
      U('photo-1551773188-d63e5d51d916'),
      U('photo-1622279457486-62dcc4a431d6'),
    ]
  },
  {
    title: 'Kettlebell Set (8kg + 12kg + 16kg)',
    description: '3 adet demir kettlebell. CrossFit ve fonksiyonel antrenman için. Pas yok.',
    category: 'sports', condition: 'good', value: 600,
    images: [
      U('photo-1517963879433-6ad2b056d712'),
      U('photo-1534438327276-14e5300c3a48'),
    ]
  },
  {
    title: 'Adidas UCL Futbol Topu',
    description: 'Adidas Champions League resmi maç topu. FIFA Quality Pro. 2 maçta kullanıldı.',
    category: 'sports', condition: 'like-new', value: 400,
    images: [
      U('photo-1575361204480-aadea25e6e68'),
      U('photo-1552667466-07770ae110d0'),
    ]
  },
  {
    title: 'Quechua Kamp Çadırı 3 Kişilik',
    description: 'Fresh&Black kamp çadırı. Karanlık iç mekan, kolay kurulum. 5 kamp gezisinde kullanıldı.',
    category: 'sports', condition: 'good', value: 800,
    images: [
      U('photo-1504280390367-361c6d9f38f4'),
      U('photo-1478131143081-80f7f84ca84d'),
    ]
  },
  {
    title: 'Bisiklet Kaskı + Eldiven + Gözlük Seti',
    description: 'Yetişkin bisiklet kask seti (L). Yarım parmak eldiven, UV gözlük.',
    category: 'sports', condition: 'good', value: 300,
    images: [
      U('photo-1557687790-902ede39cda3'),
      U('photo-1485965120184-e220f721d03e'),
    ]
  },
  {
    title: "Direnç Bandı Seti (5'li)",
    description: '5 direnç seviyesinde latex bantlar. Çanta ve egzersiz rehberi dahil.',
    category: 'sports', condition: 'like-new', value: 200,
    images: [
      U('photo-1598289431512-b97b0917affc'),
      U('photo-1517963879433-6ad2b056d712'),
    ]
  },
  {
    title: 'Spalding NBA Basketbol Topu',
    description: 'Spalding NBA replika. İç ve dış mekan uyumlu. Grip mükemmel.',
    category: 'sports', condition: 'good', value: 350,
    images: [
      U('photo-1546519638-68e109498ffc'),
      U('photo-1519861531473-9200262188bf'),
    ]
  },
  {
    title: 'Asics Gel-Nimbus 25 Koşu Ayakkabısı',
    description: 'Asics Gel-Nimbus 25, 43 numara. Uzun mesafe için. 200 km koşuldu, hala çok rahat.',
    category: 'sports', condition: 'good', value: 900,
    images: [
      U('photo-1542291026-7eec264c27ff'),
      U('photo-1460353581641-37baddab0fa2'),
    ]
  },
  {
    title: 'Yüzme Seti - Arena',
    description: 'Arena yüzme gözlüğü (anti-fog), silikon bone, kulak tıkacı. Çantası dahil.',
    category: 'sports', condition: 'like-new', value: 250,
    images: [
      U('photo-1530549387789-4c1017266635'),
      U('photo-1519315901367-f34ff9154487'),
    ]
  },
  {
    title: 'Dağ Bisikleti - 26" Shimano',
    description: '26 jant, 21 vites. Shimano vites grubu, disk fren. Bakımı yapıldı, lastikler yeni.',
    category: 'sports', condition: 'fair', value: 2000,
    images: [
      U('photo-1485965120184-e220f721d03e'),
      U('photo-1532298229144-0ec0c57515c7'),
      U('photo-1571068316344-75bc76f77890'),
    ]
  },
  {
    title: 'Venum Boks Eldiveni + Bandaj',
    description: 'Venum 12oz boks eldiveni kırmızı-siyah + el bandajı 2 çift. Başlangıç seti.',
    category: 'sports', condition: 'good', value: 500,
    images: [
      U('photo-1549719386-74dfcbf7dbed'),
      U('photo-1517438322307-e67111335449'),
    ]
  },
  {
    title: 'Oakley Kayak Gözlüğü',
    description: 'Oakley Flight Deck. Anti-fog, UV korumalı, değiştirilebilir lens. Orijinal kutu.',
    category: 'sports', condition: 'like-new', value: 800,
    images: [
      U('photo-1551698618-1dfe5d97d256'),
      U('photo-1565992441121-4367c2967103'),
    ]
  },
  {
    title: 'Xiaomi Elektrikli Scooter',
    description: 'Xiaomi Mi Scooter 3, siyah. 30 km menzil, 25 km/h max. Az kullanıldı, pil %95.',
    category: 'sports', condition: 'like-new', value: 4000,
    images: [
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1605559424843-9e4c228bf1c2'),
    ]
  },
  {
    title: 'Pilates Reformer Mini',
    description: 'Taşınabilir pilates reformer. Katlanabilir, ayak kayışları ve spring seti dahil.',
    category: 'sports', condition: 'good', value: 1500,
    images: [
      U('photo-1518611012118-696072aa579a'),
      U('photo-1544367567-0f2fcb009e0b'),
    ]
  },
  {
    title: 'Trekking Çubuğu Çifti - Karbon',
    description: 'Karbon fiber trekking çubukları, ayarlanabilir boy. Dağ yürüyüşü için hafif ve sağlam.',
    category: 'sports', condition: 'like-new', value: 400,
    images: [
      U('photo-1551632811-561732d1e306'),
      U('photo-1504280390367-361c6d9f38f4'),
    ]
  },
  {
    title: 'Reebok Halter Seti 20kg',
    description: 'Reebok halter çubuğu + 20kg ağırlık plaka seti (2x5kg, 4x2.5kg). Ev antrenmanı için.',
    category: 'sports', condition: 'good', value: 700,
    images: [
      U('photo-1534438327276-14e5300c3a48'),
      U('photo-1517963879433-6ad2b056d712'),
    ]
  },
  {
    title: 'Kamp Uyku Tulumu -10°C',
    description: 'Uyku tulumu, konfor -10°C. Mumya modeli, ultra hafif. Dağ kampı için. Taşıma çantası.',
    category: 'sports', condition: 'good', value: 500,
    images: [
      U('photo-1504280390367-361c6d9f38f4'),
      U('photo-1478131143081-80f7f84ca84d'),
    ]
  },
  {
    title: 'Badminton Raket Seti (2 Raket + 6 Top)',
    description: 'Yonex Badminton set: 2 raket, 6 plastik top, taşıma çantası. Ev bahçesi için.',
    category: 'sports', condition: 'like-new', value: 300,
    images: [
      U('photo-1551773188-d63e5d51d916'),
      U('photo-1622279457486-62dcc4a431d6'),
    ]
  },
  {
    title: 'Dalış Maskesi + Şnorkel Full Face',
    description: 'Full face dalış maskesi + şnorkel. 180° görüş alanı. GoPro montaj noktası. S/M beden.',
    category: 'sports', condition: 'like-new', value: 350,
    images: [
      U('photo-1530549387789-4c1017266635'),
      U('photo-1519315901367-f34ff9154487'),
    ]
  },
  {
    title: 'Atlama İpi + Egzersiz Bandı Seti',
    description: 'Çelik telli hızlı atlama ipi + 3lü booty band seti. HIIT ve kardiyo için.',
    category: 'sports', condition: 'new', value: 150,
    images: [
      U('photo-1598289431512-b97b0917affc'),
      U('photo-1517963879433-6ad2b056d712'),
    ]
  },
  {
    title: 'Ping Pong Masa Tenisi Seti',
    description: 'Portatif masa tenisi ağı + 2 raket + 6 top. Herhangi bir masaya monte edilebilir.',
    category: 'sports', condition: 'like-new', value: 250,
    images: [
      U('photo-1551773188-d63e5d51d916'),
      U('photo-1609710228159-0fa9bd7c0827'),
    ]
  },
  {
    title: 'Foam Roller + Masaj Topu Seti',
    description: 'EPP foam roller (60cm) + lacrosse masaj topu + dikenli masaj topu. Kas gevşetme.',
    category: 'sports', condition: 'good', value: 200,
    images: [
      U('photo-1544367567-0f2fcb009e0b'),
      U('photo-1598289431512-b97b0917affc'),
    ]
  },
  {
    title: 'Tenis Topu Kutusu (72 Top)',
    description: 'Wilson Championship tenis topu, 24 tüp x 3 top. Turnuva kalitesi. Kulüp/antrenör için.',
    category: 'sports', condition: 'new', value: 600,
    images: [
      U('photo-1551773188-d63e5d51d916'),
      U('photo-1622279457486-62dcc4a431d6'),
    ]
  },
  {
    title: 'Spor Çantası Nike Brasilia XL',
    description: 'Nike Brasilia XL spor çantası, siyah. Ayakkabı bölmesi, su geçirmez taban. Çok geniş.',
    category: 'sports', condition: 'like-new', value: 350,
    images: [
      U('photo-1553062407-98eeb64c6a62'),
      U('photo-1622260614153-03223fb72052'),
    ]
  },

  // ===================== HOME (25) =====================
  {
    title: 'IKEA Billy Kitaplık - Beyaz',
    description: 'IKEA Billy kitaplık, 80x28x202 cm. 6 raflı, ayarlanabilir. Taşınma nedeniyle.',
    category: 'home', condition: 'good', value: 500,
    images: [
      U('photo-1507842217343-583bb7270b66'),
      U('photo-1594620302200-9a762244a156'),
    ]
  },
  {
    title: 'Philips Hue Akıllı Aydınlatma (3 Ampul)',
    description: 'Philips Hue Starter Kit: 3 ampul + Bridge. 16 milyon renk. Sesli asistan uyumlu.',
    category: 'home', condition: 'like-new', value: 1200,
    images: [
      U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1565814329452-e1432bc24bce'),
    ]
  },
  {
    title: 'Le Creuset Döküm Tencere 24cm',
    description: 'Le Creuset Signature döküm tencere, kırmızı. Fırın ve ocak uyumlu. Harika lezzet.',
    category: 'home', condition: 'good', value: 2000,
    images: [
      U('photo-1556909114-f6e7ad7d3136'),
      U('photo-1584990347449-a5d9f800d72b'),
    ]
  },
  {
    title: 'Dekoratif Ayna - Yuvarlak Altın',
    description: '60cm yuvarlak dekoratif ayna, altın metal çerçeve. Salon veya antre için şık.',
    category: 'home', condition: 'new', value: 400,
    images: [
      U('photo-1618220179428-22790b461013'),
      U('photo-1586023492125-27b2c045efd7'),
    ]
  },
  {
    title: 'Nespresso Vertuo Kahve Makinesi',
    description: 'Nespresso Vertuo Next, siyah. Süt köpürtücü dahil. 50 kapsül hediye.',
    category: 'home', condition: 'good', value: 1500,
    images: [
      U('photo-1517668808822-9ebb02f2a0e6'),
      U('photo-1495474472287-4d71bcdd2085'),
    ]
  },
  {
    title: 'El Yapımı Anadolu Kilimi 120x180',
    description: 'Anadolu motifli el dokuması kilim. %100 yün, doğal boyalar. Otantik dekorasyon.',
    category: 'home', condition: 'good', value: 1000,
    images: [
      U('photo-1600166898405-da9535204843'),
      U('photo-1558618666-fcd25c85f7e7'),
    ]
  },
  {
    title: 'Dyson V8 Şarjlı Süpürge',
    description: 'Dyson V8 Absolute kablosuz süpürge. 40 dk çalışma. Tüm başlıkları mevcut.',
    category: 'home', condition: 'good', value: 2500,
    images: [
      U('photo-1558317374-067fb5f30001'),
      U('photo-1563453392212-326f5e854473'),
    ]
  },
  {
    title: 'Monstera Deliciosa Büyük Saksılı',
    description: 'Monstera Deliciosa, 120cm boyunda. Dekoratif seramik saksıda. Çok sağlıklı bitki.',
    category: 'home', condition: 'good', value: 350,
    images: [
      U('photo-1459411552884-841db9b3cc2a'),
      U('photo-1453904300235-0f2f60b15b5d'),
    ]
  },
  {
    title: 'El Yapımı Soya Mum Seti (6 adet)',
    description: '6 farklı koku: vanilya, lavanta, tarçın, gül, okyanus, çam. Cam kavanozlarda.',
    category: 'home', condition: 'new', value: 300,
    images: [
      U('photo-1602607135030-8e2a8673f9fd'),
      U('photo-1603006905003-be475563bc59'),
    ]
  },
  {
    title: 'IKEA Poäng Koltuk + Tabure',
    description: 'IKEA Poäng sallanan koltuk + ayak taburesi. Huş ağacı, gri kumaş. Okuma köşesi.',
    category: 'home', condition: 'good', value: 700,
    images: [
      U('photo-1555041469-a586c61ea9bc'),
      U('photo-1586023492125-27b2c045efd7'),
    ]
  },
  {
    title: 'Arzum 1500W Mutfak Robotu',
    description: 'Arzum Crust Mix mutfak robotu. Yoğurma, doğrama, karıştırma. Tüm aparatlar. 6 ay.',
    category: 'home', condition: 'like-new', value: 800,
    images: [
      U('photo-1556909114-f6e7ad7d3136'),
      U('photo-1556909172-54557c7e4fb7'),
    ]
  },
  {
    title: 'Pamuk Saten Nevresim Takımı - Çift Kişilik',
    description: '%100 pamuk saten, çift kişilik. 2 yastık kılıfı dahil. Beyaz-gri çizgili.',
    category: 'home', condition: 'new', value: 450,
    images: [
      U('photo-1522771739844-6a9f6d5f14af'),
      U('photo-1505693416388-ac5ce068fe85'),
    ]
  },
  {
    title: 'Vintage Ceviz Sehpa',
    description: 'El yapımı ahşap orta sehpa, ceviz kaplama. 90x50x45 cm. Retro dekor için ideal.',
    category: 'home', condition: 'fair', value: 600,
    images: [
      U('photo-1555041469-a586c61ea9bc'),
      U('photo-1618220179428-22790b461013'),
    ]
  },
  {
    title: 'Xiaomi Hava Temizleyici 3H',
    description: 'Mi Air Purifier 3H, HEPA H13 filtre. 45m² alan. Alerji hastaları için ideal.',
    category: 'home', condition: 'good', value: 1200,
    images: [
      U('photo-1558317374-067fb5f30001'),
      U('photo-1563453392212-326f5e854473'),
    ]
  },
  {
    title: 'Kütahya Porselen Tabak Seti 18 Parça',
    description: 'El boyaması seramik set: 6 düz, 6 derin, 6 tatlı. Geleneksel Türk desenleri.',
    category: 'home', condition: 'like-new', value: 500,
    images: [
      U('photo-1556909114-f6e7ad7d3136'),
      U('photo-1584990347449-a5d9f800d72b'),
    ]
  },
  {
    title: 'Bambu Mutfak Düzenleyici Set',
    description: '5 parça bambu düzenleyici: çatal-bıçak, baharat rafı, kesme tahtası, tutacak, kaşıklık.',
    category: 'home', condition: 'new', value: 350,
    images: [
      U('photo-1556909114-f6e7ad7d3136'),
      U('photo-1556909172-54557c7e4fb7'),
    ]
  },
  {
    title: 'Kadife Kırlent Seti (4 adet)',
    description: '4 adet kadife kırlent: yeşil, bordo, hardal, krem. 45x45 cm. İç yastıklar dahil.',
    category: 'home', condition: 'new', value: 300,
    images: [
      U('photo-1586023492125-27b2c045efd7'),
      U('photo-1555041469-a586c61ea9bc'),
    ]
  },
  {
    title: 'Türk Kahvesi Seti - Bakır',
    description: 'El yapımı bakır cezve seti: 3 farklı boy cezve, 6 kahve fincanı, tepsi. Osmanlı motifli.',
    category: 'home', condition: 'good', value: 450,
    images: [
      U('photo-1517668808822-9ebb02f2a0e6'),
      U('photo-1495474472287-4d71bcdd2085'),
    ]
  },
  {
    title: 'Ahşap Duvar Saati - Minimal',
    description: '40cm çapında ahşap duvar saati. Rakamsız minimal tasarım, sessiz mekanizma.',
    category: 'home', condition: 'like-new', value: 250,
    images: [
      U('photo-1618220179428-22790b461013'),
      U('photo-1586023492125-27b2c045efd7'),
    ]
  },
  {
    title: 'Çift Kişilik Pamuk Battaniye',
    description: 'Doğal pamuk örgü battaniye, 200x220 cm. Krem renk. Koltuk ve yatak için.',
    category: 'home', condition: 'good', value: 350,
    images: [
      U('photo-1522771739844-6a9f6d5f14af'),
      U('photo-1505693416388-ac5ce068fe85'),
    ]
  },
  {
    title: 'Bialetti Moka Pot 6 Fincan',
    description: 'Bialetti Moka Express 6 fincan, klasik İtalyan espresso cezvesi. Ocak üstü.',
    category: 'home', condition: 'good', value: 400,
    images: [
      U('photo-1517668808822-9ebb02f2a0e6'),
      U('photo-1495474472287-4d71bcdd2085'),
    ]
  },
  {
    title: 'Halı - Modern Geometrik Desen',
    description: 'Modern geometrik desenli halı, 160x230 cm. Gri-beyaz-siyah tonlar. Salon veya ofis için.',
    category: 'home', condition: 'good', value: 800,
    images: [
      U('photo-1600166898405-da9535204843'),
      U('photo-1618220179428-22790b461013'),
    ]
  },
  {
    title: 'Philips Airfryer XXL',
    description: 'Philips Airfryer HD9285 XXL. 7.3L kapasite. Yağsız pişirme. 4 kişilik aileye.',
    category: 'home', condition: 'good', value: 2000,
    images: [
      U('photo-1556909114-f6e7ad7d3136'),
      U('photo-1556909172-54557c7e4fb7'),
    ]
  },
  {
    title: 'Çamaşır Kurutma Askısı - Paslanmaz',
    description: 'Paslanmaz çelik ayaklı kurutmalık, katlanabilir. Balkon veya banyo için ideal.',
    category: 'home', condition: 'like-new', value: 200,
    images: [
      U('photo-1558317374-067fb5f30001'),
      U('photo-1563453392212-326f5e854473'),
    ]
  },
  {
    title: 'Led Masa Lambası - Akıllı',
    description: 'Akıllı LED masa lambası. 5 renk tonu, 10 parlaklık seviyesi. USB şarj portu. Göz dostu.',
    category: 'home', condition: 'like-new', value: 300,
    images: [
      U('photo-1565814329452-e1432bc24bce'),
      U('photo-1558618666-fcd25c85f7e7'),
    ]
  },

  // ===================== OTHER (15) =====================
  {
    title: 'Kanvas Vintage Sırt Çantası',
    description: 'Su geçirmez kanvas sırt çantası. Laptop bölmeli (15.6"), çok gözlü. Okul ve günlük.',
    category: 'other', condition: 'good', value: 300,
    images: [
      U('photo-1553062407-98eeb64c6a62'),
      U('photo-1622260614153-03223fb72052'),
    ]
  },
  {
    title: 'Ray-Ban Wayfarer Güneş Gözlüğü',
    description: 'Ray-Ban Original Wayfarer, siyah çerçeve, yeşil cam. Orijinal kutu ve kılıf.',
    category: 'other', condition: 'like-new', value: 800,
    images: [
      U('photo-1572635196237-14b3f281503f'),
      U('photo-1511499767150-a48a237f0083'),
    ]
  },
  {
    title: 'Ukulele Soprano Başlangıç Seti',
    description: 'Soprano ukulele, maun ağacı. Çanta, yedek tel, akort cihazı, öğretici kitapçık dahil.',
    category: 'other', condition: 'like-new', value: 400,
    images: [
      U('photo-1510915361894-db8b60106cb1'),
      U('photo-1516924962500-2b4b3b99ea02'),
    ]
  },
  {
    title: 'Satranç Takımı - Ahşap Turnuva Boy',
    description: 'Ağırlıklı taşlar, keçe taban. Katlanır tahta 45x45 cm. Şık ve kaliteli.',
    category: 'other', condition: 'good', value: 350,
    images: [
      U('photo-1529699211952-734e80c4d42b'),
      U('photo-1560174038-da43ac74f01b'),
    ]
  },
  {
    title: 'Polaroid Now+ Fotoğraf Makinesi',
    description: 'Polaroid Now+ instant kamera, siyah. 5 lens filtresi. Bluetooth. 1 film paketi hediye.',
    category: 'other', condition: 'good', value: 1500,
    images: [
      U('photo-1526170375885-4d8ecf77b99f'),
      U('photo-1516035069371-29a1b244cc32'),
    ]
  },
  {
    title: 'El Yapımı Deri Cüzdan - RFID Korumalı',
    description: 'Hakiki deri cüzdan, kahverengi. 8 kartlık, para gözü, RFID koruma. Hediye kutusu.',
    category: 'other', condition: 'new', value: 400,
    images: [
      U('photo-1627123424574-724758594e93'),
      U('photo-1556742049-0cfed4f6a45d'),
    ]
  },
  {
    title: 'Victorinox Swiss Army Çakı',
    description: 'Victorinox Huntsman, kırmızı. 15 fonksiyon. Orijinal kutu ve kılıf.',
    category: 'other', condition: 'like-new', value: 350,
    images: [
      U('photo-1580870069867-74c57ee1bb07'),
      U('photo-1587385789097-0197a7e4c98c'),
    ]
  },
  {
    title: 'Celestron StarSense Teleskop',
    description: 'Celestron StarSense Explorer LT 80AZ. Telefon uygulamalı gökyüzü keşfi. Tripod dahil.',
    category: 'other', condition: 'good', value: 2000,
    images: [
      U('photo-1532094349884-543bc11b234d'),
      U('photo-1564053489984-317bbd824340'),
    ]
  },
  {
    title: 'Yağlı Boya Resim Seti - Başlangıç',
    description: '24 renk yağlı boya, 10 fırça, 3 tuval, palet, tiner, şövale. Komple başlangıç seti.',
    category: 'other', condition: 'new', value: 500,
    images: [
      U('photo-1513364776144-60967b0f800f'),
      U('photo-1460661419201-fd4cecdf8a8b'),
    ]
  },
  {
    title: 'Akustik Gitar - Yamaha F310',
    description: 'Yamaha F310 akustik gitar. Başlangıç modeli, tuner, askı, capo, pena dahil.',
    category: 'other', condition: 'good', value: 1200,
    images: [
      U('photo-1510915361894-db8b60106cb1'),
      U('photo-1516924962500-2b4b3b99ea02'),
      U('photo-1525201548942-d8732f6617a0'),
    ]
  },
  {
    title: 'Kamp Lambası Solar Şarjlı',
    description: 'Solar + USB şarjlı kamp lambası. 3 mod, SOS. Telefon şarj çıkışı. Doğa sporları.',
    category: 'other', condition: 'like-new', value: 250,
    images: [
      U('photo-1504280390367-361c6d9f38f4'),
      U('photo-1478131143081-80f7f84ca84d'),
    ]
  },
  {
    title: 'Puzzle Mat 1500 Parça Uyumlu',
    description: 'Puzzle rulo mat, 1500 parçaya kadar. Keçe yüzey, saklama bandı. Yapboz severler için.',
    category: 'other', condition: 'new', value: 150,
    images: [
      U('photo-1606503153255-59d6e4e3e6f1'),
      U('photo-1494059980473-813e73ee784b'),
    ]
  },
  {
    title: 'El Yapımı Seramik Vazo Seti',
    description: '3 adet el yapımı seramik vazo, farklı boyutlar. Minimalist tasarım, toprak tonları.',
    category: 'other', condition: 'new', value: 400,
    images: [
      U('photo-1612198188060-c7c2a3b66eae'),
      U('photo-1581783898377-1c85bf937427'),
    ]
  },
  {
    title: 'Deri Saat Kayışı Koleksiyonu (5 adet)',
    description: '5 farklı renk hakiki deri saat kayışı. 22mm. Apple Watch ve 22mm kasa ile uyumlu.',
    category: 'other', condition: 'new', value: 300,
    images: [
      U('photo-1524592094714-0f0654e20314'),
      U('photo-1434493789847-2a75b0eb6001'),
    ]
  },
  {
    title: 'Dürbün - Nikon Aculon 10x50',
    description: 'Nikon Aculon A211 10x50 dürbün. Kuş gözlemi, doğa, spor etkinlikleri. Kılıf dahil.',
    category: 'other', condition: 'good', value: 800,
    images: [
      U('photo-1532094349884-543bc11b234d'),
      U('photo-1564053489984-317bbd824340'),
    ]
  },
];

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed() {
  await client.connect();
  console.log('✅ Veritabanına bağlanıldı!\n');

  // Current counts
  const existingUsers = await client.query('SELECT count(*) FROM public.users');
  const existingItems = await client.query('SELECT count(*) FROM public.items');
  console.log(`📊 Mevcut: ${existingUsers.rows[0].count} kullanıcı, ${existingItems.rows[0].count} ürün\n`);

  // ============================================================
  // STEP 0: Update existing items with proper images
  // ============================================================
  console.log('🖼️  Mevcut ürünlerin resimleri güncelleniyor...');
  
  // Get existing items that have picsum images
  const oldItems = await client.query(`
    SELECT id, title, category FROM public.items
    WHERE images::text LIKE '%picsum%'
  `);
  
  // Category-based image mapping for existing items
  const categoryImageMap = {
    clothing: [
      U('photo-1596755094514-f87e34085b2c'), U('photo-1542291026-7eec264c27ff'),
      U('photo-1544022613-e10091be389d'), U('photo-1542272604-787c3835535d'),
      U('photo-1556821840-3a63f95609a7'), U('photo-1572804013309-59a88b7e92f1'),
      U('photo-1544923246-77307dd270cb'), U('photo-1463100099107-aa0980c362e6'),
      U('photo-1551028719-00167b16eac5'), U('photo-1548036328-c9fa89d128fa'),
    ],
    toys: [
      U('photo-1587654780014-1cfbae5c6f5a'), U('photo-1558618666-fcd25c85f7e7'),
      U('photo-1594787318286-3d835c1d207f'), U('photo-1610890716171-6b1bb98ffd09'),
      U('photo-1577401239170-897942555fb3'), U('photo-1559715541-5daf8a0296d0'),
      U('photo-1515488042361-ee00e0ddd4e4'), U('photo-1507582020474-9a35b7d455d9'),
    ],
    electronics: [
      U('photo-1600294037681-c80b4cb5b434'), U('photo-1544244015-0df4b3ffc6b0'),
      U('photo-1608043152269-423dbba4e7e1'), U('photo-1583394838336-acd977736f90'),
      U('photo-1516035069371-29a1b244cc32'), U('photo-1546868871-af0de0ae72be'),
      U('photo-1606144042614-b2417e99c4e3'), U('photo-1527443224154-c4a3942d3acf'),
    ],
    books: [
      U('photo-1544947950-fa07a98d237f'), U('photo-1512820790803-83ca734da794'),
      U('photo-1495446815901-a7297e633e8d'), U('photo-1543002588-bfa74002ed7e'),
      U('photo-1481627834876-b7833e8f5570'), U('photo-1507842217343-583bb7270b66'),
      U('photo-1456513080510-7bf3a84b82f8'), U('photo-1618666012174-83b441c0bc76'),
    ],
    sports: [
      U('photo-1544367567-0f2fcb009e0b'), U('photo-1551773188-d63e5d51d916'),
      U('photo-1517963879433-6ad2b056d712'), U('photo-1575361204480-aadea25e6e68'),
      U('photo-1504280390367-361c6d9f38f4'), U('photo-1485965120184-e220f721d03e'),
      U('photo-1534438327276-14e5300c3a48'), U('photo-1546519638-68e109498ffc'),
    ],
    home: [
      U('photo-1556909114-f6e7ad7d3136'), U('photo-1618220179428-22790b461013'),
      U('photo-1555041469-a586c61ea9bc'), U('photo-1586023492125-27b2c045efd7'),
      U('photo-1517668808822-9ebb02f2a0e6'), U('photo-1600166898405-da9535204843'),
      U('photo-1558317374-067fb5f30001'), U('photo-1459411552884-841db9b3cc2a'),
    ],
    other: [
      U('photo-1553062407-98eeb64c6a62'), U('photo-1572635196237-14b3f281503f'),
      U('photo-1510915361894-db8b60106cb1'), U('photo-1529699211952-734e80c4d42b'),
      U('photo-1526170375885-4d8ecf77b99f'), U('photo-1513364776144-60967b0f800f'),
    ],
  };

  let updatedImages = 0;
  for (const item of oldItems.rows) {
    const catImages = categoryImageMap[item.category] || categoryImageMap.other;
    const numImages = 2 + Math.floor(Math.random() * 2);
    const shuffled = catImages.sort(() => Math.random() - 0.5);
    const newImages = shuffled.slice(0, numImages);
    
    await client.query(
      'UPDATE public.items SET images = $1 WHERE id = $2',
      [newImages, item.id]
    );
    updatedImages++;
  }
  console.log(`  ✓ ${updatedImages} ürünün resimleri güncellendi\n`);

  // ============================================================
  // STEP 1: Create 80 more auth.users
  // ============================================================
  console.log('👤 80 yeni kullanıcı oluşturuluyor...');

  const usedEmails = new Set();
  // Get existing emails
  const existingEmails = await client.query('SELECT email FROM auth.users');
  existingEmails.rows.forEach(r => usedEmails.add(r.email));

  const newUserIds = [];
  let createdAuthUsers = 0;

  for (let i = 0; i < 80; i++) {
    const isFemale = i >= 40;
    const firstNames = isFemale ? FEMALE_NAMES : MALE_NAMES;
    const firstName = firstNames[i % firstNames.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    let emailBase = `${turkishToAscii(firstName).toLowerCase()}.${turkishToAscii(lastName).toLowerCase()}`;
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
    const rating = (3.5 + Math.random() * 1.5).toFixed(2);
    const totalTrades = Math.floor(Math.random() * 25);
    const daysAgo = Math.floor(Math.random() * 200);
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

    try {
      const authResult = await client.query(`
        INSERT INTO auth.users (
          instance_id, id, aud, role, email, encrypted_password,
          email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
          created_at, updated_at, is_sso_user, is_anonymous
        ) VALUES (
          '00000000-0000-0000-0000-000000000000',
          gen_random_uuid(), 'authenticated', 'authenticated',
          $1, crypt('TakasDemo2024!', gen_salt('bf')),
          $2::timestamptz,
          '{"provider": "email", "providers": ["email"]}'::jsonb,
          $3::jsonb,
          $2::timestamptz, $2::timestamptz, false, false
        ) RETURNING id
      `, [email, createdAt, JSON.stringify({ name: fullName, firstName, lastName })]);

      const userId = authResult.rows[0].id;

      // Insert into public.users
      await client.query(`
        INSERT INTO public.users (id, email, name, avatar, bio, location, created_at, updated_at, rating, total_trades, first_name, last_name, display_name)
        VALUES ($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::text, $7::timestamptz, NOW(), $8::numeric, $9::int, $10::text, $11::text, $12::text)
        ON CONFLICT (id) DO UPDATE SET
          avatar = EXCLUDED.avatar, bio = EXCLUDED.bio, location = EXCLUDED.location,
          rating = EXCLUDED.rating, total_trades = EXCLUDED.total_trades,
          first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, display_name = EXCLUDED.display_name
      `, [userId, email, fullName, avatar, bio, city, createdAt, rating, totalTrades, firstName, lastName, fullName]);

      newUserIds.push(userId);
      createdAuthUsers++;

      if ((i + 1) % 10 === 0) console.log(`  ✓ ${i + 1}/80 kullanıcı oluşturuldu`);
    } catch (err) {
      console.error(`  ✗ Kullanıcı hatası (${email}):`, err.message);
    }
  }
  console.log(`\n✅ ${createdAuthUsers} yeni kullanıcı oluşturuldu!\n`);

  // ============================================================
  // STEP 2: Get all user IDs for item distribution
  // ============================================================
  const allUsers = await client.query('SELECT id FROM public.users ORDER BY random()');
  const userIds = allUsers.rows.map(r => r.id);
  console.log(`📊 Toplam ${userIds.length} kullanıcı mevcut\n`);

  // ============================================================
  // STEP 3: Insert new items with real images
  // ============================================================
  console.log('📦 Yeni ürünler oluşturuluyor...\n');

  let totalItems = 0;
  let userIdx = 0;
  const categoryCounts = {};

  for (const item of ITEMS) {
    const ownerId = userIds[userIdx % userIds.length];
    userIdx += 1 + Math.floor(Math.random() * 2);

    const ownerCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const views = Math.floor(Math.random() * 500) + 10;
    const likes = Math.floor(Math.random() * Math.min(views, 50));
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

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
        item.title, item.description, item.category, item.condition,
        item.value, item.images, ownerId, createdAt, ownerCity, views, likes
      ]);
      totalItems++;
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    } catch (err) {
      console.error(`  ✗ Ürün hatası (${item.title}):`, err.message);
    }
  }

  for (const [cat, cnt] of Object.entries(categoryCounts)) {
    console.log(`  📂 ${cat}: ${cnt} yeni ürün`);
  }
  console.log(`\n✅ Toplam ${totalItems} yeni ürün eklendi!`);

  // ============================================================
  // FINAL STATS
  // ============================================================
  const finalUsers = await client.query('SELECT count(*) FROM public.users');
  const finalItems = await client.query("SELECT count(*) FROM public.items WHERE status = 'active'");
  const byCategory = await client.query(`
    SELECT category, count(*) as cnt FROM public.items
    WHERE status = 'active' GROUP BY category ORDER BY cnt DESC
  `);
  const byCondition = await client.query(`
    SELECT condition, count(*) as cnt FROM public.items
    WHERE status = 'active' GROUP BY condition ORDER BY cnt DESC
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
  console.log('='.repeat(50));

  await client.end();
  console.log('\n✅ Seed V2 tamamlandı!');
}

seed().catch(err => {
  console.error('❌ FATAL:', err);
  client.end();
  process.exit(1);
});
