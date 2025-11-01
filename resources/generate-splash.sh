#!/bin/bash

# Splash Screen Generator Script for Takas Platform
# This script generates splash screens for iOS and Android platforms

echo "🎨 Generating Splash Screens for Takas Platform..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed. Installing..."
    echo "Run: brew install imagemagick"
    exit 1
fi

# Create output directories
mkdir -p ../ios/App/App/Assets.xcassets/Splash.imageset
mkdir -p ../android/app/src/main/res/drawable
mkdir -p ../android/app/src/main/res/drawable-land-hdpi
mkdir -p ../android/app/src/main/res/drawable-land-mdpi
mkdir -p ../android/app/src/main/res/drawable-land-xhdpi
mkdir -p ../android/app/src/main/res/drawable-land-xxhdpi
mkdir -p ../android/app/src/main/res/drawable-land-xxxhdpi
mkdir -p ../android/app/src/main/res/drawable-port-hdpi
mkdir -p ../android/app/src/main/res/drawable-port-mdpi
mkdir -p ../android/app/src/main/res/drawable-port-xhdpi
mkdir -p ../android/app/src/main/res/drawable-port-xxhdpi
mkdir -p ../android/app/src/main/res/drawable-port-xxxhdpi

echo "📱 Generating iOS splash screens..."

# iOS Universal (2732x2732 - iPad Pro 12.9")
convert splash/splash-light.svg -resize 2732x2732 ../ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732.png
convert splash/splash-light.svg -resize 2732x2732@2x ../ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732@2x.png
convert splash/splash-light.svg -resize 2732x2732@3x ../ios/App/App/Assets.xcassets/Splash.imageset/splash-2732x2732@3x.png

echo "🤖 Generating Android splash screens..."

# Android Portrait
convert splash/splash-light.svg -resize 480x800 ../android/app/src/main/res/drawable-port-mdpi/splash.png
convert splash/splash-light.svg -resize 720x1280 ../android/app/src/main/res/drawable-port-hdpi/splash.png
convert splash/splash-light.svg -resize 1080x1920 ../android/app/src/main/res/drawable-port-xhdpi/splash.png
convert splash/splash-light.svg -resize 1440x2560 ../android/app/src/main/res/drawable-port-xxhdpi/splash.png
convert splash/splash-light.svg -resize 1440x2560 ../android/app/src/main/res/drawable-port-xxxhdpi/splash.png

# Android Landscape
convert splash/splash-light.svg -resize 800x480 ../android/app/src/main/res/drawable-land-mdpi/splash.png
convert splash/splash-light.svg -resize 1280x720 ../android/app/src/main/res/drawable-land-hdpi/splash.png
convert splash/splash-light.svg -resize 1920x1080 ../android/app/src/main/res/drawable-land-xhdpi/splash.png
convert splash/splash-light.svg -resize 2560x1440 ../android/app/src/main/res/drawable-land-xxhdpi/splash.png
convert splash/splash-light.svg -resize 2560x1440 ../android/app/src/main/res/drawable-land-xxxhdpi/splash.png

# Default drawable
convert splash/splash-light.svg -resize 1080x1920 ../android/app/src/main/res/drawable/splash.png

echo "✅ Splash screens generated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npx cap sync' to sync assets to native projects"
echo "2. Test on iOS: Open ios/App/App.xcworkspace in Xcode"
echo "3. Test on Android: Open android folder in Android Studio"
echo ""
echo "🎉 Done! Your new splash screens are ready!"
