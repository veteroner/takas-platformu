#!/bin/bash

# Eski Splash Screen Dosyalarını Arşivle
# Bu dosyalar referans için 'docs/archive/' klasörüne taşınacak

echo "📦 Eski splash screen dosyaları arşivleniyor..."

# Arşiv klasörü oluştur
mkdir -p docs/archive/splash-old

# Eski dokümantasyon dosyalarını taşı
echo "📄 Dokümantasyon dosyaları taşınıyor..."
mv SPLASH-SCREEN-ADDED.md docs/archive/splash-old/ 2>/dev/null
mv SPLASH-SCREEN-SETUP.md docs/archive/splash-old/ 2>/dev/null
mv SPLASH-SCREEN-FIX.md docs/archive/splash-old/ 2>/dev/null
mv SPLASH-SCREEN-IMPROVED.md docs/archive/splash-old/ 2>/dev/null
mv NATIVE-SPLASH-*.md docs/archive/splash-old/ 2>/dev/null

# Eski splash generator'ları taşı
echo "🔧 Eski generator dosyaları taşınıyor..."
mv public/splash-generator*.html docs/archive/splash-old/ 2>/dev/null
mv resources/splash-generator-advanced.html docs/archive/splash-old/ 2>/dev/null

# Setup scriptleri taşı
echo "⚙️ Eski setup scriptleri taşınıyor..."
mv setup-native-splash.sh docs/archive/splash-old/ 2>/dev/null

echo "✅ Arşivleme tamamlandı!"
echo ""
echo "📋 Arşivlenen dosyalar:"
ls -la docs/archive/splash-old/
echo ""
echo "📌 Yeni splash screen dosyaları:"
echo "   - src/components/SplashScreen.tsx (Web)"
echo "   - resources/splash/*.svg (Native)"
echo "   - SPLASH-COMPLETED.md (Özet)"
echo "   - SPLASH-QUICKSTART.md (Hızlı başlangıç)"
echo "   - SPLASH-SCREEN-NEW.md (Detaylı dokümantasyon)"
echo ""
echo "🎉 Temizlik tamamlandı!"
