#!/bin/bash

# Rating System Migration Runner
# Bu script rating sistemini Supabase'e yükler

echo "🎯 Rating Sistemi Migration Kontrolü"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if migration file exists
if [ ! -f "supabase/create-rating-system.sql" ]; then
    echo -e "${RED}❌ HATA: supabase/create-rating-system.sql dosyası bulunamadı!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Migration dosyası bulundu${NC}"
echo ""

# Display migration content preview
echo "📄 Migration İçeriği (İlk 20 satır):"
echo "-----------------------------------"
head -20 supabase/create-rating-system.sql
echo "..."
echo ""

# Instructions
echo -e "${YELLOW}📋 MANUEL ADIMLAR:${NC}"
echo ""
echo "1. Supabase Dashboard'a git:"
echo "   👉 https://supabase.com/dashboard"
echo ""
echo "2. Projeyi seç (rraatgwlvrxopjahpoh)"
echo ""
echo "3. Sol menüden 'SQL Editor' seçeneğine tıkla"
echo ""
echo "4. 'New Query' butonuna tıkla"
echo ""
echo "5. Aşağıdaki dosyanın TÜMÜNÜ kopyala ve yapıştır:"
echo "   📁 supabase/create-rating-system.sql"
echo ""
echo "6. 'Run' butonuna tıkla"
echo ""
echo "7. Başarılı olduğunda şu mesajı göreceksin:"
echo "   '✅ Success. No rows returned'"
echo ""
echo -e "${GREEN}8. Migration tamamlandı! 🎉${NC}"
echo ""

# Open file for easy copying
echo -e "${YELLOW}💡 İPUCU: Migration dosyasını açmak için:${NC}"
echo "   cat supabase/create-rating-system.sql | pbcopy"
echo "   (Dosya otomatik olarak panoya kopyalanır)"
echo ""

read -p "Migration dosyasını panoya kopyalamak ister misin? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cat supabase/create-rating-system.sql | pbcopy
    echo -e "${GREEN}✅ Migration SQL panoya kopyalandı!${NC}"
    echo -e "${GREEN}👉 Şimdi Supabase Dashboard'a gidip yapıştırabilirsin${NC}"
    echo ""
    echo "Supabase Dashboard linkini açmak için:"
    read -p "Browser'da aç? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        open "https://supabase.com/dashboard/project/rraatgwlvrxopjahpoh/sql/new"
        echo -e "${GREEN}✅ Supabase SQL Editor açıldı!${NC}"
    fi
fi

echo ""
echo -e "${GREEN}📚 Daha fazla bilgi için:${NC}"
echo "   📄 RATING-SYSTEM-SETUP.md dosyasına bak"
echo ""
echo -e "${YELLOW}⚠️  NOT: Migration'ı sadece 1 kez çalıştırman yeterli!${NC}"
echo ""
