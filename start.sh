#!/bin/bash

# Takas Platform - Startup Script
# Bu script projeyi başlatır ve geliştirme ortamını açar

echo "🚀 Takas Platform başlatılıyor..."
echo "======================================"

# Proje dizinine git
cd "$(dirname "$0")"

# Node.js ve npm kontrolü
if ! command -v node &> /dev/null; then
    echo "❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm bulunamadı. Lütfen npm'i yükleyin."
    exit 1
fi

echo "✅ Node.js ve npm mevcut"

# Bağımlılıkları kontrol et ve gerekirse yükle
if [ ! -d "node_modules" ]; then
    echo "📦 Bağımlılıklar yükleniyor..."
    npm install
else
    echo "✅ Bağımlılıklar mevcut"
fi

# Next.js development server'ı başlat
echo ""
echo "🌟 Development server başlatılıyor..."
echo "📱 Proje: http://localhost:3000 adresinde çalışacak"
echo ""
echo "💡 Durdurmak için: Ctrl+C"
echo "======================================"
echo ""

# Development server'ı başlat
npm run dev

echo ""
echo "👋 Takas Platform kapatıldı."
