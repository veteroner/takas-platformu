const { Client } = require('pg');

const CONNECTION = 'postgresql://postgres.rraatgwihvrxopjahpoh:Oner2621.%2C@aws-1-eu-north-1.pooler.supabase.com:5432/postgres';

// Pexels CDN URL helper
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

// ============================================================
// VERIFIED PEXELS IMAGE DATABASE
// Each ID was verified from Pexels search results with descriptions
// ============================================================

const IMAGES = {
  // --- CLOTHING ---
  white_shirt: [P(297933), P(6276012), P(46212)],
  nike_shoes: [P(2048548), P(9853347), P(1456740), P(3261068)],
  trench_coat: [P(9968541), P(7990514), P(9968525), P(4456733)],
  jeans: [P(219633), P(4109755), P(531759), P(1598507), P(52518)],
  hoodie: [P(12555790), P(7479825), P(8217415), P(6311693)],
  dress: [P(985635), P(1126993), P(2220316), P(1536619)],
  winter_coat: [P(7767887), P(5119979), P(6764007), P(5439497)],
  sneakers: [P(2048548), P(1456740), P(3261068), P(9660924)],
  scarf: [P(6347892), P(6593555), P(7525187), P(3735641)],
  polo_shirt: [P(6626903), P(3755706), P(3755511), P(5490123)],
  jacket_outdoor: [P(7767887), P(6764007), P(5119979), P(5439497)],
  handbag: [P(1152077), P(904350), P(2081199), P(1204464)],
  boots: [P(3962294), P(267320), P(1027130), P(6046183)],
  baby_clothes: [P(6393364), P(3661526), P(3661530), P(3661510)],
  leggings: [P(3758148), P(3822450), P(868483), P(3775593)],
  blazer: [P(1043474), P(1300550), P(2379004), P(1183266)],
  leather_jacket: [P(1124468), P(2887718), P(1906148), P(1040945)],
  knitwear: [P(6311693), P(7479825), P(3735641), P(6593555)],
  pants: [P(219633), P(1082529), P(4210864), P(603022)],
  sportswear: [P(3758148), P(868483), P(3775593), P(374101)],

  // --- TOYS ---
  lego: [P(3661454), P(3661357), P(3661355), P(3661340)],
  blocks: [P(32432131), P(3661342), P(3661351), P(3661344)],
  doll: [P(3661526), P(3661530), P(3661510), P(3661344)],
  toy_car: [P(14823947), P(14823946), P(14823950), P(8365826)],
  board_game: [P(3993855), P(260024), P(278918), P(163064)],
  puzzle: [P(3993855), P(278918), P(163064), P(1109197)],
  plush: [P(3661526), P(3661530), P(3661450), P(18990724)],
  baby_toy: [P(18990724), P(27661861), P(3661344), P(32432135)],
  toy_general: [P(3661450), P(19916226), P(3661356), P(3661353)],
  drone: [P(336232), P(442587), P(724921), P(1087180)],
  rubik: [P(3993855)],
  rc_car: [P(14823947), P(14823946)],
  nerf: [P(3661356), P(3661353), P(3661350)],
  bicycle: [P(100582), P(276517), P(289869), P(349600)],
  wooden_train: [P(11140406), P(14739171), P(4887204), P(32720288)],
  toy_kitchen: [P(211761), P(3933230), P(4484853), P(4492270)],
  pirate_ship: [P(1967533), P(189530), P(4785054), P(37730)],

  // --- ELECTRONICS ---
  earbuds: [P(8380433), P(3921864), P(8858287), P(10024624)],
  airpods: [P(3921864), P(3921845), P(3921846), P(8380417)],
  tablet: [P(14464048), P(3945698), P(3785868), P(270669)],
  bluetooth_speaker: [P(374606), P(4430950), P(6023354), P(1034653)],
  game_controller: [P(3945683), P(442576), P(275033), P(371924)],
  smartwatch: [P(267394), P(437037), P(393047), P(282827)],
  camera: [P(51383), P(225157), P(1203803), P(821738)],
  keyboard: [P(1714208), P(1772123), P(735911), P(1029757)],
  mouse: [P(392018), P(2115256), P(5765823), P(3829227)],
  headphones: [P(3587478), P(3394650), P(3394666), P(577769)],
  monitor: [P(1714208), P(1029757), P(1772123), P(735911)],
  powerbank: [P(4526407), P(3944405), P(5082579), P(4195325)],
  console: [P(275033), P(442576), P(371924), P(687811)],
  phone: [P(607812), P(699122), P(47261), P(1092644)],
  kindle: [P(14464048), P(270669), P(3945698), P(3785868)],
  instant_camera: [P(1983037), P(2773471), P(2267872), P(1983038)],
  gopro: [P(51383), P(821738), P(1203803), P(225157)],
  raspberry: [P(1714208), P(735911), P(1772123), P(1029757)],
  speaker_marshall: [P(4430950), P(1706694), P(31683433), P(374114)],
  wifi_router: [P(32698507), P(4218546), P(29711663)],
  hard_drive: [P(30070239), P(117729), P(19658260), P(4526279)],
  remote_control: [P(5202957), P(5202959), P(6159692), P(14770619)],
  electric_shaver: [P(10359950), P(3687956), P(13386929), P(10359938)],

  // --- BOOKS ---
  book_novel: [P(762685), P(1122865), P(207636), P(694740)],
  book_set: [P(159866), P(1148399), P(48020), P(1130980)],
  book_shelf: [P(256453), P(3747553), P(3747507), P(4865733)],
  book_stack: [P(158834), P(1383379), P(4219043), P(7171398)],
  book_vintage: [P(1666320), P(185764), P(433333), P(1130980)],
  manga: [P(762685), P(1122865), P(694740), P(207636)],
  cookbook: [P(691114), P(461428), P(326279), P(262978)],
  children_book: [P(159866), P(48020), P(762685), P(207636)],
  dictionary: [P(256453), P(4865733), P(3747507), P(1148399)],
  notebook: [P(434337), P(7171398), P(4219039), P(4058026)],

  // --- SPORTS ---
  yoga_mat: [P(374101), P(3822450), P(374694), P(4325462)],
  tennis: [P(209977), P(1432039), P(5739179), P(1103829)],
  kettlebell: [P(416809), P(841130), P(2261477), P(1552252)],
  football: [P(46798), P(274422), P(47730), P(1171084)],
  camping_tent: [P(2398220), P(699558), P(2666598), P(1687845)],
  bike_helmet: [P(289869), P(276517), P(349600), P(100582)],
  resistance_band: [P(3758148), P(3822450), P(868483), P(374101)],
  basketball: [P(358042), P(1080882), P(945471), P(2346091)],
  running_shoes: [P(2048548), P(1456740), P(3261068), P(9660924)],
  swimming: [P(863988), P(261185), P(1263349), P(1534604)],
  mountain_bike: [P(100582), P(276517), P(289869), P(349600)],
  boxing: [P(163403), P(598686), P(260447), P(4761792)],
  ski: [P(848618), P(376697), P(352093), P(296282)],
  scooter: [P(5435449), P(1552252), P(3912478), P(4542879)],
  pilates: [P(3822450), P(374101), P(868483), P(374694)],
  hiking: [P(2398220), P(699558), P(1687845), P(2666598)],
  weights: [P(416809), P(841130), P(1552252), P(2261477)],
  sleeping_bag: [P(2398220), P(699558), P(1687845), P(2666598)],
  badminton: [P(209977), P(1432039), P(5739179), P(1103829)],
  diving: [P(863988), P(261185), P(1534604), P(1263349)],
  jump_rope: [P(3758148), P(868483), P(3775593), P(374101)],
  table_tennis: [P(209977), P(1432039), P(5739179), P(1103829)],
  foam_roller: [P(374101), P(3822450), P(374694), P(868483)],
  sport_bag: [P(1152077), P(904350), P(2081199), P(1204464)],

  // --- HOME ---
  bookshelf: [P(256453), P(3747553), P(3747507), P(4865733)],
  smart_light: [P(1123262), P(1112598), P(577514), P(459654)],
  cookware: [P(691114), P(461428), P(280232), P(2062426)],
  mirror: [P(1571459), P(1743229), P(1571460), P(2082087)],
  coffee_machine: [P(324028), P(302899), P(312418), P(1695052)],
  rug: [P(6480707), P(1571459), P(2082087), P(1743229)],
  vacuum: [P(1599791), P(2062426), P(280232), P(279648)],
  plant: [P(1084199), P(305821), P(776656), P(793012)],
  candle: [P(3270223), P(1603901), P(3612700), P(3270224)],
  chair: [P(1350789), P(116910), P(245208), P(1571453)],
  robot_kitchen: [P(691114), P(2062426), P(280232), P(1599791)],
  bedding: [P(1034584), P(271743), P(164595), P(279746)],
  vintage_table: [P(1350789), P(116910), P(245208), P(1571453)],
  air_purifier: [P(1599791), P(280232), P(2062426), P(279648)],
  porcelain: [P(461428), P(691114), P(262978), P(326279)],
  organizer: [P(434337), P(1599791), P(280232), P(279648)],
  cushion: [P(1034584), P(271743), P(279746), P(164595)],
  turkish_coffee: [P(324028), P(312418), P(302899), P(1695052)],
  wall_clock: [P(1095601), P(813872), P(1198264), P(707582)],
  blanket: [P(1034584), P(271743), P(164595), P(279746)],
  moka_pot: [P(324028), P(302899), P(312418), P(1695052)],
  carpet: [P(6480707), P(1571459), P(2082087), P(1743229)],
  airfryer: [P(2062426), P(280232), P(1599791), P(691114)],
  drying_rack: [P(2062426), P(1599791), P(280232), P(279648)],
  desk_lamp: [P(1112598), P(577514), P(459654), P(1123262)],
  spray_bottle: [P(12997254), P(4176561), P(5217884), P(11969601)],

  // --- OTHER ---
  backpack: [P(2905238), P(1546003), P(1294731), P(2393816)],
  sunglasses: [P(701877), P(46710), P(343720), P(1362558)],
  ukulele: [P(1407322), P(164743), P(210764), P(586415)],
  chess: [P(260024), P(277092), P(814133), P(1152662)],
  polaroid: [P(1983037), P(2773471), P(2267872), P(1983038)],
  wallet: [P(915915), P(2079172), P(840916), P(1152077)],
  swiss_knife: [P(162553), P(416322), P(4215113), P(162553)],
  telescope: [P(60597), P(256381), P(2034892), P(714699)],
  paint_set: [P(1646953), P(102127), P(1545505), P(3094218)],
  guitar: [P(1407322), P(164743), P(210764), P(586415)],
  camping_lamp: [P(14191850), P(16648803), P(943150), P(6271688)],
  puzzle_mat: [P(278918), P(163064), P(1109197), P(3993855)],
  ceramic_vase: [P(3270223), P(1603901), P(776656), P(305821)],
  watch_strap: [P(267394), P(437037), P(393047), P(282827)],
  binoculars: [P(60597), P(256381), P(714699), P(2034892)],
};

