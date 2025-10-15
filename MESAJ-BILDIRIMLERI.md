# 📱 Mesaj Bildirimleri - Hızlı Başlangıç

## ✅ Kurulum Tamamlandı!

Mesaj bildirimi sistemi başarıyla kuruldu. Artık kullanıcılara mesaj geldiğinde otomatik push bildirimi gidiyor!

## 🚀 Hızlı Test

### 1. OneSignal REST API Key Al
```bash
# 1. https://onesignal.com/ → Login
# 2. Projeyi aç: "Takas Platform"
# 3. Settings & Metadata → Keys & IDs
# 4. REST API Key'i kopyala
```

### 2. .env.local Dosyasını Güncelle
```bash
# .env.local dosyasında bu satırı bul ve güncelle:
ONESIGNAL_REST_API_KEY="your-rest-api-key-here"
```

### 3. Test Sayfasını Aç
```bash
# Sunucu çalışıyorsa direkt:
http://localhost:3000/notification-test

# Veya başlat:
npm run dev
```

## 📋 Nasıl Çalışır?

### Otomatik Bildirim Akışı:
```
1. Kullanıcı A mesaj yazar
2. Chat.tsx → API'ye POST /api/messages/send
3. API mesajı Supabase'e kaydeder
4. API OneSignal'a push bildirimi gönderir
5. Kullanıcı B bildirim alır (sesli + görsel)
6. Supabase Realtime mesajı gerçek zamanlı gösterir
```

## 🎯 Kullanım Örnekleri

### Chat Bileşeni
```tsx
import Chat from '@/components/Chat';

<Chat 
  matchId="match-id-123"
  userId="current-user-id"
  otherUserId="other-user-id"
  otherUserName="Ali Yılmaz"
/>
```

### Direkt API Kullanımı
```typescript
const response = await fetch('/api/messages/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    match_id: "match-123",
    sender_id: "user-1",
    receiver_id: "user-2",
    content: "Merhaba!"
  })
});
```

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── api/
│   │   └── messages/
│   │       ├── route.ts          # Mesajları getir
│   │       └── send/
│   │           └── route.ts      # Mesaj gönder + bildirim
│   └── notification-test/
│       └── page.tsx              # Test sayfası
├── components/
│   ├── Chat.tsx                  # Mesajlaşma UI
│   └── OneSignalInit.tsx         # OneSignal + External User ID
└── lib/
    └── notifications.ts          # Bildirim helper fonksiyonları
```

## 🔔 Bildirim Türleri

✅ **Mesaj Bildirimi** - Hazır ve çalışıyor
- Kullanıcıya mesaj geldiğinde
- Sesli uyarı + görsel bildirim
- Otomatik badge sayısı artışı

🔄 **Eşleşme Bildirimi** - Fonksiyon hazır
```typescript
await sendMatchNotification(userId, otherUserName, itemName);
```

🔄 **Takas Onayı** - Fonksiyon hazır
```typescript
await sendTradeConfirmationNotification(userId, otherUserName, itemName);
```

## ⚙️ Özellikler

- ✅ **Realtime Mesajlaşma**: Supabase Realtime entegrasyonu
- ✅ **Push Bildirimler**: OneSignal REST API
- ✅ **External User ID**: Otomatik Supabase user ID senkronizasyonu
- ✅ **Sesli Bildirimler**: iOS ve Android için
- ✅ **Badge Güncellemeleri**: iOS bildirim sayaçları
- ✅ **Yüksek Öncelik**: Anında iletim
- ✅ **Deep Links**: Bildirime tıklandığında ilgili sayfaya yönlendirme

## 🐛 Sorun Giderme

### Bildirim Gelmiyor?
1. ✅ OneSignal REST API key tanımlı mı?
2. ✅ Kullanıcı bildirim izni verdi mi?
3. ✅ External User ID set edildi mi? (Konsol loglarına bak)
4. ✅ Farklı cihaz/tarayıcıda test ediyorsun değil mi?

### Konsol Logları
Başarılı olursa göreceğin loglar:
```
✅ OneSignal External User ID set: user-123
📱 Bildirim durumu: Başarılı ✅
✅ Push bildirim başarıyla gönderildi: notification-id
```

## 📖 Detaylı Dokümantasyon

Tüm detaylar için: **PUSH-NOTIFICATIONS-SETUP.md**

## 🎉 Hazırsın!

1. REST API Key'i ekle
2. Test sayfasını aç: `/notification-test`
3. Bildirime izin ver
4. Mesaj gönder ve bildirim al!

**Not:** Gerçek test için iki farklı cihaz veya tarayıcı kullan!
