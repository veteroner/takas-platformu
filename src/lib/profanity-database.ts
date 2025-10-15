/**
 * Türkçe Küfür ve Hakaret Filtreleme Veritabanı
 * 
 * KVKK Uyumlu: Bu liste yalnızca platforum güvenliği amacıyla kullanılır.
 * Son Güncelleme: 15 Ekim 2025
 */

export const profanityDatabase = {
  // Seviye 1: Açık küfür ve hakaret (Otomatik engelleme)
  severe: [
    // Temel küfürler
    'amk', 'amq', 'a.m.k', 'amına', 'aminakoyim', 'aminakoyayim', 'amina', 'aq', 'a.q',
    'orospu', 'o.rospu', 'orospucocugu', 'orosbucocugu', 'orospuçocuğu', 'oç', 'o.ç', 'piç',
    'yarrak', 'y.arrak', 'yarak', 'yarrağım', 'yarragim', 'yarrrak', 'yaarrrak',
    
    // Sik kelimesi ve türevleri (en yaygın)
    'sik', 's.ik', 'sikik', 'sikerim', 'sikeyim', 'sikim', 's.ikim',
    'sikiş', 'sikis', 'sikişelim', 'sikiselim', 'sikişmek', 'sikismek',
    'siktiğim', 'siktigim', 'sikti', 'sikti git', 'siktimin',
    'siktir', 's.iktir', 'siktir git', 'sg', 's.g', 'siktir et', 'sktir',
    'siksen', 'siksene', 'siksen de', 'siktim', 'sikecek',
    'sikilesi', 's.ikilesi', 'sikişken', 'sikik', 's.ikik',
    
    // Göt kelimesi ve türevleri
    'göt', 'g.öt', 'got', 'gotü', 'götü', 'gotveren', 'götveren',
    'götüne', 'gotune', 'götünü', 'gotunu', 'götoğlanı', 'gotoglanı',
    'göt lalesi', 'got lalesi', 'götlalesi', 'gotlalesi',
    'göt deliği', 'got deligi', 'götdeliği', 'gotdeligi',
    'götlek', 'gotlek', 'götçü', 'gotcu',
    
    // Amcık ve türevleri
    'amcık', 'a.mcık', 'amcik', 'a.mcik', 'amcığım', 'amcigim',
    'amcıklı', 'amcikli', 'amcığa', 'amciga',
    
    // Diğer küfürler
    'pezevenk', 'p.ezevenk', 'pezeveng', 'pezewenk', 'pezo',
    'puşt', 'pust', 'ibne', 'i.bne', 'ibine', 'ibneler',
    'kahpe', 'k.ahpe', 'kahbe', 'kaşar', 'k.aşar', 'kasar',
    'sürtük', 's.ürtük', 'surtuk', 'sürüngen', 'surungen',
    'fahişe', 'f.ahişe', 'fahise', 'oşar', 'o.şar',
    'dalyarak', 'd.alyarak', 'dallyarak', 'dalyarrak', 'dallama',
    'soysuz', 's.oysuz', 'soygun', 'piçkurusu', 'pockurusu',
    'bok', 'b.ok', 'boktan', 'b.oktan', 'bokum', 'boka',
    'gerizekalı', 'g.erizekalı', 'gerzek', 'salak', 's.alak', 
    'aptal', 'a.ptal', 'mal', 'm.al', 'dangalak', 'd.angalak', 
    'ahmak', 'a.hmak', 'salakça', 'aptalca',
    
    // Varyasyonlar (boşluk ve özel karakter içeren)
    'a m k', 'a m q', 'o r o s p u', 'o ç', 'p i ç',
    'a*k', 'o*ospu', 'p*ç', 's*k', 'g*t',
    'amk*', 'orospu*', 'sik*', 'göt*',
    's i k', 's i k e r i m', 's i k e y i m',
    'g ö t', 'g ö t ü n e',
    
    // Cinsel içerik
    'seks', 's.eks', 'porno', 'p.orno', 'sex', 's.ex',
    'sex yap', 'seks yap', 'seks yapalım', 'cinsel', 'c.insel',
    'mastürbasyon', 'masturbasyon', '31', 'otuzBir', 'otuz bir',
  ],

  // Seviye 2: Orta düzey rahatsız edici kelimeler (Uyarı)
  moderate: [
    'salak', 'aptal', 'mal', 'gerizekalı', 'ahmak', 'budala',
    'dangalak', 'embesil', 'geri zekalı', 'salağım', 'malsın',
    'sus', 'kes', 'kapa çeneni', 'defol', 'yallah', 'git', 'uzaklaş',
    'siktir git', 'git burdan', 'defol git', 'çık git',
    'beyin yoksunu', 'kafasız', 'akılsız', 'mantıksız', 'beyinsiz',
    'deli', 'kaçık', 'manyak', 'psikopat', 'sapık', 'sapik',
    'andaval', 'apış', 'avanak', 'ayı', 'ayyaş', 
    'beş para etmez', 'bez yüzlü', 'bön', 'budala',
    'cahil', 'çakal', 'çapsız', 'çürük', 'dallama',
    'densiz', 'domuz', 'dümbeleğ', 'dürzü', 'eşek',
    'eşşek', 'gavat', 'hayvan', 'hıyar', 'hödük',
    'it', 'kancık', 'kansız', 'keriz', 'kıro',
    'köpek', 'leş', 'mankafa', 'öküz', 'pislik',
    'rezil', 'serseri', 'şerefsiz', 'terbiyesiz', 'yaramaz',
    'zavallı', 'zebani', 'züppe', 'kaltak', 'kevaşe',
  ],

  // Seviye 3: Ayrımcılık ve nefret söylemi (Anında şiddetli ceza)
  hate: [
    'ırkçı', 'ırkçılık', 'nefret', 'ayrımcılık',
    'taciz', 'tehdit', 'öldür', 'ölüm', 'intihar',
    'tecavüz', 't.ecavüz', 'tecavuzcu',
    'pedo', 'p.edo', 'pedofil', 'p.edofil',
  ],

  // Whitelist: Yanlış pozitif önleme (Bu kelimeler içeren cümleler filtrelenmez)
  whitelist: [
    'sikiş', // (yer adı)
    'malzeme', 'malmö', 'normal', 'minimal', 'maksimal',
    'sikke', 'sikkeli', 'sikkelik',
    'masalcı', 'masal',
    'anormal', 'paranormal',
    'ithal', 'ithaf', 'itina', 'itibar',
    'delice', 'delibal', 'delicatessen',
    'gitme', 'gitmek', 'gitar', 'gitarla',
    'susam', 'susuz', 'susuzluk',
  ],

  // Özel karakterler ve normalizasyon kuralları
  normalizations: {
    'ı': 'i',
    'İ': 'i',
    'ğ': 'g',
    'Ğ': 'g',
    'ü': 'u',
    'Ü': 'u',
    'ş': 's',
    'Ş': 's',
    'ö': 'o',
    'Ö': 'o',
    'ç': 'c',
    'Ç': 'c',
    '*': '',
    '.': '',
    '_': '',
    '-': '',
    ' ': '',
    '0': 'o',
    '1': 'i',
    '3': 'e',
    '4': 'a',
    '5': 's',
    '7': 't',
    '8': 'b',
  }
}

