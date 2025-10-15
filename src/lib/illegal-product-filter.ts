/**
 * Yasadışı Ürün Filtreleme Sistemi
 * 
 * Bu modül ürün başlığı ve açıklamasını analiz ederek yasadışı içeriği engeller.
 * Türk Ceza Kanunu ve ilgili mevzuata uygun olarak tasarlanmıştır.
 * 
 * Kategoriler:
 * - Uyuşturucu ve madde bağımlılığı
 * - Silah, patlayıcı, tehlikeli maddeler
 * - Sahte/korsan ürünler
 * - Cinsel içerik
 * - Canlı hayvan ticareti
 * - Reçete gerektiren ilaçlar
 * - Kumar ve bahis
 * - Tütün ve alkol ürünleri
 * - Hırsızlık/dolandırıcılık riski
 */

export interface IllegalProductDatabase {
  // Uyuşturucu ve bağımlılık yapıcı maddeler
  drugs: string[]
  
  // Silah, patlayıcı, tehlikeli maddeler
  weapons: string[]
  
  // Sahte/korsan ürünler
  counterfeit: string[]
  
  // Cinsel içerik
  adult: string[]
  
  // Canlı hayvan (yasadışı ticaret)
  animals: string[]
  
  // Reçete gerektiren ilaçlar
  prescription: string[]
  
  // Kumar ve bahis
  gambling: string[]
  
  // Tütün ve alkol
  tobacco: string[]
  
  // Hırsızlık/dolandırıcılık riski
  suspicious: string[]
  
  // Diğer yasadışı içerik
  other: string[]
}

