# 💬 Kullanıcı Engelleme, Şikayet ve Mesaj Bildirimi Sistemi

## 📋 Genel Bakış

Bu sistem, kullanıcıların birbirini engellemesi, şikayet etmesi ve mesaj bildirimlerini yönetmesi için kapsamlı bir çözüm sunar.

## 🎯 Özellikler

### 1. ✅ Kullanıcı Engelleme Sistemi

**Özellikler:**
- Kullanıcıları tek tıkla engelleme
- Engel kaldırma imkanı
- Engellenmiş kullanıcılarla mesajlaşma otomatik engellenir
- Engelleme sonrası aktif match'ler kapanır
- Ürünler birbirine gösterilmez

**Engelleme Sonuçları:**
- ❌ Birbirinize mesaj gönderemezsiniz
- ❌ Eşleşmeleriniz silinir
- ❌ Ürünlerinizi göremezsiniz
- ❌ Yeni match oluşamaz

### 2. 📢 Şikayet Sistemi

**Şikayet Türleri:**

Şikayet türleri `/src/constants/reportTypes.ts` dosyasında merkezi olarak yönetilir:

1. **Taciz (harassment)** - Rahatsız edici veya istenmeyen davranışlar
2. **Tehdit (threat)** - Fiziksel veya psikolojik tehdit içeriği
3. **Spam** - İstenmeyen reklam veya spam içerik
4. **Uygunsuz İçerik (inappropriate)** - Müstehcen, şiddet içeren veya uygunsuz içerik
5. **Dolandırıcılık (scam)** - Dolandırıcılık girişimi veya sahte profil
6. **Diğer (other)** - Yukarıdakilerden farklı bir sebep

**Şikayet Süreci:**
1. Kullanıcı şikayet eder
2. Şikayet "pending" durumuna geçer
3. Admin incelemeye başlar ("investigating")
4. Karar verilir ("resolved" veya "dismissed")

**Admin İstatistikleri:**
- Toplam şikayet sayısı
- Bekleyen şikayetler
- Çözülen şikayetler
- En çok şikayet edilen kullanıcılar
- Şikayet türlerine göre dağılım

### 3. 🔔 Mesaj Bildirimi Sistemi

**Özellikler:**
- Okunmamış mesaj sayısı real-time güncellenir
- Bottom navigation'da badge gösterimi
- Chat list'te match başına okunmamış sayısı
- Mesaj okunduğunda otomatik güncelleme
- WebSocket ile real-time subscriptions

**Badge Gösterimleri:**
- 🔴 Ana sayfada: Toplam okunmamış mesaj sayısı
- 🔴 Chat list'te: Match başına okunmamış sayısı
- 99+ için üst limit

## 🏗️ Teknik Mimari

### Database Şeması

```sql
-- Kullanıcı engelleme tablosu
CREATE TABLE user_blocks (
  id UUID PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES users(id),
  blocked_id UUID NOT NULL REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- Kullanıcı şikayetleri tablosu
CREATE TABLE user_reports (
  id UUID PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_id UUID NOT NULL REFERENCES users(id),
  report_type TEXT NOT NULL CHECK (...),
  description TEXT NOT NULL,
  evidence JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Database Fonksiyonları

**1. is_user_blocked(user1_id, user2_id)**
```sql
-- İki kullanıcı arasında engelleme var mı kontrol eder
RETURNS BOOLEAN
```

**2. block_user(blocker_id, blocked_id, reason)**
```sql
-- Kullanıcıyı engeller ve match'leri kapatır
RETURNS UUID -- block_id
```

**3. get_blocked_users(user_id)**
```sql
-- Kullanıcının engellediği kişileri listeler
RETURNS TABLE (block_id, blocked_user_id, name, avatar, reason, blocked_at)
```

**4. get_unread_message_count(user_id)**
```sql
-- Toplam okunmamış mesaj sayısını döner
RETURNS INTEGER
```

**5. get_unread_by_match(user_id)**
```sql
-- Match başına okunmamış mesaj sayısı
RETURNS TABLE (match_id, unread_count, last_message_at)
```

**6. create_user_report(reporter_id, reported_id, report_type, description, evidence)**
```sql
-- Şikayet oluşturur
RETURNS UUID -- report_id
```

**7. get_report_statistics(days)**
```sql
-- Admin istatistikleri döner
RETURNS TABLE (total_reports, pending_reports, resolved_reports, ...)
```

### React Hooks

**1. useBlockUser()**
```typescript
const { blockUser, unblockUser, isUserBlocked, isBlocking, error } = useBlockUser()

