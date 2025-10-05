#!/bin/bash

# Takas Platform - Advanced Setup & Launch Script
# Bu script tam kurulum yapar ve VS Code ile birlikte açar

echo "🎯 Takas Platform - Gelişmiş Kurulum"
echo "======================================"

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Proje dizinine git
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)

echo -e "${CYAN}📁 Proje dizini: ${PROJECT_DIR}${NC}"

# Sistem kontrolü
echo -e "\n${YELLOW}🔍 Sistem kontrolleri...${NC}"

# Node.js kontrolü
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin.${NC}"
    exit 1
fi

# npm kontrolü
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: v${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm bulunamadı.${NC}"
    exit 1
fi

# Git kontrolü
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ ${GIT_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠️  Git bulunamadı (opsiyonel)${NC}"
fi

# VS Code kontrolü
if command -v code &> /dev/null; then
    echo -e "${GREEN}✅ VS Code mevcut${NC}"
    VSCODE_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  VS Code bulunamadı (opsiyonel)${NC}"
    VSCODE_AVAILABLE=false
fi

# Bağımlılık kontrolü ve kurulumu
echo -e "\n${YELLOW}📦 Bağımlılık kontrolü...${NC}"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
    echo -e "${BLUE}🔄 Bağımlılıklar yükleniyor...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Bağımlılıklar başarıyla yüklendi${NC}"
    else
        echo -e "${RED}❌ Bağımlılık yüklemesi başarısız${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Bağımlılıklar mevcut${NC}"
    
    # Güncelleme kontrolü
    echo -e "${BLUE}🔍 Güncelleme kontrolü yapılıyor...${NC}"
    npm outdated --depth=0 2>/dev/null | head -10
fi

# Proje yapısı kontrolü
echo -e "\n${YELLOW}🏗️  Proje yapısı kontrolü...${NC}"

REQUIRED_FILES=("package.json" "next.config.ts" "tsconfig.json" "src/app/page.tsx")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ ${file}${NC}"
    else
        echo -e "${RED}❌ ${file} bulunamadı${NC}"
    fi
done

# Port kontrolü
echo -e "\n${YELLOW}🌐 Port kontrolü...${NC}"
if lsof -ti:3000 >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 kullanımda. Mevcut process sonlandırılıyor...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 2
fi

# Kullanıcı seçenekleri
echo -e "\n${PURPLE}🎛️  Başlatma seçenekleri:${NC}"
echo "1) Sadece development server'ı başlat"
echo "2) VS Code ile birlikte başlat"
echo "3) Detaylı bilgi ile başlat"
echo "4) Çıkış"

read -p "Seçiminiz (1-4): " choice

case $choice in
    1)
        echo -e "\n${CYAN}🚀 Development server başlatılıyor...${NC}"
        npm run dev
        ;;
    2)
        if [ "$VSCODE_AVAILABLE" = true ]; then
            echo -e "\n${CYAN}🚀 VS Code ve development server başlatılıyor...${NC}"
            code . &
            sleep 2
            npm run dev
        else
            echo -e "${RED}❌ VS Code mevcut değil. Sadece development server başlatılıyor...${NC}"
            npm run dev
        fi
        ;;
    3)
        echo -e "\n${CYAN}📊 Detaylı proje bilgisi:${NC}"
        echo -e "${BLUE}Proje Adı:${NC} Takas Platform"
        echo -e "${BLUE}Framework:${NC} Next.js + TypeScript"
        echo -e "${BLUE}Styling:${NC} Tailwind CSS"
        echo -e "${BLUE}Animations:${NC} Framer Motion + React Spring"
        echo -e "${BLUE}Mobile:${NC} Capacitor Ready"
        echo -e "${BLUE}URL:${NC} http://localhost:3000"
        
        if [ -f "package.json" ]; then
            echo -e "\n${BLUE}📦 Scripts:${NC}"
            npm run | grep -E "^  " | head -5
        fi
        
        echo -e "\n${CYAN}🚀 Development server başlatılıyor...${NC}"
        npm run dev
        ;;
    4)
        echo -e "${YELLOW}👋 Çıkılıyor...${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Geçersiz seçim. Development server başlatılıyor...${NC}"
        npm run dev
        ;;
esac

echo -e "\n${GREEN}👋 Takas Platform kapatıldı.${NC}"
