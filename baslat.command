#!/bin/bash

# Takas Platform - Çift Tık İle Başlat
# Bu dosyaya çift tıkla, otomatik açılsın!

echo "🚀 Takas Platform başlatılıyor..."

# Proje dizinine git
cd "$(dirname "$0")"

# Bağımlılıkları kontrol et
if [ ! -d "node_modules" ]; then
    echo "📦 İlk defa çalıştırıyorsun, bağımlılıklar yükleniyor..."
    npm install
fi

echo "🌟 Development server başlatılıyor..."
echo "📱 Tarayıcı otomatik açılacak: http://localhost:3000"

# Development server'ı başlat ve tarayıcıyı aç
npm run dev &
SERVER_PID=$!

# 3 saniye bekle server başlasın
sleep 3

# Tarayıcıyı aç
open http://localhost:3000

echo ""
echo "✅ Takas Platform çalışıyor!"
echo "🌐 URL: http://localhost:3000"
echo "⏹️  Durdurmak için bu pencereyi kapat"
echo ""

# Server'ın çalışmaya devam etmesini bekle
wait $SERVER_PID