// ============================================================
// TITLE → IMAGE KEY MAPPING
// Maps each item title to the most appropriate image set
// ============================================================

const TITLE_MAP = {
  // CLOTHING (30)
  'Zara Beyaz Gömlek': 'white_shirt',
  'Nike Air Force 1': 'nike_shoes',
  'Mango Trençkot': 'trench_coat',
  "Levi's 501 Jean": 'jeans',
  'Adidas Hoodie': 'hoodie',
  'H&M Yaz Elbisesi': 'dress',
  'Koton Kışlık Mont': 'winter_coat',
  'Converse Chuck Taylor': 'sneakers',
  'İpek Şal': 'scarf',
  'Polo Tişört': 'polo_shirt',
  'North Face Ceket': 'jacket_outdoor',
  'Vakko Çanta': 'handbag',
  'Columbia Bot': 'boots',
  'LC Waikiki Çocuk Set': 'baby_clothes',
  'Puma Tayt': 'leggings',
  'İpekyol Blazer': 'blazer',
  'Vintage Deri Ceket': 'leather_jacket',
  'Bebek Giyim Paketi': 'baby_clothes',
  'New Balance 574': 'sneakers',
  'Tommy Hilfiger Kazak': 'knitwear',
  'Keten Pantolon': 'pants',
  'Under Armour Tişört': 'sportswear',
  'Dockers Chino': 'pants',
  'Massimo Dutti Palto': 'trench_coat',
  'Timberland Bot': 'boots',
  'Nike Spor Sütyeni': 'sportswear',
  'Keten Gömlek': 'white_shirt',
  'GAP Jean Ceket': 'jeans',
  'Okul Forması Seti': 'baby_clothes',
  'Triko Hırka': 'knitwear',

  // TOYS (25)
  'LEGO City Polis': 'lego',
  'Barbie Rüya Evi': 'doll',
  'Hot Wheels Pist': 'toy_car',
  'Monopoly Türkiye': 'board_game',
  'Playmobil Çiftlik': 'toy_general',
  'Rubik Küp': 'rubik',
  'Bebek Oyun Matı': 'baby_toy',
  'DJI Mini Drone': 'drone',
  'Ahşap Tren Seti': 'toy_general',
  'Nerf Elite': 'nerf',
  '1000 Parça Yapboz': 'puzzle',
  'Fisher-Price Yürüteç': 'baby_toy',
  'Peluş Unicorn': 'plush',
  'Scrabble Türkçe': 'board_game',
  'RC Offroad Araba': 'rc_car',
  'LEGO Technic': 'lego',
  'Oyuncak Mutfak Seti': 'toy_general',
  'UNO Deluxe': 'board_game',
  'Magnetik Yapı Blokları': 'blocks',
  'Çocuk Bisikleti': 'bicycle',
  'Beşik Mobili': 'baby_toy',
  'Başlangıç Teleskopu': 'telescope',
  'Play-Doh Set': 'toy_general',
  'Risk Strateji': 'board_game',
  'LCD Çizim Tahtası': 'tablet',

  // ELECTRONICS (25)
  'AirPods Pro 2': 'airpods',
  'Apple AirPods Pro (2. Nesil)': 'airpods',
  'Samsung Tab A8': 'tablet',
  'Samsung Galaxy Tab A8 Tablet': 'tablet',
  'JBL Flip 6': 'bluetooth_speaker',
  'JBL Flip 6 Bluetooth Hoparlör': 'bluetooth_speaker',
  'PS5 DualSense': 'game_controller',
  'PS5 DualSense Kablosuz Oyun Kolu': 'game_controller',
  'Xiaomi Mi Band 7': 'smartwatch',
  'Xiaomi Mi Band 8 Akıllı Bileklik': 'smartwatch',
  'Logitech MX Master': 'mouse',
  'Kindle Paperwhite': 'kindle',
  'Anker Powerbank': 'powerbank',
  'Canon EOS M50': 'camera',
  'Canon EOS M50 II Aynasız Kamera': 'camera',
  'Canon EOS M50 Mark II Aynasız Kamera': 'camera',
  'Apple Watch SE': 'smartwatch',
  'Marshall Stanmore II': 'speaker_marshall',
  'Marshall Stanmore II Bluetooth Hoparlör': 'speaker_marshall',
  'Nintendo Switch Lite': 'console',
  'Nintendo Switch Lite - Turkuaz': 'console',
  'Sony WH-1000XM5': 'headphones',
  'Sony WH-1000XM5 Kulaklık': 'headphones',
  'GoPro Hero 11': 'gopro',
  'GoPro Hero 11 Black Aksiyon Kamera': 'gopro',
  'Raspberry Pi 4': 'raspberry',
  'Bose SoundLink': 'bluetooth_speaker',
  'iPad Air 5': 'tablet',
  'iPad Air (5. Nesil) 64GB': 'tablet',
  'Keychron K2': 'keyboard',
  'Mechanical Keyboard - Keychron K2': 'keyboard',
  'Galaxy Buds 2 Pro': 'earbuds',
  'Samsung Galaxy Buds 2 Pro': 'earbuds',
  'DJI OM 5 Gimbal': 'drone',
  'LG 27" Monitor': 'monitor',
  'LG 27" 4K IPS Monitör': 'monitor',
  'Fujifilm Instax': 'instant_camera',
  'Fujifilm Instax Mini 12 Fotoğraf Makinesi': 'instant_camera',
  'Xbox Series S': 'console',
  'Philips OneBlade': 'electric_shaver',
  'Philips OneBlade Pro Tıraş Makinesi': 'electric_shaver',
  'TP-Link Mesh WiFi': 'wifi_router',
  'Kol saati': 'smartwatch',

  // BOOKS (25)
  'Orhan Pamuk Set': 'book_set',
  'Sapiens': 'book_novel',
  'Yuval Noah Harari - Sapiens (Türkçe)': 'book_novel',
  'Harry Potter Set': 'book_set',
  'Kürk Mantolu Madonna': 'book_novel',
  'İlber Ortaylı Set': 'book_set',
  'Çocuk Ansiklopedisi': 'children_book',
  'Küçük Prens Koleksiyon': 'book_vintage',
  'Kısa Tarih Hawking': 'book_novel',
  'Elif Şafak Set': 'book_set',
  'Naruto Manga Set': 'manga',
  'Zweig Seçkisi': 'book_vintage',
  'Türk Mutfağı Kitabı': 'cookbook',
  'Carnegie Koleksiyonu': 'book_novel',
  'KPSS Hazırlık Seti': 'book_stack',
  'Dostoyevski Set': 'book_set',
  'Dostoyevski - Suç ve Ceza': 'book_novel',
  'Bullet Journal Planner': 'notebook',
  'Marquez Set': 'book_set',
  'Çocuk Kitapları Paketi': 'children_book',
  'Japonca Öğrenme Seti': 'book_stack',
  'Ahmet Ümit Set': 'book_set',
  'Felsefe Klasikleri': 'book_vintage',
  'Oxford Sözlük': 'dictionary',
  'Nazım Hikmet Şiir': 'book_vintage',
  'Yoga Rehberi': 'book_novel',
  'Tutunamayanlar': 'book_novel',
  'Elif Şafak - Aşk (10 Yıl Özel Baskısı)': 'book_novel',
  'Türk Mutfağı - 500 Tarif': 'cookbook',

  // SPORTS (25)
  'Yoga Mat': 'yoga_mat',
  'Wilson Tenis Raketi': 'tennis',
  'Kettlebell 16kg': 'kettlebell',
  'Adidas Futbol Topu': 'football',
  'Kamp Çadırı 4 Kişilik': 'camping_tent',
  'Bisiklet Kaskı': 'bike_helmet',
  'Direnç Bandı Seti': 'resistance_band',
  'Spalding Basketbol': 'basketball',
  'Asics Koşu Ayakkabısı': 'running_shoes',
  'Yüzme Seti': 'swimming',
  'Dağ Bisikleti': 'mountain_bike',
  'Boks Eldiveni': 'boxing',
  'Kayak Gözlüğü': 'ski',
  'Xiaomi E-Scooter': 'scooter',
  'Pilates Reformer': 'pilates',
  'Trekking Çubuğu': 'hiking',
  'Halter Seti 50kg': 'weights',
  'Uyku Tulumu': 'sleeping_bag',
  'Badminton Set': 'badminton',
  'Dalış Maskesi': 'diving',
  'Atlama İpi Pro': 'jump_rope',
  'Masa Tenisi Seti': 'table_tennis',
  'Foam Roller': 'foam_roller',
  'Wilson Tenis Topu': 'tennis',
  'Nike Spor Çantası': 'sport_bag',

  // HOME (25)
  'IKEA Billy Kitaplık': 'bookshelf',
  'Philips Hue Set': 'smart_light',
  'Le Creuset Tencere': 'cookware',
  'Dekoratif Ayna': 'mirror',
  'Nespresso Makinesi': 'coffee_machine',
  'El Dokuma Kilim': 'rug',
  'Dyson V8 Süpürge': 'vacuum',
  'Monstera Deliciosa': 'plant',
  'Soya Mum Seti': 'candle',
  'IKEA Poäng Koltuk': 'chair',
  'Arzum Robot': 'robot_kitchen',
  'Nevresim Takımı': 'bedding',
  'Vintage Sehpa': 'vintage_table',
  'Hava Temizleyici': 'air_purifier',
  'Porselen Yemek Seti': 'porcelain',
  'Bambu Düzenleyici': 'organizer',
  'Kırlent Seti': 'cushion',
  'Türk Kahvesi Seti': 'turkish_coffee',
  'Duvar Saati': 'wall_clock',
  'Battaniye': 'blanket',
  'Bialetti Moka': 'moka_pot',
  'Vintage Halı': 'carpet',
  'Airfryer': 'airfryer',
  'Kurutma Askısı': 'drying_rack',
  'Led Masa Lambası': 'desk_lamp',

  // OTHER (15)
  'Kanvas Sırt Çantası': 'backpack',
  'Ray-Ban Wayfarer': 'sunglasses',
  'Ukulele Soprano': 'ukulele',
  'Satranç Takımı': 'chess',
  'Polaroid Now': 'polaroid',
  'Deri Cüzdan': 'wallet',
  'Victorinox Çakı': 'swiss_knife',
  'Teleskop Celestron': 'telescope',
  'Yağlı Boya Seti': 'paint_set',
  'Akustik Gitar': 'guitar',
  'Kamp Lambası': 'camping_lamp',
  'Camping Lamba + Şarj İstasyonu': 'camping_lamp',
  'Puzzle Mat': 'puzzle_mat',
  'Seramik Vazo': 'ceramic_vase',
  'Saat Kayışı Set': 'watch_strap',
  'Dürbün Nikon Aculon': 'binoculars',

  // --- EXTRA: previously unmatched items from seed-fix.js ---
  // Books (author - title format)
  'Ahmet Ümit - Beyoğlu Rapsodisi': 'book_novel',
  'Alev Alatlı klasiği': 'book_novel',
  'Amin Maalouf - Semerkant': 'book_novel',
  'Antoine de Saint-Exupéry - Küçük Prens': 'children_book',
  'Dale Carnegie - İnsan İlişkilerinde Başarı': 'book_novel',
  'Felsefe Tarihi Seti - Cevizkabuğu': 'book_set',
  'Gabriel Garcia Marquez - Yüzyıllık Yalnızlık': 'book_novel',
  'İlber Ortaylı - Türklerin Tarihi': 'book_novel',
  'Oğuz Atay - Tutunamayanlar': 'book_novel',
  'Orhan Pamuk - İstanbul Hatıralar ve Şehir': 'book_novel',
  'Sabahattin Ali - Kürk Mantolu Madonna': 'book_novel',
  'Stephen Hawking - Zamanın Kısa Tarihi': 'book_novel',
  // Clothing
  'Columbia Outdoor Yürüyüş Botu': 'boots',
  'Columbia Yürüyüş Botu - 43 Numara': 'boots',
  'Converse Chuck Taylor All Star': 'sneakers',
  'LC Waikiki Çocuk Kışlık Set': 'baby_clothes',
  'LC Waikiki Çocuk Kışlık Set - 5/6 Yaş': 'baby_clothes',
  // Electronics
  'Hdd': 'hard_drive',
  'Mause': 'mouse',
  'Samsung remote': 'remote_control',
  'TP-Link Mesh Wi-Fi 6 Sistemi (3lü)': 'wifi_router',
  // Home
  'spray bottle': 'spray_bottle',
  // Toys
  'Ahşap Tren Seti - 80 Parça': 'wooden_train',
  'Çocuk Mutfak Seti - Ahşap': 'toy_kitchen',
  'Playmobil Korsan Gemisi': 'pirate_ship',
  'robot': 'toy_general',
  // Other
  'Test': 'backpack',
};

