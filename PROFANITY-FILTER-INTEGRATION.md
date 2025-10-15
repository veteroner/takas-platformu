# 🚀 Küfür Filtreleme Sistemi - Hızlı Entegrasyon Rehberi

## 📦 Adım 1: Veritabanı Kurulumu

### Supabase SQL Editor'de çalıştırın:

```sql
-- supabase/schema.sql dosyasındaki profanity filter bölümünü çalıştırın
-- (Satır 300'den sonraki kısım)
```

Veya terminal'den:

```bash
# Supabase CLI ile
supabase db reset
# veya sadece migration
supabase migration up
```

## 📝 Adım 2: Environment Variables

`.env.local` dosyasına ekleyin:

```bash
# Mevcut değişkenleriniz...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# ⚠️ Önemli: Service role key ekleyin (güvenli tutun!)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔧 Adım 3: Chat/Messages Componentinde Kullanım

### Örnek: Basit Entegrasyon

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useMessageFilter } from '@/hooks/useMessageFilter'
import { MessageFilterWarning, BanStatusBanner } from '@/components/MessageFilterWarning'
import { supabase } from '@/lib/supabase'

export default function ChatPage({ matchId, receiverId }: { matchId: string, receiverId: string }) {
  const [message, setMessage] = useState('')
  const [warning, setWarning] = useState<string | null>(null)
  const [isBanned, setIsBanned] = useState(false)
  const [banDetails, setBanDetails] = useState<any>(null)
  const [sending, setSending] = useState(false)
  
  const { isMessageClean, getWarningMessage } = useMessageFilter()

  // Ban durumunu kontrol et
  useEffect(() => {
    checkBanStatus()
  }, [])

  const checkBanStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const response = await fetch('/api/messages/filter', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    })

    if (response.ok) {
      const status = await response.json()
      setIsBanned(status.banned)
      if (status.banned) {
        setBanDetails(status)
      }
    }
  }

  const handleSend = async () => {
    if (!message.trim() || sending) return

    // Ban kontrolü
    if (isBanned) {
      setWarning('Mesaj gönderme yetkiniz askıya alındı.')
      return
    }

    setSending(true)
    setWarning(null)

    try {
      // 1. Frontend ön kontrolü (hızlı feedback için)
      if (!isMessageClean(message)) {
        const warningMsg = getWarningMessage(message, 0)
        setWarning(warningMsg)
        setSending(false)
        return
      }

      // 2. Backend filtreleme API'sine gönder
      const { data: { session } } = await supabase.auth.getSession()
      
      const filterResponse = await fetch('/api/messages/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          message,
          matchId,
          receiverId
        })
      })

      const filterResult = await filterResponse.json()

      // Mesaj engellendi
      if (!filterResult.allowed) {
        setWarning(filterResult.reason || filterResult.message)
        
        // Ban durumunu güncelle
        if (filterResult.bannedUntil) {
          setIsBanned(true)
          setBanDetails(filterResult)
        }
        
        setSending(false)
        return
      }

      // 3. Mesaj temiz - Supabase'e kaydet
      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: matchId,
          sender_id: session?.user.id,
          receiver_id: receiverId,
          content: message,
          read: false
        })

      if (error) throw error

      // Başarılı
      setMessage('')
      setWarning(null)

    } catch (error) {
      console.error('Message send error:', error)
      setWarning('Mesaj gönderilemedi. Lütfen tekrar deneyin.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Ban Banner (eğer banlıysa) */}
      {isBanned && banDetails && (
        <BanStatusBanner
          bannedUntil={banDetails.bannedUntil}
          reason={banDetails.reason}
          totalViolations={banDetails.totalViolations}
        />
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mesajlar buraya */}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        {/* Warning Message */}
        {warning && (
          <div className="mb-3">
            <MessageFilterWarning
              reason={warning}
              severity="high"
              onClose={() => setWarning(null)}
            />
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isBanned ? "Mesaj gönderemezsiniz" : "Mesajınızı yazın..."}
            disabled={isBanned || sending}
            className="flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isBanned || sending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Örnek: Real-time Validation

```tsx
'use client'

