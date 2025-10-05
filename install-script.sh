#!/bin/bash

# 🔄 TAKAS PLATFORM - Kurulum Script'i
# Tinder-like Takas Platformu kurulum otomasyonu

echo "🚀 Takas Platform kurulum başlıyor..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json bulunamadı. Lütfen proje dizininde olduğunuzdan emin olun."
    exit 1
fi

print_status "Node.js ve npm versiyonları kontrol ediliyor..."
node_version=$(node --version 2>/dev/null)
npm_version=$(npm --version 2>/dev/null)

if [ $? -ne 0 ]; then
    print_error "Node.js yüklü değil. Lütfen Node.js 18+ yükleyin."
    exit 1
fi

print_success "Node.js: $node_version"
print_success "npm: $npm_version"

# Install dependencies
print_status "Dependencies yükleniyor..."

# Core dependencies
npm install \
  @react-spring/web@^9.7.0 \
  @use-gesture/react@^10.3.0 \
  framer-motion@^10.16.0 \
  lucide-react@^0.292.0 \
  zustand@^4.4.0 \
  react-hook-form@^7.47.0 \
  @hookform/resolvers@^3.3.0 \
  zod@^3.22.0 \
  clsx@^2.0.0 \
  tailwind-merge@^2.0.0 \
  class-variance-authority@^0.7.0 \
  date-fns@^2.30.0 \
  react-hot-toast@^2.4.1

print_success "Temel paketler yüklendi!"

# UI Components
print_status "UI bileşenleri yükleniyor..."
npm install \
  @radix-ui/react-dialog@^1.0.5 \
  @radix-ui/react-dropdown-menu@^2.0.6 \
  @radix-ui/react-toast@^1.1.5 \
  @radix-ui/react-avatar@^1.0.4 \
  @radix-ui/react-slider@^1.1.2 \
  @tailwindcss/forms@^0.5.7 \
  @tailwindcss/typography@^0.5.10

print_success "UI bileşenleri yüklendi!"

# Development dependencies
print_status "Development dependencies yükleniyor..."
npm install -D \
  @types/jest@^29.5.0 \
  jest@^29.7.0 \
  jest-environment-jsdom@^29.7.0 \
  @testing-library/react@^13.4.0 \
  @testing-library/jest-dom@^6.1.0

print_success "Development dependencies yüklendi!"

# Create necessary directories
print_status "Proje dizin yapısı oluşturuluyor..."

mkdir -p src/{components,lib,types,hooks,store,styles}
mkdir -p src/app/{api,globals}
mkdir -p public/{images,icons}
mkdir -p docs

print_success "Dizin yapısı oluşturuldu!"

# Create essential files
print_status "Temel dosyalar oluşturuluyor..."

# lib/utils.ts
cat > src/lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes} dakika önce`
  if (hours < 24) return `${hours} saat önce`
  return `${days} gün önce`
}
EOF

# types/index.ts
cat > src/types/index.ts << 'EOF'
// Re-export all types from types file
export * from './types'
EOF

# Update package.json scripts
print_status "Package.json scripts güncelleniyor..."

# Create a temporary package.json with updated scripts
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  ...pkg.scripts,
  'type-check': 'tsc --noEmit',
  'test': 'jest',
  'test:watch': 'jest --watch',
  'test:coverage': 'jest --coverage'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

print_success "Package.json güncellendi!"

# Create .env.local template
print_status ".env dosyası oluşturuluyor..."
cat > .env.local << 'EOF'
# App Configuration
NEXT_PUBLIC_APP_NAME="Takas Platform"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Authentication (NextAuth.js)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/takas_db"

# Cloud Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
VAPID_PRIVATE_KEY=""

# Analytics
NEXT_PUBLIC_GA_ID=""
EOF

print_success ".env.local dosyası oluşturuldu!"

# Create README.md
print_status "README.md güncelleniyor..."
cat > README.md << 'EOF'
# 🔄 Takas Platform

Tinder benzeri swipe özellikli elbise ve oyuncak takas platformu.

## 🚀 Hızlı Başlangıç

```bash
# Dependencies yükle
npm install

# Development server başlat
npm run dev

# Tarayıcıda aç
# http://localhost:3000
```

## 🛠️ Teknoloji Yığını

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + React Spring
- **Gestures**: @use-gesture/react
- **State**: Zustand
- **UI**: Radix UI + shadcn/ui
- **Mobile**: Capacitor

## 📱 Özellikler

- ✅ Tinder-like swipe interface
- ✅ Real-time animations
- ✅ Responsive design
- ✅ Mobile-first approach
- 🔄 Match sistemi (in progress)
- 🔄 Mesajlaşma (in progress)
- 🔄 Kullanıcı sistemi (in progress)

## 🎯 Kullanım

1. Ana sayfada ürünleri görüntüle
2. Beğendiğin ürünleri sağa kaydır ❤️
3. Beğenmediklerini sola kaydır ❌
4. Match olduğunda mesajlaşmaya başla 💬

## 📦 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm test             # Run tests
```

## 🔧 Konfigürasyon

`.env.local` dosyasını düzenleyerek API endpoint'leri, veritabanı bağlantısı ve diğer ayarları yapılandırabilirsiniz.

## 📱 Mobil Uygulama

Capacitor ile iOS ve Android uygulamaları oluşturabilirsiniz:

```bash
# Capacitor ekle
npm run capacitor:add ios
npm run capacitor:add android

# Build ve sync
npm run capacitor:build
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Commit yapın
4. Push edin
5. Pull Request açın

## 📄 Lisans

MIT License
EOF

print_success "README.md oluşturuldu!"

# Run type check
print_status "TypeScript kontrolü yapılıyor..."
npm run type-check 2>/dev/null || print_warning "TypeScript hataları var, ancak kurulum devam ediyor..."

print_success "🎉 Kurulum tamamlandı!"
echo ""
echo "🚀 Projeyi başlatmak için:"
echo "   npm run dev"
echo ""
echo "🌐 Tarayıcıda açın:"
echo "   http://localhost:3000"
echo ""
echo "📚 Daha fazla bilgi için README.md dosyasını inceleyin."
echo ""
print_status "İyi geliştirmeler! 🎯"
