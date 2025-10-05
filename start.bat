@echo off
chcp 65001 >nul
title Takas Platform - Startup

echo 🚀 Takas Platform başlatılıyor...
echo ======================================

REM Proje dizinine git
cd /d "%~dp0"

REM Node.js ve npm kontrolü
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı. Lütfen Node.js'i yükleyin.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm bulunamadı. Lütfen npm'i yükleyin.
    pause
    exit /b 1
)

echo ✅ Node.js ve npm mevcut

REM Bağımlılıkları kontrol et ve gerekirse yükle
if not exist "node_modules" (
    echo 📦 Bağımlılıklar yükleniyor...
    npm install
) else (
    echo ✅ Bağımlılıklar mevcut
)

REM Next.js development server'ı başlat
echo.
echo 🌟 Development server başlatılıyor...
echo 📱 Proje: http://localhost:3000 adresinde çalışacak
echo.
echo 💡 Durdurmak için: Ctrl+C
echo ======================================
echo.

REM Development server'ı başlat
npm run dev

echo.
echo 👋 Takas Platform kapatıldı.
pause