export const illegalProductDatabase: IllegalProductDatabase = {
  // UYUŞTURUCU VE BAĞIMLILIK YAPICI MADDELER
  drugs: [
    // Yaygın uyuşturucular
    'esrar', 'marijuana', 'cannabis', 'weed', 'ot', 'joint',
    'kokain', 'cocaine', 'coke', 'crack',
    'eroin', 'heroin', 'morphine', 'morfin',
    'ecstasy', 'mdma', 'ekstazi', 'hapı',
    'lsd', 'asit', 'acid',
    'methamphetamine', 'meth', 'crystal', 'metamfetamin',
    'bonzai', 'bonsai', 'sentetik', 'synthetic',
    'captagon', 'captogon', 'kaptagon',
    
    // Uyuşturucu argo ve varyasyonlar
    'hash', 'haşhaş', 'afyon', 'opium',
    'uyuşturucu', 'uyusturucu', 'narkotik',
    'madde', 'substance', 'doping',
    'hint keneviri', 'kenevir', 'hemp',
    'marihuana', 'mariguana',
    
    // Bağımlılık yapıcı kimyasallar
    'thinner', 'tiner', 'bally', 'balon',
    'tutkal', 'glue sniffing', 'solvent',
    'nitrous oxide', 'azot', 'gülen gaz',
    
    // Argo terimler
    'çekme', 'çekmek', 'kafası', 'trip',
    'trip atmak', 'uçmak', 'high', 'stoned',
    'dealer', 'satıcı', 'tedarik', 'temin',
  ],

  // SİLAH, PATLAYICI, TEHLİKELİ MADDELER
  weapons: [
    // Ateşli silahlar
    'silah', 'gun', 'tabanca', 'pistol', 'revolver',
    'tüfek', 'rifle', 'av tüfeği', 'shotgun',
    'otomatik silah', 'automatic', 'makineli',
    'ak-47', 'ak47', 'kalaşnikof', 'kalashnikov',
    'glock', 'beretta', 'colt', 'smith wesson',
    
    // Kesici aletler (tehlikeli bağlamda)
    'bıçak', 'knife', 'kama', 'dagger', 'hançer',
    'kasatura', 'pala', 'machete', 'saldırı bıçağı',
    'süngü', 'bayonet', 'combat knife',
    
    // Patlayıcılar
    'bomba', 'bomb', 'patlayıcı', 'explosive',
    'el bombası', 'grenade', 'dinamit', 'dynamite',
    'tnt', 'c4', 'plastik patlayıcı',
    'molotof', 'molotov', 'molotov kokteylli',
    'barut', 'gunpowder', 'fünye', 'detonator',
    
    // Tehlikeli kimyasallar
    'asit', 'acid', 'sülfürik asit', 'nitrik asit',
    'zehir', 'poison', 'toksin', 'toxin',
    'siyanür', 'cyanide', 'arsenik', 'arsenic',
    'ricin', 'antraks', 'anthrax',
    
    // Elektroşok ve saldırı aletleri
    'elektroşok', 'taser', 'şok tabancası',
    'biber gazı', 'pepper spray', 'göz yaşartıcı',
    'cop', 'jop', 'sopa', 'baton',
    'kelepçe', 'handcuff', 'kelepce',
    'sapan', 'slingshot', 'yay', 'bow', 'ok', 'arrow',
  ],

  // SAHTE/KORSAN ÜRÜNLER
  counterfeit: [
    'sahte', 'fake', 'replika', 'replica',
    'kopya', 'copy', 'taklit', 'imitation',
    'korsan', 'pirate', 'bootleg',
    'çakma', 'orijinal değil', 'not original',
    '1:1', 'aaa kalite', 'high quality fake',
    'yüksek kalite kopya', 'mirror quality',
    'super clone', 'süper klon',
  ],

  // CİNSEL İÇERİK
  adult: [
    // Cinsel ürünler
    'seks', 'sex', 'erotik', 'erotic',
    'porno', 'porn', 'xxx', 'adult',
    'cinsel', 'sexual', 'sex toy', 'seks oyuncağı',
    'vibratör', 'vibrator', 'dildo',
    'prezervatif', 'condom', 'jel', 'lubricant',
    
    // Escort ve fuhuş
    'escort', 'eskort', 'masaj', 'massage',
    'bayan arkadaş', 'hostess', 'model aranıyor',
    'özel hizmet', 'özel masaj', 'tantra',
  ],

  // CANLI HAYVAN (Yasadışı ticaret)
  animals: [
    'köpek yavrusu', 'kedi yavrusu', 'puppy', 'kitten',
    'satılık hayvan', 'hayvan satışı', 'pet for sale',
    'kuş satışı', 'papağan', 'parrot', 'muhabbet kuşu',
    'akvaryum balığı', 'fish for sale',
    'yılan', 'snake', 'kertenkele', 'lizard',
    'hamster', 'tavşan', 'rabbit', 'guinea pig',
    'pitbull', 'rottweiler', 'kangal', 'dogo',
    // Not: Evcil hayvan ticareti platformunuzda yasak ise
  ],

  // REÇETE GEREKTİREN İLAÇLAR
  prescription: [
    // Antibiyotikler
    'antibiyotik', 'antibiotic', 'penisilin', 'penicillin',
    'amoksisilin', 'amoxicillin', 'augmentin',
    
    // Ağrı kesiciler (reçeteli)
    'tramadol', 'oxycontin', 'percocet', 'vicodin',
    'kodein', 'codeine', 'morfin', 'morphine',
    
    // Psikiyatrik ilaçlar
    'antidepresan', 'antidepressant', 'prozac', 'xanax',
    'valium', 'diazepam', 'rivotril', 'clonazepam',
    'ritalin', 'concerta', 'strattera',
    
    // Uyku ilaçları
    'uyku ilacı', 'sleeping pill', 'stilnox', 'zolpidem',
    'rohypnol', 'flunitrazepam',
    
    // Diğer reçeteli ilaçlar
    'viagra', 'cialis', 'levitra', 'kamagra',
    'steroid', 'anabolik', 'testosteron', 'testosterone',
    'büyüme hormonu', 'growth hormone', 'hgh',
    'insülin', 'insulin',
    
    // Genel
    'reçeteli', 'prescription', 'ilaç', 'drug', 'medicine',
    'hap', 'pill', 'tablet', 'kapsül', 'capsule',
  ],

  // KUMAR VE BAHİS
  gambling: [
    'kumar', 'gambling', 'bahis', 'bet', 'betting',
    'poker', 'blackjack', '21', 'rulet', 'roulette',
    'slot machine', 'slot', 'jackpot',
    'casino', 'kazino', 'kumarhane',
    'illegal bahis', 'yasadışı bahis',
    'sanal bahis', 'online casino',
    'iddaa', 'futbol bahsi', 'sports betting',
  ],

  // TÜTÜN VE ALKOL
  tobacco: [
    'sigara', 'cigarette', 'tobacco', 'tütün',
    'puro', 'cigar', 'sigara kağıdı', 'rolling paper',
    'nargile', 'shisha', 'hookah', 'nargile tütünü',
    'elektronik sigara', 'e-cigarette', 'vape', 'mod',
    'likid', 'liquid', 'ejuice', 'e-juice',
    
    'alkol', 'alcohol', 'içki', 'drink',
    'viski', 'whiskey', 'vodka', 'rakı', 'raki',
    'bira', 'beer', 'şarap', 'wine', 'şampanya',
    'rom', 'rum', 'tekila', 'tequila', 'cin', 'gin',
    'likör', 'liqueur', 'aperatif', 'kokteyl',
    'kaçak içki', 'sahte içki', 'bootleg alcohol',
  ],

  // HIRSIZLIK/DOLANDIRICILIK RİSKİ
  suspicious: [
    'çalıntı', 'stolen', 'hırsız', 'thief',
    'kayıp eşya', 'lost item', 'bulunmuş', 'found',
    'faturasız', 'no invoice', 'belgesiz', 'no documents',
    'seri numarasız', 'no serial number',
    'imei kayıtlı değil', 'clean imei', 'temiz imei',
    'kilitli telefon', 'locked phone', 'icloud locked',
    'şifreli', 'password locked', 'şifresini bilmiyorum',
    'garantisi yok', 'no warranty', 'garanti geçersiz',
    'kaçak', 'smuggled', 'gümrüksüz',
    'kaçak telefon', 'yurt dışı getirme',
  ],

  // DİĞER YASADIŞI İÇERİK
  other: [
    // Dolandırıcılık şemaları
    'piramit', 'pyramid scheme', 'ponzi',
    'garanti getiri', 'guaranteed profit',
    'kolay para', 'easy money', 'hızlı zengin',
    'mlm', 'network marketing', 'şebeke pazarlama',
    
    // Kimlik bilgileri
    'kimlik', 'id card', 'ehliyet', 'driving license',
    'pasaport', 'passport', 'vize', 'visa',
    'diploma', 'sertifika satışı', 'certificate sale',
    
    // Hacking/illegal digital
    'hack', 'hacked', 'çalıntı hesap', 'stolen account',
    'netflix hesap', 'spotify hesap', 'hesap satışı',
    'crack', 'keygen', 'serial key', 'lisans anahtarı',
    'şifre', 'password', 'kredi kartı', 'credit card',
    
    // Organ bağışı/satışı (yasadışı)
    'organ', 'böbrek', 'kidney', 'karaciğer', 'liver',
    'kan', 'blood', 'plazma', 'plasma',
    
    // Tehlikeli/yasadışı hizmetler
    'kiralık katil', 'hitman', 'suikast',
    'sahte sertifika', 'fake certificate',
    'sahte diploma', 'fake degree',
    'para aklama', 'money laundering',
  ]
}

