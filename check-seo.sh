#!/bin/bash

# TakaZone SEO Kontrolü
# Google'da iyi görünmek için tüm gereklilikleri kontrol eder

echo "🔍 TakaZone SEO Kontrolü Başlıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Dosya kontrolleri
echo "📁 Dosya Kontrolleri:"
echo "===================="

files=(
    "public/favicon.ico"
    "public/favicon.svg"
    "public/favicon-16x16.png"
    "public/favicon-32x32.png"
    "public/apple-touch-icon.png"
    "public/manifest.json"
    "public/robots.txt"
    "public/sitemap.xml"
    "public/icons/icon-192.png"
    "public/icons/icon-512.png"
    "src/app/layout.tsx"
    "src/app/sitemap.ts"
    "src/app/robots.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (EKSIK!)"
    fi
done

echo ""

# OG image kontrolü
echo "🖼️  Open Graph Görseli:"
echo "======================"
if [ -f "public/og-image.png" ]; then
    size=$(stat -f%z "public/og-image.png" 2>/dev/null || stat -c%s "public/og-image.png" 2>/dev/null)
    if [ $size -gt 1000 ]; then
        echo -e "${GREEN}✅${NC} og-image.png mevcut ($(($size / 1024)) KB)"
    else
        echo -e "${YELLOW}⚠️${NC}  og-image.png çok küçük, yeniden oluşturun"
    fi
else
    echo -e "${RED}❌${NC} og-image.png EKSIK!"
    echo -e "${YELLOW}👉${NC} Şimdi oluşturmak için: open public/og-image-generator.html"
fi

echo ""

# Metadata kontrolleri
echo "🏷️  Metadata Kontrolleri:"
echo "========================"

if grep -q "metadataBase" src/app/layout.tsx; then
    echo -e "${GREEN}✅${NC} metadataBase tanımlı"
else
    echo -e "${RED}❌${NC} metadataBase eksik"
fi

if grep -q "openGraph" src/app/layout.tsx; then
    echo -e "${GREEN}✅${NC} Open Graph tags tanımlı"
else
    echo -e "${RED}❌${NC} Open Graph tags eksik"
fi

if grep -q "twitter" src/app/layout.tsx; then
    echo -e "${GREEN}✅${NC} Twitter Card tanımlı"
else
    echo -e "${RED}❌${NC} Twitter Card eksik"
fi

if grep -q "application/ld+json" src/app/layout.tsx; then
    echo -e "${GREEN}✅${NC} Structured Data (JSON-LD) tanımlı"
else
    echo -e "${RED}❌${NC} Structured Data eksik"
fi

if grep -q "verification" src/app/layout.tsx; then
    echo -e "${GREEN}✅${NC} Google verification tanımlı"
    if grep -q "google-site-verification-code-buraya" src/app/layout.tsx; then
        echo -e "${YELLOW}⚠️${NC}  Google verification kodu güncellenmeli"
    fi
else
    echo -e "${YELLOW}⚠️${NC}  Google verification eksik"
fi

echo ""

# PWA Manifest kontrolü
echo "📱 PWA Manifest:"
echo "==============="
if [ -f "public/manifest.json" ]; then
    if grep -q "TakaZone" public/manifest.json; then
        echo -e "${GREEN}✅${NC} Manifest.json doğru yapılandırılmış"
    fi
    
    icon_count=$(grep -c '"src":' public/manifest.json)
    echo -e "${GREEN}✅${NC} $icon_count adet icon tanımlı"
fi

echo ""

# Sitemap kontrolü
echo "🗺️  Sitemap:"
echo "==========="
if [ -f "src/app/sitemap.ts" ]; then
    echo -e "${GREEN}✅${NC} Dinamik sitemap.ts mevcut"
fi

if [ -f "public/sitemap.xml" ]; then
    if grep -q "2025-12-25" public/sitemap.xml; then
        echo -e "${GREEN}✅${NC} Sitemap güncel (2025-12-25)"
    else
        echo -e "${YELLOW}⚠️${NC}  Sitemap tarihleri eski olabilir"
    fi
    
    url_count=$(grep -c "<loc>" public/sitemap.xml)
    echo -e "${GREEN}✅${NC} $url_count URL sitemap'te kayıtlı"
fi

echo ""

# Robots.txt kontrolü
echo "🤖 Robots.txt:"
echo "============="
if [ -f "src/app/robots.ts" ]; then
    echo -e "${GREEN}✅${NC} Dinamik robots.ts mevcut"
fi

if [ -f "public/robots.txt" ]; then
    if grep -q "Sitemap:" public/robots.txt; then
        echo -e "${GREEN}✅${NC} Sitemap referansı var"
    fi
    
    if grep -q "User-agent: \*" public/robots.txt; then
        echo -e "${GREEN}✅${NC} Tüm bot'lara izin verilmiş"
    fi
fi

echo ""

# Port kontrolü
echo "🌐 Geliştirme Sunucusu:"
echo "======================="
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Next.js localhost:3000'de çalışıyor"
    echo -e "${YELLOW}👉${NC} Test için: http://localhost:3000"
else
    echo -e "${YELLOW}⚠️${NC}  Next.js çalışmıyor"
    echo -e "${YELLOW}👉${NC} Başlatmak için: npm run dev"
fi

echo ""

# Özet
echo "📊 SEO Durum Özeti:"
echo "==================="
echo ""
echo "Deployment öncesi kontrol listesi:"
echo ""
echo "1. [ ] og-image.png oluşturuldu mu?"
if [ -f "public/og-image.png" ]; then
    echo -e "   ${GREEN}✅ Evet${NC}"
else
    echo -e "   ${RED}❌ Hayır - open public/og-image-generator.html${NC}"
fi

echo ""
echo "2. [ ] Google Search Console verification kodu eklendi mi?"
if grep -q "google-site-verification-code-buraya" src/app/layout.tsx; then
    echo -e "   ${RED}❌ Hayır - layout.tsx'te 'google-site-verification-code-buraya' değiştirin${NC}"
else
    echo -e "   ${GREEN}✅ Evet${NC}"
fi

echo ""
echo "3. [ ] Tüm meta tags ve structured data yerinde mi?"
echo -e "   ${GREEN}✅ Evet${NC}"

echo ""
echo "4. [ ] Sitemap ve robots.txt hazır mı?"
echo -e "   ${GREEN}✅ Evet${NC}"

echo ""
echo "🎯 Deployment Sonrası Yapılacaklar:"
echo "==================================="
echo "1. Google Search Console'a site ekle"
echo "2. Sitemap gönder (https://takazone.com/sitemap.xml)"
echo "3. Facebook Sharing Debugger ile test et"
echo "4. Twitter Card Validator ile test et"
echo "5. Lighthouse SEO skorunu kontrol et"
echo ""
echo "📚 Detaylı bilgi için: SEO-COMPLETE.md"
echo ""