// ============================================================
// KEYWORD FALLBACK MATCHING
// For items from seed-fix.js that aren't in TITLE_MAP
// ============================================================

const KEYWORD_RULES = [
  // CLOTHING keywords — ORDER MATTERS: more specific first!
  { keywords: ['hoodie', 'kapüşon', 'sweatshirt'], key: 'hoodie' },
  { keywords: ['deri ceket', 'leather jacket'], key: 'leather_jacket' },
  { keywords: ['blazer'], key: 'blazer' },
  { keywords: ['trençkot', 'trench'], key: 'trench_coat' },
  { keywords: ['mont ', 'kışlık mont', 'kaban', 'palto'], key: 'winter_coat' },
  { keywords: ['jean ', 'jean-', 'denim', 'kot pantolon', 'kot ceket'], key: 'jeans' },
  { keywords: ['gömlek', 'shirt'], key: 'white_shirt' },
  { keywords: ['elbise', 'dress'], key: 'dress' },
  { keywords: ['şal', 'scarf', 'atkı', 'fular'], key: 'scarf' },
  { keywords: ['tişört', 't-shirt'], key: 'polo_shirt' },
  { keywords: ['tayt', 'legging'], key: 'leggings' },
  { keywords: ['kazak', 'hırka', 'triko', 'örgü', 'sweater'], key: 'knitwear' },
  { keywords: ['pantolon', 'chino'], key: 'pants' },
  { keywords: ['ceket', 'jacket'], key: 'jacket_outdoor' },
  { keywords: ['sırt çantası', 'backpack'], key: 'backpack' },
  { keywords: ['çanta', 'bag', 'handbag'], key: 'handbag' },
  { keywords: ['bot ', 'botu', 'boots', 'çizme'], key: 'boots' },
  { keywords: ['bebek giyim', 'çocuk giyim', 'çocuk set', 'forma seti', 'forması'], key: 'baby_clothes' },
  { keywords: ['ayakkabı', 'sneaker', 'air force', 'new balance', 'converse', 'chuck taylor'], key: 'sneakers' },
  { keywords: ['columbia', 'yürüyüş botu'], key: 'boots' },
  { keywords: ['waikiki'], key: 'baby_clothes' },
  { keywords: ['spor giyim', 'sporcu', 'spor sütyeni'], key: 'sportswear' },

  // TOYS keywords
  { keywords: ['lego'], key: 'lego' },
  { keywords: ['barbie', 'bebek', 'oyuncak bebek'], key: 'doll' },
  { keywords: ['hot wheels', 'araba', 'oyuncak araba'], key: 'toy_car' },
  { keywords: ['monopoly', 'monopoli', 'kutu oyun', 'masa oyun', 'uno', 'risk', 'scrabble'], key: 'board_game' },
  { keywords: ['yapboz', 'puzzle'], key: 'puzzle' },
  { keywords: ['peluş', 'plush'], key: 'plush' },
  { keywords: ['rubik', 'küp'], key: 'rubik' },
  { keywords: ['drone', 'dji'], key: 'drone' },
  { keywords: ['rc ', 'uzaktan kumanda'], key: 'rc_car' },
  { keywords: ['nerf', 'silah'], key: 'nerf' },
  { keywords: ['bisiklet', 'bicycle', 'bike'], key: 'bicycle' },
  { keywords: ['blok', 'block', 'yapı'], key: 'blocks' },
  { keywords: ['playmobil korsan', 'korsan gemisi'], key: 'pirate_ship' },
  { keywords: ['playmobil'], key: 'toy_general' },
  { keywords: ['tren seti', 'ahşap tren'], key: 'wooden_train' },
  { keywords: ['oyuncak mutfak', 'toy kitchen', 'çocuk mutfak'], key: 'toy_kitchen' },
  { keywords: ['oyuncak', 'play-doh', 'oyun matı'], key: 'toy_general' },

  // ELECTRONICS keywords
  { keywords: ['airpods', 'kulaklık kablosuz'], key: 'airpods' },
  { keywords: ['marshall'], key: 'speaker_marshall' },
  { keywords: ['earbuds', 'buds', 'kulak içi', 'kablosuz kulaklık'], key: 'earbuds' },
  { keywords: ['tablet', 'ipad'], key: 'tablet' },
  { keywords: ['speaker', 'hoparlör', 'jbl', 'bose', 'soundlink'], key: 'bluetooth_speaker' },
  { keywords: ['ps5', 'dualsense', 'gamepad', 'controller', 'oyun kolu'], key: 'game_controller' },
  { keywords: ['smartwatch', 'akıllı saat', 'mi band', 'apple watch'], key: 'smartwatch' },
  { keywords: ['kamera', 'camera', 'canon', 'nikon'], key: 'camera' },
  { keywords: ['klavye', 'keyboard', 'keychron'], key: 'keyboard' },
  { keywords: ['mouse', 'fare', 'logitech'], key: 'mouse' },
  { keywords: ['headphone', 'sony wh', 'kulaklık'], key: 'headphones' },
  { keywords: ['monitor', 'monitör', 'ekran'], key: 'monitor' },
  { keywords: ['powerbank', 'batarya', 'anker'], key: 'powerbank' },
  { keywords: ['xbox', 'playstation', 'nintendo', 'switch', 'konsol'], key: 'console' },
  { keywords: ['kindle', 'e-okuyucu'], key: 'kindle' },
  { keywords: ['instax', 'polaroid instant'], key: 'instant_camera' },
  { keywords: ['gopro', 'aksiyon kamera'], key: 'gopro' },
  { keywords: ['raspberry', 'pi'], key: 'raspberry' },
  { keywords: ['wifi', 'wi-fi', 'router', 'modem', 'mesh'], key: 'wifi_router' },
  { keywords: ['hdd', 'hard disk', 'harddisk', 'external drive'], key: 'hard_drive' },
  { keywords: ['mause'], key: 'mouse' },
  { keywords: ['remote', 'kumanda'], key: 'remote_control' },
  { keywords: ['gimbal'], key: 'drone' },
  { keywords: ['oneblade', 'tıraş makinesi', 'electric shaver', 'trimmer'], key: 'electric_shaver' },
  { keywords: ['telefon', 'iphone', 'samsung galaxy', 'xiaomi'], key: 'phone' },

  // BOOKS keywords
  { keywords: ['kitap seti', 'set kitap', 'koleksiyon'], key: 'book_set' },
  { keywords: ['manga', 'çizgi roman'], key: 'manga' },
  { keywords: ['yemek kitab', 'mutfak kitab', 'tarif'], key: 'cookbook' },
  { keywords: ['çocuk kitap', 'masal', 'ansiklopedi'], key: 'children_book' },
  { keywords: ['sözlük', 'dictionary'], key: 'dictionary' },
  { keywords: ['defter', 'planner', 'journal', 'ajanda'], key: 'notebook' },
  { keywords: ['kpss', 'sınav', 'hazırlık'], key: 'book_stack' },
  { keywords: ['roman', 'novel', 'kitab', 'kitap', 'book', 'şiir', 'rehber', 'sapiens', 'dostoyevski', 'şafak', 'zweig', 'harari'], key: 'book_novel' },

  // SPORTS keywords
  { keywords: ['yoga', 'mat'], key: 'yoga_mat' },
  { keywords: ['tenis', 'raket', 'tennis'], key: 'tennis' },
  { keywords: ['kettlebell', 'dambıl'], key: 'kettlebell' },
  { keywords: ['futbol', 'football', 'soccer'], key: 'football' },
  { keywords: ['çadır', 'kamp', 'camp'], key: 'camping_tent' },
  { keywords: ['kask', 'helmet'], key: 'bike_helmet' },
  { keywords: ['direnç', 'resistance', 'band'], key: 'resistance_band' },
  { keywords: ['basketbol', 'basketball'], key: 'basketball' },
  { keywords: ['koşu', 'running'], key: 'running_shoes' },
  { keywords: ['yüzme', 'swimming', 'havuz'], key: 'swimming' },
  { keywords: ['dağ bisiklet', 'mtb'], key: 'mountain_bike' },
  { keywords: ['boks', 'boxing', 'eldiven'], key: 'boxing' },
  { keywords: ['kayak', 'ski'], key: 'ski' },
  { keywords: ['scooter', 'e-scooter'], key: 'scooter' },
  { keywords: ['pilates', 'reformer'], key: 'pilates' },
  { keywords: ['trekking', 'çubuk'], key: 'hiking' },
  { keywords: ['halter', 'ağırlık', 'weight'], key: 'weights' },
  { keywords: ['uyku tulumu', 'sleeping'], key: 'sleeping_bag' },
  { keywords: ['badminton'], key: 'badminton' },
  { keywords: ['dalış', 'diving', 'şnorkel'], key: 'diving' },
  { keywords: ['atlama', 'ip', 'jump rope'], key: 'jump_rope' },
  { keywords: ['masa tenisi', 'ping pong'], key: 'table_tennis' },
  { keywords: ['foam roller', 'roller'], key: 'foam_roller' },
  { keywords: ['spor çantası', 'sport bag'], key: 'sport_bag' },

  // HOME keywords — more specific first
  { keywords: ['nevresim', 'yatak örtü', 'çarşaf'], key: 'bedding' },
  { keywords: ['kitaplık', 'raf', 'bookshelf'], key: 'bookshelf' },
  { keywords: ['hue', 'akıllı ışık', 'led lamba', 'lamba'], key: 'smart_light' },
  { keywords: ['tencere', 'tava', 'cookware', 'le creuset'], key: 'cookware' },
  { keywords: ['ayna', 'mirror'], key: 'mirror' },
  { keywords: ['kahve makine', 'nespresso', 'espresso'], key: 'coffee_machine' },
  { keywords: ['kilim', 'rug'], key: 'rug' },
  { keywords: ['süpürge', 'dyson', 'vacuum'], key: 'vacuum' },
  { keywords: ['bitki', 'çiçek', 'monstera', 'saksı'], key: 'plant' },
  { keywords: ['mum', 'candle'], key: 'candle' },
  { keywords: ['koltuk', 'sandalye', 'chair'], key: 'chair' },
  { keywords: ['robot mutfak', 'arzum', 'mutfak robotu'], key: 'robot_kitchen' },
  { keywords: ['sehpa', 'masa ', 'table'], key: 'vintage_table' },
  { keywords: ['hava temizle', 'air purifier'], key: 'air_purifier' },
  { keywords: ['porselen', 'tabak', 'çanak', 'yemek seti'], key: 'porcelain' },
  { keywords: ['düzenleyici', 'organizer', 'bambu'], key: 'organizer' },
  { keywords: ['kırlent', 'yastık', 'cushion'], key: 'cushion' },
  { keywords: ['türk kahve', 'cezve'], key: 'turkish_coffee' },
  { keywords: ['saat', 'duvar saat', 'clock'], key: 'wall_clock' },
  { keywords: ['battaniye', 'blanket'], key: 'blanket' },
  { keywords: ['moka', 'bialetti', 'french press'], key: 'moka_pot' },
  { keywords: ['halı', 'carpet'], key: 'carpet' },
  { keywords: ['airfryer', 'fritöz'], key: 'airfryer' },
  { keywords: ['kurutma askısı', 'çamaşır askısı', 'kurutma'], key: 'drying_rack' },
  { keywords: ['spray bottle', 'sprey şişesi', 'spray'], key: 'spray_bottle' },

  // OTHER keywords
  { keywords: ['sırt çantası', 'backpack'], key: 'backpack' },
  { keywords: ['güneş gözlüğ', 'ray-ban', 'sunglasses'], key: 'sunglasses' },
  { keywords: ['ukulele', 'gitar', 'guitar'], key: 'guitar' },
  { keywords: ['satranç', 'chess'], key: 'chess' },
  { keywords: ['polaroid'], key: 'polaroid' },
  { keywords: ['cüzdan', 'wallet'], key: 'wallet' },
  { keywords: ['çakı', 'victorinox', 'bıçak'], key: 'swiss_knife' },
  { keywords: ['teleskop', 'telescope'], key: 'telescope' },
  { keywords: ['boya', 'paint', 'resim', 'tuval'], key: 'paint_set' },
  { keywords: ['kamp lambası', 'kamp lamba', 'camping lamba', 'camping lantern', 'lantern'], key: 'camping_lamp' },
  { keywords: ['vazo', 'seramik'], key: 'ceramic_vase' },
  { keywords: ['kayış', 'strap'], key: 'watch_strap' },
  { keywords: ['dürbün', 'binocular'], key: 'binoculars' },
];

