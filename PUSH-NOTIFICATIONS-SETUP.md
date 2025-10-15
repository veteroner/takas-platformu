# 📱 Push Bildirimleri Kurulum Rehberi

## ✅ Tamamlanan İşlemler

### 1. OneSignal Entegrasyonu
- ✅ OneSignal App ID: `f26d64d9-c8c9-48ee-a472-f12cc5c8b629`
- ✅ Notification helper fonksiyonları: `/src/lib/notifications.ts`
- ✅ Mesaj API'si: `/src/app/api/messages/send/route.ts`
- ✅ Mesaj listeleme API'si: `/src/app/api/messages/route.ts`
- ✅ Realtime chat bileşeni: `/src/components/Chat.tsx`

### 2. Özellikler
✅ **Mesaj Bildirimleri**: Kullanıcıya mesaj geldiğinde otomatik bildirim
✅ **Realtime Mesajlaşma**: Supabase Realtime ile anlık mesaj güncellemeleri
✅ **Sesli Bildirimler**: iOS ve Android için sesli uyarılar
✅ **Badge Sayıları**: iOS'ta bildirim sayısını gösterir
✅ **Yüksek Öncelik**: Anında iletilen bildirimler
✅ **Özel Veri**: Bildirime tıklandığında ilgili sayfaya yönlendirme

### 3. Bildirim Türleri

#### 💬 Mesaj Bildirimi
```typescript
await sendMessageNotification(
  receiverId,
  senderName,
  messageText,
  matchId
);
```

#### 🎉 Eşleşme Bildirimi
```typescript
await sendMatchNotification(
  userId,
  otherUserName,
  itemName
);
```

#### ✅ Takas Onayı Bildirimi
```typescript
await sendTradeConfirmationNotification(
  userId,
  otherUserName,
  itemName
);
```

#### 📢 Genel Bildirim
```typescript
await sendGeneralNotification(
  [userId1, userId2],
  "Başlık",
  "Mesaj içeriği",
  "/url-path"
);
```

## 🔧 Kurulum Adımları