// Kullanıcıyı engelle
await blockUser(currentUserId, targetUserId, reason)

// Engeli kaldır
await unblockUser(currentUserId, targetUserId)

// Engelli mi kontrol et
const blocked = await isUserBlocked(user1Id, user2Id)
```

**2. useBlockedUsers(userId)**
```typescript
const { blockedUsers, isLoading, error, refetch } = useBlockedUsers(userId)

// BlockedUser[] - Engellenmiş kullanıcı listesi
```

**3. useReportUser()**
```typescript
import { REPORT_TYPE_OPTIONS } from '@/constants/reportTypes'

const { reportUser, isReporting, error } = useReportUser()

// Şikayet türleri constants'tan alınır
// 'harassment' | 'threat' | 'spam' | 'inappropriate' | 'scam' | 'other'
await reportUser(
  reporterId,
  reportedId,
  'harassment', // report type
  'Açıklama',
  { evidence: 'data' } // optional
)

// Şikayet türü seçenekleri
REPORT_TYPE_OPTIONS.forEach(option => {
  console.log(option.value, option.label, option.description)
})
```

**4. useUnreadMessages(userId)**
```typescript
const { unreadCount, isLoading, refetch } = useUnreadMessages(userId)

// Real-time güncellenen okunmamış mesaj sayısı
```

**5. useUnreadByMatch(userId)**
```typescript
const { unreadByMatch, isLoading, refetch } = useUnreadByMatch(userId)

// { [matchId]: unreadCount } - Match başına okunmamış sayısı
```

**6. useMarkAsRead()**
```typescript
const { markAsRead, markMatchAsRead, isMarking } = useMarkAsRead()

// Tek mesajı okundu işaretle
await markAsRead(messageId)

// Match'teki tüm mesajları okundu işaretle
await markMatchAsRead(matchId, userId)
```

### UI Komponentleri

**1. BlockReportModal**
```tsx
<BlockReportModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  targetUserId="user-123"
  targetUserName="Ahmet"
  currentUserId="current-user-id"
  onSuccess={() => {
    // Engelleme veya şikayet başarılı
  }}
/>
```

**Özellikler:**
- 3 mod: choose, block, report
- Engelleme için sebep girişi (opsiyonel)
- Şikayet için tür seçimi ve açıklama (zorunlu)
- Loading states
- Error handling

**2. BlockedUserNotice**
```tsx
<BlockedUserNotice userName="Ahmet" />
```

Engellenmiş kullanıcı bildirimi gösterir.

**3. UnreadBadge**
```tsx
<UnreadBadge userId={userId} />
```

Toplam okunmamış mesaj sayısını gösterir.

**4. MatchUnreadBadge**
```tsx
<MatchUnreadBadge
  matchId={matchId}
  userId={userId}