/**
 * İhlal seviyeleri ve karşılık gelen cezalar
 */
export const violationLevels = {
  warning: {
    range: [1, 2],
    action: 'warning',
    message: '⚠️ Lütfen saygılı bir dil kullanın. Platformumuzda hakaret ve küfür yasaktır.',
    duration: 0
  },
  shortBan: {
    range: [3, 5],
    action: 'ban',
    message: '🚫 Çok fazla uygunsuz mesaj. 1 saat boyunca mesaj gönderemezsiniz.',
    duration: 60 // dakika
  },
  mediumBan: {
    range: [6, 10],
    action: 'ban',
    message: '🚫 Devam eden ihlaller nedeniyle 24 saat boyunca mesaj gönderemezsiniz.',
    duration: 1440 // dakika (24 saat)
  },
  longBan: {
    range: [11, Infinity],
    action: 'ban',
    message: '🚫 Çok sayıda ihlal nedeniyle 7 gün boyunca mesaj gönderemezsiniz.',
    duration: 10080 // dakika (7 gün)
  },
  hate: {
    range: [1, Infinity],
    action: 'ban',
    message: '🚫 Nefret söylemi ve tehdit içeren mesajlar nedeniyle hesabınız kalıcı olarak askıya alındı.',
    duration: 525600 // dakika (365 gün)
  }
}

/**
 * Regex desenleri (Gelişmiş filtreleme için)
 */
export const profanityPatterns = {
  // Tekrarlayan karakterler (örn: "aaaammmkkkk")
  repeatingChars: /(.)\1{2,}/g,
  
  // Gizlenmiş küfürler (örn: "a_m_k", "a.m.k")
  hiddenProfanity: /[a-z][\s._\-*]{1,3}[a-z]/gi,
  
  // Emoji ile kamuflaj (kontrol için basit pattern)
  emojiMixed: /[a-z]+[\u{1F000}-\u{1F9FF}]+[a-z]+/giu,
}

export type ViolationType = 'severe' | 'moderate' | 'hate'
export type ViolationAction = 'warning' | 'ban' | 'permanent_ban'

export interface FilterResult {
  isClean: boolean
  violationType?: ViolationType
  detectedWords: string[]
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical'
  action: ViolationAction | null
  message?: string
}