export type IllegalCategory = keyof IllegalProductDatabase
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface IllegalProductResult {
  isClean: boolean
  detectedWords: Array<{
    word: string
    category: IllegalCategory
  }>
  riskLevel: RiskLevel
  categories: IllegalCategory[]
  message?: string
  shouldBlock: boolean
}

/**
 * Metni normalize eder (Türkçe karakterler, boşluklar, özel karakterler)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ') // Özel karakterleri boşluğa çevir
    .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa indir
}

/**
 * Risk seviyesi belirleme
 */
function determineRiskLevel(categories: IllegalCategory[]): RiskLevel {
  // Critical risk: Silah, uyuşturucu, patlayıcı
  if (categories.some(cat => ['drugs', 'weapons'].includes(cat))) {
    return 'critical'
  }
  
  // High risk: Reçeteli ilaç, canlı hayvan, hırsızlık
  if (categories.some(cat => ['prescription', 'suspicious', 'animals'].includes(cat))) {
    return 'high'
  }
  
  // Medium risk: Tütün, alkol, kumar
  if (categories.some(cat => ['tobacco', 'gambling', 'adult'].includes(cat))) {
    return 'medium'
  }
  
  // Low risk: Sahte ürün
  if (categories.includes('counterfeit')) {
    return 'low'
  }
  
  return 'low'
}