/>
```

Belirli bir match için okunmamış mesaj sayısını gösterir.

## 📱 Kullanım Akışları

### Kullanıcı Engelleme Akışı

1. **Chat sayfasında:**
   - Üst sağdaki "⋮" menüsüne tıkla
   - "Engelle" seçeneğini seç
   - Sebep gir (opsiyonel)
   - "Engelle" butonuna bas

2. **Sonuç:**
   - Kullanıcı engellenir
   - Match kapanır
   - Mesajlaşma engellenir
   - Bildirim gösterilir

3. **Engeli kaldırma:**
   - Profil > Ayarlar > Engellenmiş Kullanıcılar
   - Kullanıcıyı seç
   - "Engeli Kaldır"

### Şikayet Etme Akışı

1. **Chat sayfasında:**
   - Üst sağdaki "⋮" menüsüne tıkla
   - "Şikayet Et" seçeneğini seç
   - Şikayet türünü seç
   - Detaylı açıklama yaz (min 20 karakter)
   - "Şikayet Et" butonuna bas

2. **Sonuç:**
   - Şikayet kaydedilir
   - Admin'e bildirim gider
   - Kullanıcıya onay mesajı gösterilir
   - Status: "pending"

3. **Admin İncelemesi:**
   - Admin dashboard'dan şikayetleri görür
   - İncelemeye başlar (status: "investigating")
   - Karar verir (status: "resolved" veya "dismissed")
   - Not ekleyebilir

### Mesaj Bildirimi Akışı

1. **Yeni mesaj geldiğinde:**
   - Real-time WebSocket ile mesaj alınır
   - Okunmamış sayısı otomatik artar
   - Badge güncellenir
   - Notification gösterilebilir (opsiyonel)

2. **Mesaj okunduğunda:**
   - Chat sayfası açıldığında otomatik okundu
   - `markMatchAsRead()` çağrılır
   - Badge kaybolur
   - Database'de `read = true` olur

3. **Badge Gösterimleri:**
   - Ana sayfa bottom nav: 🔴 5
   - Chat list: Her match yanında 🔴 2
   - Real-time güncelleme

## 🔒 Güvenlik

### Row Level Security (RLS)

**user_blocks:**
```sql
-- Kullanıcı sadece kendi engellemelerini görebilir
CREATE POLICY "Users can view own blocks"
  ON user_blocks FOR SELECT
  USING (auth.uid() = blocker_id);
```

**user_reports:**
```sql
-- Kullanıcı sadece kendi şikayetlerini görebilir
CREATE POLICY "Users can view own reports"
  ON user_reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- Admin tüm şikayetleri görebilir
CREATE POLICY "Admin can manage reports"
  ON user_reports FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

**messages (güncellendi):**
```sql
-- Engellenmemiş kullanıcıların mesajlarını görebilme
CREATE POLICY "Users can view unblocked messages"
  ON messages FOR SELECT
  USING (
    (auth.uid() = sender_id OR auth.uid() = receiver_id)
    AND NOT is_user_blocked(sender_id, receiver_id)
  );
```

### Engelleme Kontrolü

- ✅ Frontend: UI seviyesinde engelleme kontrolü
- ✅ Backend: RLS policies ile database seviyesinde
- ✅ API: Endpoint'lerde auth ve engelleme kontrolü
- ✅ Real-time: Subscription'larda engelleme filtreleme

## 📊 İndeksler

Performance için eklenen indeksler:

```sql
CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX idx_user_blocks_blocked ON user_blocks(blocked_id);
CREATE INDEX idx_user_reports_reporter ON user_reports(reporter_id);
CREATE INDEX idx_user_reports_reported ON user_reports(reported_id);
CREATE INDEX idx_user_reports_status ON user_reports(status);
CREATE INDEX idx_messages_read ON messages(receiver_id, read) WHERE read = false;
```

## 🧪 Test Senaryoları

### Test 1: Kullanıcı Engelleme
```typescript
// 1. Kullanıcı A, Kullanıcı B'yi engeller
await blockUser(userA.id, userB.id, 'Rahatsız ediyor')

// 2. Kontrol et
const blocked = await isUserBlocked(userA.id, userB.id)
// Result: true

// 3. Mesaj göndermeyi dene
await sendMessage(matchId, 'Test mesajı')
// Result: Error - Engelleme nedeniyle gönderilemez

// 4. Match durumu
const match = await getMatch(matchId)
// Result: status = 'rejected'
```

