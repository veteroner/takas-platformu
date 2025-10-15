# 🔄 Takas Platform

Modern bir ürün takas platformu - Beğen, eşleş, takas yap!

## 🌟 Özellikler

- 📱 **Tinder Tarzı Swipe**: Ürünleri sağa/sola kaydırarak beğen
- 💬 **Mesajlaşma**: Eşleşen kullanıcılarla sohbet et
- 🛡️ **Küfür Filtreleme**: Otomatik küfür ve hakaret engelleme sistemi (300+ kelime)
- 🚫 **Yasadışı Ürün Engelleme**: Uyuşturucu, silah, vb. otomatik filtreleme (500+ kelime)
- � **Kullanıcı Engelleme**: Taciz eden kullanıcıları engelle
- 📢 **Şikayet Sistemi**: Uygunsuz davranışları bildir (6 şikayet türü)
- 🔔 **Mesaj Bildirimleri**: Okunmamış mesaj sayısı, real-time güncelleme
- �📤 **Güvenli Ürün Yükleme**: Kendi ürünlerini yasalara uygun şekilde yükle
- 🎨 **Modern UI**: Gradient renkler ve glassmorphism efektleri
- 📱 **Mobil Uyumlu**: PWA desteği ve native app ready
- 🌙 **Dark Mode**: Otomatik tema değiştirme
- ⚖️ **KVKK Uyumlu**: Veri koruma ve kullanıcı hakları

## 🚀 Canlı Demo

[https://takas-platformu.netlify.app](https://takas-platformu.netlify.app)

## 🚀 Hızlı Başlangıç

### 📱 Tek Tıkla Başlatma
```bash
# macOS/Linux için:
./start.sh

# Windows için:
start.bat

# Gelişmiş seçenekler ile:
./launch.sh
```

### 📝 Manuel Başlatma
```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev

# Tarayıcıda aç
# http://localhost:3000
```

### 🎯 Başlatma Script'leri
- `start.sh` - Basit başlatma (macOS/Linux)
- `start.bat` - Basit başlatma (Windows)  
- `launch.sh` - Gelişmiş başlatma seçenekleri

## 🛠️ Teknoloji Yığını

- **Framework**: Next.js 15.5.4 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + React Spring
- **Gestures**: @use-gesture/react
- **State**: Zustand
- **Icons**: Lucide React
- **Mobile**: Capacitor (iOS/Android)

## 📱 Özellikler

- ✅ Tinder-style swipe interface
- ✅ Smooth animations (React Spring + Framer Motion)
- ✅ Mesajlaşma sistemi
- ✅ **Küfür filtreleme sistemi** (300+ Türkçe küfür, otomatik ban)
- ✅ **Yasadışı ürün filtreleme** (500+ kelime, 10 kategori)
- ✅ **Kullanıcı engelleme sistemi** (taciz/tehdit engellemesi)
- ✅ **Şikayet sistemi** (6 farklı şikayet türü, admin dashboard)
- ✅ **Mesaj bildirimleri** (okunmamış sayısı, real-time güncelleme)
- ✅ Ürün yükleme güvenliği (uyuşturucu, silah, vb. engelleme)
- ✅ Responsive design
- ✅ Mobile-first approach
- ✅ PWA desteği
- ✅ Dark mode
- ✅ KVKK uyumlu veri koruma
- 🔄 Kullanıcı sistemi (in progress)
- 🔄 Backend entegrasyonu (in progress)

## 🎯 Kullanım

1. **Keşfet**: Ana sayfada ürünleri incele
2. **Beğen/Geç**: Sağa kaydır ❤️ = beğen, sola kaydır ❌ = geç
3. **Eşleş**: Karşılıklı beğeni = eşleşme 🎉
4. **Mesajlaş**: Eşleşen kişilerle sohbet et 💬
5. **Ürün Yükle**: Kendi ürünlerini ekle 📤

## 📂 Proje Yapısı

```
src/
├── app/              # Next.js sayfaları
│   ├── page.tsx      # Ana sayfa (Keşfet)
│   ├── upload/       # Ürün yükleme
│   ├── messages/     # Mesaj listesi
│   ├── chat/         # Sohbet
│   ├── profile/      # Profil
│   └── login/        # Giriş
├── components/       # React bileşenleri
│   ├── SwipeCard.tsx
│   ├── SwipeStack.tsx
│   ├── Chat.tsx
│   └── ChatList.tsx
├── lib/              # Yardımcı fonksiyonlar
│   ├── mockData.ts
│   └── utils.ts
├── types/            # TypeScript tipleri
└── store/            # State yönetimi
```

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run launch       # Gelişmiş başlatma
npm run quick-start  # Hızlı başlatma
```

## 🌐 Deploy

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/veteroner/takas-platformu)

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/veteroner/takas-platformu)

## �️ Küfür Filtreleme Sistemi

Platform, kullanıcılar arası mesajlaşmada otomatik küfür ve hakaret engelleme sistemi içerir:

- ✅ 200+ Türkçe küfür ve varyasyonları
- ✅ Gizlenmiş küfür tespiti (a*k, a m k, etc.)
- ✅ Kademeli ceza sistemi (uyarı → ban)
- ✅ KVKK uyumlu loglama (6 ay)
- ✅ False positive önleme

**Dokümantasyon:**
- 📖 [PROFANITY-FILTER-SYSTEM.md](PROFANITY-FILTER-SYSTEM.md) - Detaylı dokümantasyon
- 🚀 [PROFANITY-FILTER-INTEGRATION.md](PROFANITY-FILTER-INTEGRATION.md) - Entegrasyon rehberi
- 🧪 [TEST-GUIDE.md](TEST-GUIDE.md) - Test rehberi

## �📱 Mobil Uygulama

Capacitor ile iOS ve Android uygulamaları oluşturabilirsiniz:

```bash
# iOS için build
npm run build
npx cap sync ios
npx cap open ios

# Android için build
npm run build
npx cap sync android
npx cap open android
```

Detaylı bilgi için [MOBILE-APP-GUIDE.md](MOBILE-APP-GUIDE.md) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License

---

**Takas Platform** - Made with ❤️ using Next.js
