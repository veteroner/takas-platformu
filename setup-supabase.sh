#!/bin/bash

# 🚀 Takas Platform - Otomatik Supabase Setup
# Bu script tüm Supabase kurulumunu otomatik yapar

echo "🚀 Takas Platform - Supabase Setup Başlıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. API Key Kontrolü
echo -e "${BLUE}📝 Supabase API Key'lerini alıyoruz...${NC}"
echo ""
echo "Lütfen Supabase Dashboard'dan aşağıdaki bilgileri alın:"
echo "https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/settings/api"
echo ""

# ANON KEY al
echo -e "${YELLOW}🔑 'anon public' key'i yapıştırın (uzun bir string):${NC}"
read -r ANON_KEY

if [ -z "$ANON_KEY" ]; then
    echo -e "${RED}❌ Hata: API key boş olamaz!${NC}"
    exit 1
fi

# 2. .env.local dosyasını güncelle
echo ""
echo -e "${BLUE}📄 .env.local dosyası güncelleniyor...${NC}"

cat > .env.local << EOF
# App Configuration
NEXT_PUBLIC_APP_NAME="Takas Platform"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://rraatgwihvrxopjahpoh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY

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

echo -e "${GREEN}✅ .env.local dosyası güncellendi!${NC}"

# 3. Schema SQL'i kopyala
echo ""
echo -e "${BLUE}📋 Database Schema SQL kopyalandı!${NC}"
echo ""
echo -e "${YELLOW}⚠️  ŞİMDİ YAPMANIZ GEREKENLER:${NC}"
echo ""
echo "1️⃣  SQL Editor'ü açın:"
echo "   https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/editor"
echo ""
echo "2️⃣  'New query' butonuna tıklayın"
echo ""
echo "3️⃣  Aşağıdaki komutu çalıştırıp SQL'i kopyalayın:"
echo -e "${GREEN}   cat supabase/schema.sql | pbcopy${NC}"
echo ""
echo "4️⃣  SQL Editor'e yapıştırın (Cmd+V)"
echo ""
echo "5️⃣  'RUN' butonuna tıklayın (Cmd+Enter)"
echo ""

# SQL'i kopyala
cat supabase/schema.sql | pbcopy
echo -e "${GREEN}✅ Schema SQL clipboard'a kopyalandı! SQL Editor'e yapıştırabilirsiniz.${NC}"
echo ""

# 4. Storage kurulum talimatları
echo -e "${YELLOW}📦 STORAGE BUCKET KURULUMU:${NC}"
echo ""
echo "1️⃣  Storage sayfasını açın:"
echo "   https://supabase.com/dashboard/project/rraatgwihvrxopjahpoh/storage/buckets"
echo ""
echo "2️⃣  'New bucket' butonuna tıklayın"
echo ""
echo "3️⃣  Bucket ayarları:"
echo "   - Name: item-images"
echo "   - ✅ Public bucket (işaretleyin!)"
echo "   - Create bucket"
echo ""
echo "4️⃣  Policies ayarlayın (bucket'a tıklayın → Policies):"
echo "   - New Policy → 'For full customization'"
echo "   - Policy 1: SELECT → USING: true"
echo "   - Policy 2: INSERT → WITH CHECK: auth.role() = 'authenticated'"
echo ""

# 5. Test
echo -e "${BLUE}🧪 TEST:${NC}"
echo ""
echo "Development server'ı başlatın:"
echo -e "${GREEN}   npm run dev${NC}"
echo ""
echo "Tarayıcıda açın: http://localhost:3000"
echo ""

echo -e "${GREEN}✨ Setup tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📚 Detaylı rehber: SETUP-STEPS.md${NC}"
echo ""
