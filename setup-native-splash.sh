#!/bin/bash

# 🎨 Takas Platform - Native Splash Screen Setup Script
# Bu script native splash screen'leri oluşturur ve yapılandırır

echo "🎨 Takas Platform - Native Splash Screen Kurulumu"
echo "=================================================="
echo ""

# Renk kodları
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Generator'ı aç
echo -e "${BLUE}📱 ADIM 1: Splash Screen Generator'ı Açalım${NC}"
echo ""
echo "Lütfen resources/splash-generator-advanced.html dosyasını tarayıcınızda açın."
echo ""
echo -e "${YELLOW}Tarayıcıda açmak için:${NC}"
echo "  open resources/splash-generator-advanced.html"
echo ""
echo "veya manuel olarak:"
echo "  /Users/onerozbey/Desktop/Takas-platform/resources/splash-generator-advanced.html"
echo ""

read -p "Generator'ı açtınız mı? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Kurulum iptal edildi.${NC}"
    exit 1
fi

# 2. Görselleri oluştur
echo ""
echo -e "${BLUE}📱 ADIM 2: Splash Screen Görsellerini Oluşturun${NC}"
echo ""
echo "Generator'da şunları yapın:"
echo "  1. ✅ Renkleri ayarlayın (varsayılanlar iyi)"
echo "  2. ✅ Metinleri düzenleyin (opsiyonel)"
echo "  3. ✅ '📦 Tüm Boyutları Oluştur' butonuna tıklayın"
echo "  4. ✅ İndirilen tüm PNG dosyalarını resources/splash/ klasörüne taşıyın"
echo ""

read -p "Görselleri oluşturdunuz ve resources/splash/ klasörüne taşıdınız mı? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Lütfen görselleri oluşturun ve devam edin.${NC}"
    exit 1
fi

# 3. Dosya kontrolü
echo ""
echo -e "${BLUE}📱 ADIM 3: Dosya Kontrolü${NC}"
echo ""

SPLASH_DIR="resources/splash"
FILE_COUNT=$(find "$SPLASH_DIR" -name "*.png" 2>/dev/null | wc -l | tr -d ' ')

if [ "$FILE_COUNT" -lt 10 ]; then
    echo -e "${YELLOW}⚠️  Uyarı: resources/splash/ klasöründe sadece $FILE_COUNT PNG dosyası bulundu.${NC}"
    echo "Beklenen: En az 16 dosya (iOS + Android)"
    echo ""
    read -p "Yine de devam etmek istiyor musunuz? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ $FILE_COUNT splash screen dosyası bulundu!${NC}"
fi

# 4. Capacitor Assets yükle
echo ""
echo -e "${BLUE}📱 ADIM 4: Capacitor Assets Kurulumu${NC}"
echo ""

if ! command -v cordova-res &> /dev/null; then
    echo "cordova-res yükleniyor..."
    npm install -g cordova-res
    echo -e "${GREEN}✅ cordova-res yüklendi!${NC}"
else
    echo -e "${GREEN}✅ cordova-res zaten yüklü!${NC}"
fi

# 5. Native splash screen'leri oluştur
echo ""
echo -e "${BLUE}📱 ADIM 5: Native Splash Screen'leri Oluştur${NC}"
echo ""

echo "iOS splash screen'leri oluşturuluyor..."
cordova-res ios --skip-config --copy --type splash 2>/dev/null || {
    echo -e "${YELLOW}⚠️  iOS için manuel kopyalama gerekli${NC}"
}

echo "Android splash screen'leri oluşturuluyor..."
cordova-res android --skip-config --copy --type splash 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Android için manuel kopyalama gerekli${NC}"
}

# 6. Capacitor sync
echo ""
echo -e "${BLUE}📱 ADIM 6: Capacitor Sync${NC}"
echo ""

npx cap sync
echo -e "${GREEN}✅ Capacitor sync tamamlandı!${NC}"

# 7. Build kontrol
echo ""
echo -e "${BLUE}📱 ADIM 7: Proje Build${NC}"
echo ""

echo "Next.js projesi build ediliyor..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build başarılı!${NC}"
else
    echo -e "${RED}❌ Build hatası! Lütfen hataları kontrol edin.${NC}"
    exit 1
fi

# 8. Final sync
echo ""
echo -e "${BLUE}📱 ADIM 8: Final Sync${NC}"
echo ""

npx cap sync
echo -e "${GREEN}✅ Final sync tamamlandı!${NC}"

# Özet
echo ""
echo "=================================================="
echo -e "${GREEN}🎉 NATIVE SPLASH SCREEN KURULUMU TAMAMLANDI!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📱 Test Etme:${NC}"
echo ""
echo "iOS için:"
echo "  npx cap open ios"
echo "  Xcode'da Run > iPhone 14 Pro"
echo ""
echo "Android için:"
echo "  npx cap open android"
echo "  Android Studio'da Run > Emulator"
echo ""
echo -e "${BLUE}✨ Özellikler:${NC}"
echo "  ✅ Tam ekran gradient splash screen"
echo "  ✅ 3 farklı animasyonlu ikon"
echo "  ✅ BÜYÜK uygulama adı ve logo"
echo "  ✅ Loading animasyonu"
echo "  ✅ iOS ve Android optimizasyonu"
echo "  ✅ Dark mode desteği"
echo "  ✅ Tüm cihaz boyutları"
echo ""
echo -e "${GREEN}🚀 Artık profesyonel bir splash screen'iniz var!${NC}"
echo ""