// ============================================================
// FIND IMAGES FOR A GIVEN ITEM
// ============================================================

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesKeyword(text, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return false;

  const escapedKeyword = escapeRegExp(normalizedKeyword).replace(/\s+/g, '\\s+');
  const boundaryRegex = new RegExp(`(^|[^\\p{L}\\p{N}])${escapedKeyword}([^\\p{L}\\p{N}]|$)`, 'iu');
  return boundaryRegex.test(text);
}

function findImages(title) {
  // 1) Exact title match
  const key = TITLE_MAP[title];
  if (key && IMAGES[key]) return IMAGES[key];

  // 2) Keyword matching on lowercase title
  const lower = title.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (matchesKeyword(lower, kw)) {
        if (IMAGES[rule.key]) return IMAGES[rule.key];
      }
    }
  }

  // 3) Category-based fallback (will be used in the main function)
  return null;
}

const CATEGORY_FALLBACK = {
  clothing: 'white_shirt',
  toys: 'toy_general',
  electronics: 'phone',
  books: 'book_novel',
  sports: 'yoga_mat',
  home: 'cookware',
  other: 'backpack',
};

// ============================================================
// MAIN
// ============================================================

async function main() {
  const client = new Client({ connectionString: CONNECTION });
  await client.connect();
  console.log('Connected to Supabase');

  // Get all items
  const { rows: items } = await client.query(
    'SELECT id, title, category, images FROM public.items ORDER BY id'
  );
  console.log(`Found ${items.length} items to update`);

  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    let newImages = findImages(item.title);

    // If no match found, use category fallback
    if (!newImages) {
      const catKey = CATEGORY_FALLBACK[item.category] || 'book_novel';
      newImages = IMAGES[catKey];
      if (!newImages) {
        console.log(`  SKIP: No images for "${item.title}" (${item.category})`);
        skipped++;
        continue;
      }
    }

    // Pick 2-3 images from the available set for variety
    const imgCount = Math.min(newImages.length, 2 + Math.floor(Math.random() * 2));
    const selectedImages = newImages.slice(0, imgCount);

    try {
      await client.query(
        'UPDATE public.items SET images = $1::text[] WHERE id = $2::uuid',
        [selectedImages, item.id]
      );
      updated++;
      if (updated % 50 === 0) console.log(`  Updated ${updated}/${items.length}...`);
    } catch (err) {
      console.error(`  ERROR updating "${item.title}":`, err.message);
    }
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);

  // Verify: show 10 random items with their new images
  const { rows: sample } = await client.query(
    'SELECT title, category, images FROM public.items ORDER BY random() LIMIT 10'
  );
  console.log('\n--- Sample of updated items ---');
  for (const s of sample) {
    console.log(`[${s.category}] ${s.title}`);
    console.log(`  Images: ${s.images.join(', ').substring(0, 120)}...`);
  }

  await client.end();
}

main().catch(console.error);
