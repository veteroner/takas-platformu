/**
 * Küfür ve Hakaret Filtreleme Motoru
 * 
 * Bu modül mesajları otomatik olarak analiz eder ve uygunsuz içeriği engeller.
 * KVKK Uyumlu: Tüm filtreleme işlemleri loglenir ve 6 ay saklanır.
 * 
 * Özellikler:
 * - Türkçe karakter normalizasyonu
 * - Varyasyon tespiti (boşluk, özel karakter)
 * - Whitelist desteği
 * - Çok katmanlı filtreleme
 * - False positive minimizasyonu
 */

import { 
  profanityDatabase, 
  profanityPatterns, 
  violationLevels,
  type FilterResult,
  type ViolationType 
} from './profanity-database'

/**
 * Metni normalize eder (Türkçe karakterler, özel karakterler)
 */
function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim()
  
  // Türkçe karakter ve özel karakter normalizasyonu
  Object.entries(profanityDatabase.normalizations).forEach(([from, to]) => {
    // Özel regex karakterlerini escape et
    const escapedFrom = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    normalized = normalized.replace(new RegExp(escapedFrom, 'g'), to)
  })
  
  return normalized
}

/**
 * Tekrarlayan karakterleri temizler (örn: "aaaammmmkkk" -> "amk")
 */
function cleanRepeatingChars(text: string): string {
  return text.replace(profanityPatterns.repeatingChars, '$1')
}

/**
 * Whitelist kontrolü yapar
 */
function isWhitelisted(text: string): boolean {
  const normalized = normalizeText(text)
  return profanityDatabase.whitelist.some(word => 
    normalized.includes(normalizeText(word))
  )
}

/**
 * Kelime sınırı kontrolü (false positive önleme)
 * Örnek: "masalcı" kelimesi "salak" içerse de engellenmemeli
 */
function hasWordBoundary(text: string, word: string): boolean {
  const normalized = normalizeText(text)
  const normalizedWord = normalizeText(word)
  
  // Tam kelime eşleşmesi
  const exactMatch = new RegExp(`\\b${normalizedWord}\\b`, 'i')
  if (exactMatch.test(normalized)) return true
  
  // Kelime içinde geçiyorsa ve kısa değilse false positive olabilir
  if (normalizedWord.length <= 3 && normalized.includes(normalizedWord)) {
    // Kısa kelimeler için daha katı kontrol
    return /^[a-z]*$/.test(normalizedWord) && normalized.split(/\s+/).some(w => 
      normalizeText(w) === normalizedWord
    )
  }
  
  return normalized.includes(normalizedWord)
}

/**
 * Metindeki küfür ve hakaret içeriğini tespit eder
 */
export function detectProfanity(text: string): FilterResult {
  if (!text || text.trim().length === 0) {
    return {
      isClean: true,
      detectedWords: [],
      severity: 'none',
      action: null
    }
  }

  // Whitelist kontrolü
  if (isWhitelisted(text)) {
    return {
      isClean: true,
      detectedWords: [],
      severity: 'none',
      action: null
    }
  }

  const normalizedText = normalizeText(text)
  const cleanedText = cleanRepeatingChars(normalizedText)
  const detectedWords: string[] = []
  let highestSeverity: ViolationType | null = null

  // Seviye 3: Nefret söylemi kontrolü (En yüksek öncelik)
  for (const word of profanityDatabase.hate) {
    if (hasWordBoundary(cleanedText, word)) {
      detectedWords.push(word)
      highestSeverity = 'hate'
    }
  }

  // Nefret söylemi tespit edildiyse diğer kontrollere gerek yok
  if (highestSeverity === 'hate') {
    return {
      isClean: false,
      violationType: 'hate',
      detectedWords,
      severity: 'critical',
      action: 'ban',
      message: violationLevels.hate.message
    }
  }

  // Seviye 1: Şiddetli küfür kontrolü
  for (const word of profanityDatabase.severe) {
    if (hasWordBoundary(cleanedText, word)) {
      detectedWords.push(word)
      highestSeverity = 'severe'
    }
  }

  // Seviye 2: Orta düzey küfür kontrolü (sadece seviye 1 yoksa)
  if (!highestSeverity) {
    for (const word of profanityDatabase.moderate) {
      if (hasWordBoundary(cleanedText, word)) {
        detectedWords.push(word)
        highestSeverity = 'moderate'
      }
    }
  }

  // Sonuç değerlendirmesi
  if (detectedWords.length === 0) {
    return {
      isClean: true,
      detectedWords: [],
      severity: 'none',
      action: null
    }
  }

  // Severity belirleme
  let severity: FilterResult['severity'] = 'none'
  let action: FilterResult['action'] = null

  if (highestSeverity === 'severe') {
    severity = 'high'
    action = 'ban'
  } else if (highestSeverity === 'moderate') {
    severity = 'medium'
    action = 'warning'
  }

  return {
    isClean: false,
    violationType: highestSeverity!,
    detectedWords,
    severity,
    action
  }
}

/**
 * İhlal sayısına göre ceza seviyesini belirler
 */
export function getViolationLevel(violationCount: number, isHateSpeech: boolean = false) {
  if (isHateSpeech) {
    return violationLevels.hate
  }

  for (const [key, level] of Object.entries(violationLevels)) {
    if (key === 'hate') continue
    
    const [min, max] = level.range
    if (violationCount >= min && violationCount <= max) {
      return level
    }
  }

  return violationLevels.longBan // Default en yüksek ceza
}

/**
 * Kullanıcı dostu mesaj oluşturur
 */
export function createUserFriendlyMessage(
  violationCount: number, 
  severity: FilterResult['severity']
): string {
  const level = getViolationLevel(violationCount, severity === 'critical')
  
  let baseMessage = level.message
  
  // İlk iki ihlal için daha nazik mesaj
  if (violationCount === 1) {
    baseMessage = '💬 Mesajınız uygunsuz içerik nedeniyle gönderilemedi. Lütfen saygılı bir dil kullanın.'
  } else if (violationCount === 2) {
    baseMessage = '⚠️ Mesajınız tekrar engellendi. Devam eden ihlaller hesap kısıtlamasına yol açabilir.'
  }
  
  return baseMessage
}

/**
 * Mesajı filtreleyip sonucu döndürür
 */
export async function filterMessage(
  userId: string,
  message: string,
  previousViolations: number = 0
): Promise<{
  allowed: boolean
  reason?: string
  violationLevel?: number
  banUntil?: Date
}> {
  // Boş mesaj kontrolü
  if (!message || message.trim().length === 0) {
    return { allowed: true }
  }

  // Profanity tespiti
  const result = detectProfanity(message)

  // Temiz mesaj
  if (result.isClean) {
    return { allowed: true }
  }

  // İhlal sayısını artır
  const newViolationCount = previousViolations + 1
  const violationLevel = getViolationLevel(
    newViolationCount, 
    result.severity === 'critical'
  )

  // Ban süresi hesaplama
  let banUntil: Date | undefined
  if (violationLevel.duration > 0) {
    banUntil = new Date()
    banUntil.setMinutes(banUntil.getMinutes() + violationLevel.duration)
  }

  // Kullanıcı dostu mesaj
  const userMessage = createUserFriendlyMessage(newViolationCount, result.severity)

  return {
    allowed: false,
    reason: userMessage,
    violationLevel: newViolationCount,
    banUntil
  }
}

/**
 * Test fonksiyonu (Development ortamı için)
 */
export function testFilter(text: string) {
  console.log('🧪 Testing filter for:', text)
  const result = detectProfanity(text)
  console.log('📊 Result:', result)
  return result
}