### Test 2: Şikayet Etme
```typescript
// 1. Kullanıcı A, Kullanıcı B'yi şikayet eder
const reportId = await reportUser(
  userA.id,
  userB.id,
  'harassment',
  'Sürekli rahatsız edici mesajlar gönderiyor'
)

// 2. Kontrol et
const report = await getReport(reportId)
// Result: { status: 'pending', reporter_id: userA.id }

// 3. Admin istatistiklerini kontrol et
const stats = await getReportStatistics(30)
// Result: { total_reports: 1, pending_reports: 1, ... }
```

### Test 3: Mesaj Bildirimi
```typescript
// 1. Kullanıcı B, Kullanıcı A'ya mesaj gönderir
await sendMessage(matchId, 'Merhaba')

// 2. Kullanıcı A'nın okunmamış sayısını kontrol et
const unreadCount = await getUnreadMessageCount(userA.id)
// Result: 1

// 3. Kullanıcı A chat'i açar
await markMatchAsRead(matchId, userA.id)

// 4. Tekrar kontrol et
const newUnreadCount = await getUnreadMessageCount(userA.id)
// Result: 0
```

## 🔄 Real-time Subscriptions

### Okunmamış Mesaj Subscription
```typescript
const subscription = supabase
  .channel('unread-messages')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `receiver_id=eq.${userId}`
    },
    () => {
      // Okunmamış sayısını yeniden fetch et
      fetchUnreadCount()
    }
  )
  .subscribe()
```

## 📝 Admin Dashboard

### Şikayet Yönetimi

**GET /api/admin/reports**
```json
{
  "total": 156,
  "pending": 23,
  "resolved": 120,
  "dismissed": 13,
  "topReportedUsers": [
    { "userId": "user-123", "reportCount": 15 },
    { "userId": "user-456", "reportCount": 8 }
  ],
  "reportsByType": {
    "harassment": 45,
    "threat": 12,
    "spam": 67,
    "scam": 8
  }
}
```

### Engelleme İstatistikleri

**Query:**
```sql
SELECT COUNT(*) as total_blocks
FROM user_blocks
WHERE created_at > NOW() - INTERVAL '30 days';
```

## 🚀 Deployment

### 1. Database Migration

Supabase SQL Editor'de çalıştır:
```bash
# schema.sql dosyasındaki "KULLANICI ENGELLEME" bölümünü kopyala
# Supabase Dashboard > SQL Editor > Paste > Run
```

### 2. Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Build & Deploy

```bash
npm run build
git add .
git commit -m "feat: Engelleme ve bildirim sistemi"
git push origin main
```

## 📱 Mobil Uygulama

Capacitor ile mobil bildirimleri entegre edebilirsiniz:

```typescript
import { LocalNotifications } from '@capacitor/local-notifications'

// Yeni mesaj geldiğinde
await LocalNotifications.schedule({
  notifications: [
    {
      title: "Yeni Mesaj",
      body: `${senderName} size mesaj gönderdi`,
      id: 1,
      schedule: { at: new Date(Date.now() + 1000) }
    }
  ]
})
```

## 🔍 Troubleshooting

### Problem: Badge güncellenmiyor

**Çözüm:**
```typescript
// Real-time subscription kontrolü
console.log('Subscription status:', channel.state)

// Manuel refetch
const { refetch } = useUnreadMessages(userId)
refetch()
```

### Problem: Engelleme çalışmıyor

**Çözüm:**
```sql
-- RLS policies kontrolü
SELECT * FROM pg_policies WHERE tablename = 'user_blocks';

-- Engelleme kaydı kontrolü
SELECT * FROM user_blocks WHERE blocker_id = 'user-id';
```

### Problem: Şikayet kaydedilmiyor

**Çözüm:**
```sql
-- user_reports tablosu kontrolü
SELECT * FROM user_reports ORDER BY created_at DESC LIMIT 10;

-- RLS policy kontrolü
SHOW policies ON user_reports;
```

---

**📞 Destek:**
- Email: support@takasyap.com
- Documentation: /docs/block-report-system
- GitHub Issues

**⚖️ Yasal Uyarı:** Bu sistem kullanıcı güvenliği için tasarlanmıştır. Tüm şikayetler gizli tutulur ve sadece yetkili personel tarafından görülebilir.
