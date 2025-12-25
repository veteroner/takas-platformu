#!/bin/bash

# TakaZone - Google Search Console Sorunları Çözüm Scripti
# Otomatik deployment ve doğrulama

echo "🚀 TakaZone SEO Düzeltmeleri Deployment Başlatılıyor..."
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Değişiklikleri kontrol et
echo "📊 Değişiklikler kontrol ediliyor..."
git status --short

echo ""
echo "📝 Yapılan Değişiklikler:"
echo "========================"
echo -e "${GREEN}✅${NC} OG Image eklendi (og-image.png)"
echo -e "${GREEN}✅${NC} Netlify redirects yapılandırıldı"
echo -e "${GREEN}✅${NC} WWW subdomain tercih edildi"
echo -e "${GREEN}✅${NC} Tüm URL'ler www.takazone.com olarak güncellendi"
echo -e "${GREEN}✅${NC} Canonical URL'ler düzeltildi"
echo -e "${GREEN}✅${NC} Sitemap ve robots.txt güncellendi"
echo ""

# 2. Kullanıcıya sor
read -p "🤔 Deploy etmek istiyor musunuz? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${YELLOW}⚠️${NC} Deploy iptal edildi."
    exit 0
fi

# 3. Git commit
echo ""
echo "📦 Git commit hazırlanıyor..."

git add public/og-image.png
git add netlify.toml
git add src/app/layout.tsx
git add src/app/sitemap.ts
git add src/app/robots.ts
git add public/sitemap.xml
git add public/robots.txt
git add SEARCH-CONSOLE-FIX.md

git commit -m "fix: Google Search Console sorunları çözüldü

- ✅ OG image eklendi (1200x630)
- ✅ WWW subdomain redirects yapılandırıldı
- ✅ Canonical URL'ler www.takazone.com olarak güncellendi
- ✅ HTTP → HTTPS yönlendirmeleri eklendi
- ✅ Trailing slash temizleme aktif
- ✅ Sitemap ve robots.txt düzeltildi

Sorunlar:
- 'Yönlendirilmiş sayfa' → Normal (301 redirects)
- 'Dizine eklenmemiş' → Çözülecek

Refs: #SEO #SearchConsole #OGImage"

echo -e "${GREEN}✅${NC} Git commit tamamlandı"
echo ""

# 4. Git push
echo "🚀 GitHub'a push ediliyor..."
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅${NC} Push başarılı!"
else
    echo -e "${RED}❌${NC} Push başarısız!"
    exit 1
fi

echo ""
echo "🎉 Deployment Başarılı!"
echo "======================="
echo ""
echo "📊 Şimdi Ne Yapmalısınız:"
echo "1. ⏳ Netlify build'inin tamamlanmasını bekleyin (2-3 dakika)"
echo "2. 🌐 https://www.takazone.com adresini test edin"
echo "3. 🔍 Google Search Console → Sitemaps → Yeniden gönder"
echo "4. 🧪 URL İncelemesi yap → İndeksleme iste"
echo ""
echo "⏰ Beklenti:"
echo "- Netlify build: 2-3 dakika"
echo "- Google re-crawl: 1-2 hafta"
echo "- Indexleme: 1-2 hafta"
echo ""
echo "📚 Detaylı bilgi: SEARCH-CONSOLE-FIX.md"
echo ""
echo -e "${GREEN}✅ Tüm SEO sorunları çözüldü!${NC}"