### Adım 1: OneSignal REST API Key Al
1. [OneSignal Dashboard](https://onesignal.com/) üzerinden giriş yap
2. Projeye git: **Takas Platform**
3. **Settings & Metadata** → **Keys & IDs**
4. **REST API Key** kopyala

### Adım 2: .env.local Dosyasını Güncelle
```bash
# .env.local dosyasındaki bu satırı güncelle:
ONESIGNAL_REST_API_KEY="your-actual-rest-api-key"
```

### Adım 3: Supabase RLS Politikalarını Kontrol Et
Messages tablosu zaten mevcut ve RLS politikaları aktif:
```sql
-- Users can view own messages
CREATE POLICY "Users can view own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Users can insert own messages
CREATE POLICY "Users can insert own messages" ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);
```

### Adım 4: OneSignal'da External User ID Ayarla
Kullanıcı login olduğunda OneSignal'a External User ID set et:

```typescript
// OneSignal initialization'dan sonra
import OneSignal from 'react-onesignal';

// Kullanıcı login olduğunda
OneSignal.setExternalUserId(user.id); // Supabase user ID
```

## 📋 Test Senaryosu

### 1. İki Kullanıcı ile Test
```bash
# Kullanıcı A - Chrome
- Login ol
- OneSignal bildirimlerine izin ver
- External User ID set edildiğini konsol'da kontrol et

# Kullanıcı B - Farklı tarayıcı/cihaz
- Login ol  
- Kullanıcı A'ya mesaj gönder
```

### 2. Konsol Logları
Mesaj gönderildiğinde API'de göreceğin loglar:
```
✅ Push bildirim başarıyla gönderildi: <notification-id>
📱 Bildirim durumu: Başarılı ✅
```

### 3. Kullanıcı A'da Görülecekler
- ✅ Push bildirimi gelir
- ✅ Bildirim sesli çalar
- ✅ Bildirime tıklayınca chat sayfası açılır
- ✅ Mesaj gerçek zamanlı görünür

## 🎯 Kullanım Örnekleri

### Chat Bileşeninde Kullanım
```tsx
import Chat from '@/components/Chat';

<Chat 
  matchId="match-123"
  userId="current-user-id"
  otherUserId="other-user-id"
  otherUserName="Ali Yılmaz"
/>
```

### API'den Direkt Mesaj Gönderme
```typescript
const response = await fetch('/api/messages/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    match_id: "match-123",
    sender_id: "user-1",
    receiver_id: "user-2",
    content: "Merhaba! Takas yapmak ister misin?"
  })
});

const data = await response.json();
console.log('Bildirim gönderildi:', data.notification_sent);
```

## 🔔 Android Channel Ayarları

OneSignal'da aşağıdaki notification channel'lar tanımlı:
- **messages**: Mesaj bildirimleri (yüksek öncelik, sesli)
- **general**: Genel bildirimler (normal öncelik)

## 🚀 Gelişmiş Özellikler

### 1. Grup Bildirimleri
Birden fazla kullanıcıya aynı anda bildirim:
```typescript
await sendGeneralNotification(
  [userId1, userId2, userId3],
  "Yeni Özellik!",
  "Platformda yeni özellikler yayında!"
);
```

### 2. Görsel İçeren Bildirimler
```typescript
await sendPushNotification({
  userIds: [userId],
  title: "Yeni Eşleşme!",
  message: "Ali ile eşleştin!",
  imageUrl: "https://example.com/item-image.jpg",
  url: "/matches"
});
```

### 3. Zamanlanmış Bildirimler
OneSignal Dashboard üzerinden zamanlanmış bildirimler oluşturabilirsiniz.

## 📊 Analitik ve İzleme

### OneSignal Dashboard'da İzle
1. **Delivery Metrics**: Kaç bildirim gönderildi/teslim edildi
2. **Click Through Rate**: Bildirime tıklama oranı
3. **User Engagement**: Kullanıcı etkileşim metrikleri

### Konsol Logları
```typescript
console.log('✅ Push bildirim başarıyla gönderildi');
console.log('❌ OneSignal bildirim hatası');
console.log('⚠️ OneSignal REST API key tanımlanmamış');
```

## ⚠️ Önemli Notlar

1. **REST API Key**: Sunucu tarafında kullanılır, asla client-side'a ekleme!
2. **External User ID**: Her kullanıcı için mutlaka Supabase user ID'si set edilmeli
3. **Bildirim İzinleri**: Kullanıcı bildirim izni vermeden bildirim gönderilemez
4. **Realtime**: Mesajlar hem push bildirim hem de Supabase Realtime ile gelir
5. **TTL**: Bildirimler 24 saat boyunca geçerlidir

## 🐛 Sorun Giderme

### Bildirim Gelmiyor
1. ✅ OneSignal REST API key doğru mu?
2. ✅ External User ID set edildi mi?
3. ✅ Kullanıcı bildirim izni verdi mi?
4. ✅ OneSignal Dashboard'da bildirim delivery durumu nedir?

### Realtime Mesajlar Gelmiyor
1. ✅ Supabase Realtime aktif mi?
2. ✅ RLS politikaları doğru mu?
3. ✅ Match ID doğru mu?

### API Hataları
1. ✅ Supabase connection string doğru mu?
2. ✅ Messages tablosu var mı?
3. ✅ Kullanıcı authenticated mi?

## 📞 Destek

Sorun yaşarsan:
1. Konsol loglarını kontrol et
2. OneSignal Dashboard'u kontrol et
3. Supabase logs'u kontrol et
4. GitHub Issues'a yaz

---

**🎉 Tebrikler!** Mesajlaşma ve bildirim sistemi aktif! Kullanıcılar artık mesaj aldığında anında bildirim alacak.