import { useMessageValidation } from '@/hooks/useMessageFilter'

export function MessageInputWithValidation({ onSend }: { onSend: (msg: string) => void }) {
  const {
    inputValue,
    warning,
    isValid,
    handleInputChange,
    clearInput
  } = useMessageValidation(0) // 0 = violation count

  const handleSend = async () => {
    if (!isValid || !inputValue.trim()) return
    
    await onSend(inputValue)
    clearInput()
  }

  return (
    <div>
      <textarea
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        className={`border rounded p-2 w-full ${!isValid ? 'border-red-500' : 'border-gray-300'}`}
        placeholder="Mesajınızı yazın..."
      />
      
      {warning && (
        <div className="text-red-600 text-sm mt-1">
          ⚠️ {warning}
        </div>
      )}
      
      <button
        onClick={handleSend}
        disabled={!isValid || !inputValue.trim()}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Gönder
      </button>
    </div>
  )
}
```

## 🧪 Adım 4: Test Edin

```typescript
// Test komutu
import { testFilter } from '@/lib/profanity-filter'

// Browser console'da test edin:
testFilter("Merhaba nasılsın?")  // ✅ Temiz
testFilter("Çok kötü bir şey")   // ⚠️ Orta
testFilter("amk")                 // ❌ Engellenir
```

## 📊 Adım 5: Admin Panel (İsteğe Bağlı)

```tsx
// src/app/admin/moderation/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ModerationPage() {
  const [violations, setViolations] = useState<any[]>([])

  useEffect(() => {
    loadViolations()
  }, [])

  const loadViolations = async () => {
    const { data } = await supabase
      .from('user_violations')
      .select(`
        *,
        users:user_id (name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    setViolations(data || [])
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">İhlal Logları</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Detected Words
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {violations.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {v.users?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {new Date(v.created_at).toLocaleString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${v.severity === 'critical' ? 'bg-red-100 text-red-800' : ''}
                    ${v.severity === 'high' ? 'bg-orange-100 text-orange-800' : ''}
                    ${v.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${v.severity === 'low' ? 'bg-blue-100 text-blue-800' : ''}
                  `}>
                    {v.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {v.action_taken}
                </td>
                <td className="px-6 py-4 text-sm">
                  {v.detected_words?.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

## ✅ Checklist

- [ ] Veritabanı şeması çalıştırıldı
- [ ] Environment variables eklendi
- [ ] API endpoint oluşturuldu (`/api/messages/filter`)
- [ ] Chat component'i güncellendi
- [ ] Frontend hook entegre edildi
- [ ] UI warning component eklendi
- [ ] Test edildi (temiz ve uygunsuz mesajlar)
- [ ] Ban sistemi test edildi
- [ ] KVKK dokümantasyonu güncellendi ✅ (Zaten hazır)

## 🎯 Sonraki Adımlar

1. **Prodüksiyon Hazırlığı:**
   - Küfür listesini gözden geçirin
   - False positive testleri yapın
   - Ceza sürelerini ayarlayın

2. **Monitoring:**
   - Violation istatistiklerini izleyin
   - False positive oranını takip edin
   - Kullanıcı şikayetlerini değerlendirin

3. **İyileştirmeler:**
   - AI-powered sentiment analysis ekleyin
   - Whitelist'i genişletin
   - Çoklu dil desteği ekleyin

## 🆘 Destek

Sorun yaşarsanız:
1. Browser console'da hataları kontrol edin
2. Supabase logs'u inceleyin
3. `PROFANITY-FILTER-SYSTEM.md` dosyasına bakın
4. GitHub Issues'da sorun bildirin

---

**Başarılar! 🎉**

Artık platformunuzda otomatik küfür filtreleme sistemi çalışıyor.
