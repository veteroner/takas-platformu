#!/bin/bash

# Database Migration Runner
# File: migrations/001_add_privacy_fields.sql

echo "🔐 KİŞİSEL VERİ GİZLİLİĞİ MİGRATION BAŞLATILIYOR..."
echo "=============================================="
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Supabase bilgilerini kontrol et
if [ -z "$SUPABASE_DB_URL" ]; then
    echo -e "${YELLOW}⚠️  SUPABASE_DB_URL environment variable bulunamadı${NC}"
    echo ""
    echo "Lütfen aşağıdaki komutları çalıştırın:"
    echo ""
    echo -e "${GREEN}# Supabase projenizin ayarlarından DB URL'ini alın${NC}"
    echo -e "${GREEN}# Settings > Database > Connection String > URI${NC}"
    echo ""
    echo "export SUPABASE_DB_URL='postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres'"
    echo ""
    echo -e "${YELLOW}VEYA${NC}"
    echo ""
    echo "Migration'ı manuel olarak Supabase Dashboard > SQL Editor'den çalıştırabilirsiniz:"
    echo "Dosya: migrations/001_add_privacy_fields.sql"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Supabase bağlantısı bulundu${NC}"
echo ""

# Onay iste
echo "⚠️  Bu migration aşağıdaki değişiklikleri yapacak:"
echo "   1. users tablosuna first_name, last_name, display_name kolonları eklenecek"
echo "   2. Mevcut 'name' verisi otomatik olarak bölünecek"
echo "   3. İndeksler oluşturulacak"
echo ""
echo -n "Devam etmek istiyor musunuz? (y/n): "
read -r CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo -e "${RED}❌ Migration iptal edildi${NC}"
    exit 0
fi

echo ""
echo "🚀 Migration başlatılıyor..."
echo ""

# Migration dosyasını çalıştır
if psql "$SUPABASE_DB_URL" -f "$(dirname "$0")/001_add_privacy_fields.sql" > migration_output.log 2>&1; then
    echo -e "${GREEN}✅ Migration başarıyla tamamlandı!${NC}"
    echo ""
    echo "📊 Migration Özeti:"
    grep "NOTICE:" migration_output.log | sed 's/NOTICE:  /  /'
    echo ""
    
    # Verification
    echo "🔍 Doğrulama yapılıyor..."
    TOTAL_USERS=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM users;")
    MIGRATED_USERS=$(psql "$SUPABASE_DB_URL" -t -c "SELECT COUNT(*) FROM users WHERE first_name IS NOT NULL;")
    
    echo "   Toplam kullanıcı: $TOTAL_USERS"
    echo "   Migrate edilen: $MIGRATED_USERS"
    echo ""
    
    if [ "$TOTAL_USERS" -eq "$MIGRATED_USERS" ]; then
        echo -e "${GREEN}✅ Tüm kullanıcılar başarıyla migrate edildi!${NC}"
    else
        echo -e "${YELLOW}⚠️  Bazı kullanıcılar migrate edilemedi. Lütfen kontrol edin.${NC}"
    fi
    
else
    echo -e "${RED}❌ Migration başarısız oldu!${NC}"
    echo ""
    echo "Hata detayları:"
    cat migration_output.log
    echo ""
    echo "Lütfen migration dosyasını kontrol edin: migrations/001_add_privacy_fields.sql"
    exit 1
fi

echo ""
echo "=============================================="
echo -e "${GREEN}🎉 Migration tamamlandı!${NC}"
echo ""
echo "📋 Sonraki Adımlar:"
echo "   1. Frontend kodunu deploy edin"
echo "   2. Kullanıcıları bilgilendirin"
echo "   3. Test edin: Yeni kayıt + Profil görünümü"
echo ""

# Log dosyasını temizle
rm migration_output.log