/**
 * Kullanıcı dostu hata mesajı oluştur
 */
function createUserMessage(categories: IllegalCategory[], riskLevel: RiskLevel): string {
  const categoryMessages: Record<IllegalCategory, string> = {
    drugs: '🚫 Uyuşturucu ve bağımlılık yapıcı madde satışı yasaktır.',
    weapons: '🚫 Silah, patlayıcı ve tehlikeli madde satışı yasaktır.',
    counterfeit: '⚠️ Sahte ve korsan ürün satışı yasaktır.',
    adult: '🔞 Cinsel içerikli ürün satışı yasaktır.',
    animals: '🐾 Canlı hayvan ticareti platformumuzda yasaktır.',
    prescription: '💊 Reçeteli ilaç satışı yasaktır.',
    gambling: '🎰 Kumar ve bahis içeriği yasaktır.',
    tobacco: '🚬 Tütün ve alkol ürünleri satışı yasaktır.',
    suspicious: '⚠️ Şüpheli içerik tespit edildi. Lütfen kontrol edin.',
    other: '⚠️ Yasadışı içerik tespit edildi.'
  }

  const messages = categories.map(cat => categoryMessages[cat])
  
  if (riskLevel === 'critical') {
    return `${messages.join(' ')} Bu tür içerikler ciddi yasal yaptırımlara tabidir.`
  }
  
  return messages.join(' ')
}

/**
 * Ürün başlığı ve açıklamasını yasadışı içerik açısından kontrol eder
 */
export function detectIllegalProduct(title: string, description?: string): IllegalProductResult {
  const fullText = `${title} ${description || ''}`.trim()
  
  if (!fullText) {
    return {
      isClean: true,
      detectedWords: [],
      riskLevel: 'low',
      categories: [],
      shouldBlock: false
    }
  }

  const normalizedText = normalizeText(fullText)
  const detectedWords: Array<{ word: string; category: IllegalCategory }> = []
  const categories = new Set<IllegalCategory>()

  // Her kategoriyi kontrol et
  for (const [category, words] of Object.entries(illegalProductDatabase)) {
    for (const word of words) {
      const normalizedWord = normalizeText(word)
      
      // Tam kelime eşleşmesi veya kelime içinde geçme kontrolü
      const wordRegex = new RegExp(`\\b${normalizedWord.replace(/\s+/g, '\\s+')}\\b`, 'i')
      
      if (wordRegex.test(normalizedText)) {
        detectedWords.push({
          word,
          category: category as IllegalCategory
        })
        categories.add(category as IllegalCategory)
      }
    }
  }

  // Sonuç değerlendirmesi
  if (detectedWords.length === 0) {
    return {
      isClean: true,
      detectedWords: [],
      riskLevel: 'low',
      categories: [],
      shouldBlock: false
    }
  }

  const categoriesArray = Array.from(categories)
  const riskLevel = determineRiskLevel(categoriesArray)
  const message = createUserMessage(categoriesArray, riskLevel)

  return {
    isClean: false,
    detectedWords,
    riskLevel,
    categories: categoriesArray,
    message,
    shouldBlock: true
  }
}

/**
 * Test fonksiyonu (Development için)
 */
export function testIllegalFilter(title: string, description?: string) {
  console.log('🧪 Testing illegal product filter')
  console.log('Title:', title)
  console.log('Description:', description)
  
  const result = detectIllegalProduct(title, description)
  console.log('📊 Result:', result)
  
  return result
}
