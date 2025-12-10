/**
 * Admin 2FA (İki Faktörlü Doğrulama) Sistemi
 * 
 * E-posta tabanlı OTP (One-Time Password) kullanır.
 * Her admin girişinde 6 haneli kod e-posta ile gönderilir.
 */

// OTP geçerlilik süresi (5 dakika)
const OTP_VALIDITY_MS = 5 * 60 * 1000

// Memory-based OTP storage (production'da Redis kullanılmalı)
const otpStore = new Map<string, { code: string; expires: number; attempts: number }>()

// OTP temizleme (memory leak önleme)
let lastCleanup = Date.now()
function cleanupOtpStore() {
  const now = Date.now()
  if (now - lastCleanup > 60000) { // Her dakika
    for (const [key, value] of otpStore) {
      if (value.expires < now) otpStore.delete(key)
    }
    lastCleanup = now
  }
}

/**
 * 6 haneli rastgele OTP oluştur
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Admin için OTP oluştur ve sakla
 */
export function createAdminOTP(adminEmail: string): string {
  cleanupOtpStore()
  
  const code = generateOTP()
  const key = adminEmail.toLowerCase()
  
  otpStore.set(key, {
    code,
    expires: Date.now() + OTP_VALIDITY_MS,
    attempts: 0
  })
  
  return code
}

/**
 * OTP doğrula
 */
export function verifyAdminOTP(adminEmail: string, inputCode: string): { 
  valid: boolean
  error?: string 
} {
  cleanupOtpStore()
  
  const key = adminEmail.toLowerCase()
  const stored = otpStore.get(key)
  
  if (!stored) {
    return { valid: false, error: 'Doğrulama kodu bulunamadı. Yeni kod talep edin.' }
  }
  
  // Süre kontrolü
  if (stored.expires < Date.now()) {
    otpStore.delete(key)
    return { valid: false, error: 'Doğrulama kodunun süresi doldu. Yeni kod talep edin.' }
  }
  
  // Deneme sayısı kontrolü (max 5)
  if (stored.attempts >= 5) {
    otpStore.delete(key)
    return { valid: false, error: 'Çok fazla hatalı deneme. Yeni kod talep edin.' }
  }
  
  // Kod kontrolü
  if (stored.code !== inputCode) {
    stored.attempts++
    return { valid: false, error: `Hatalı kod. ${5 - stored.attempts} deneme hakkınız kaldı.` }
  }
  
  // Başarılı - kodu sil
  otpStore.delete(key)
  return { valid: true }
}

/**
 * Admin 2FA session token oluştur
 * @param adminEmail - Admin e-posta adresi
 * @param userId - Admin kullanıcı ID'si
 */
export function createAdmin2FAToken(adminEmail: string, userId?: string): string {
  // Simple token: email + userId + timestamp, base64 encoded
  const payload = {
    email: adminEmail.toLowerCase(),
    userId: userId || null,
    verified: true,
    exp: Date.now() + (60 * 60 * 1000) // 1 saat geçerli
  }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

/**
 * Admin 2FA token doğrula
 * @param token - Base64 encoded token
 * @param userId - Opsiyonel: Token'ın bu kullanıcıya ait olduğunu doğrula
 */
export function verifyAdmin2FAToken(token: string, userId?: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    if (!payload.verified || !payload.email || !payload.exp) {
      return false
    }
    
    if (payload.exp < Date.now()) {
      return false
    }
    
    // userId verilmişse, token'ın o kullanıcıya ait olup olmadığını kontrol et
    if (userId && payload.userId && payload.userId !== userId) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * E-posta ile OTP gönder (Supabase Edge Function veya SMTP)
 */
export async function sendOTPEmail(email: string, code: string): Promise<boolean> {
  try {
    // Supabase'in kendi auth.admin API'si ile e-posta gönder
    // veya Edge Function kullan
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials missing for OTP email')
      return false
    }
    
    // Geliştirme ortamında konsola yaz
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n🔐 ADMIN 2FA KODU: ${code} (${email})\n`)
      return true
    }
    
    // Production'da Supabase Edge Function çağır
    const response = await fetch(`${supabaseUrl}/functions/v1/send-admin-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ email, code })
    })
    
    return response.ok
  } catch (error) {
    console.error('OTP email send error:', error)
    return false
  }
}
