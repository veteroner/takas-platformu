#!/bin/bash

# Native Splash Screen Test Script
# Test both Android and iOS splash screens

echo "🎨 Native Splash Screen Test Script"
echo "===================================="
echo ""

# Check if Capacitor is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

echo "📦 Running Capacitor sync..."
npx cap sync

echo ""
echo "✅ Sync completed!"
echo ""
echo "🎯 Choose platform to test:"
echo "   1) Android"
echo "   2) iOS"
echo "   3) Both"
echo "   4) Web (development)"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "🤖 Opening Android Studio..."
        npx cap open android
        ;;
    2)
        echo "🍎 Opening Xcode..."
        npx cap open ios
        ;;
    3)
        echo "🤖 Opening Android Studio..."
        npx cap open android
        echo "🍎 Opening Xcode..."
        npx cap open ios
        ;;
    4)
        echo "🌐 Starting development server..."
        npm run dev
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 Test Checklist:"
echo "   [ ] Splash screen appears"
echo "   [ ] Gradient background visible"
echo "   [ ] Exchange icon centered"
echo "   [ ] 'TAKAS' text visible"
echo "   [ ] Tagline visible"
echo "   [ ] Duration ~2.5 seconds"
echo "   [ ] Smooth fade out"
echo "   [ ] Dark mode (if enabled)"
echo ""
echo "✅ Done! Test your splash screen in the opened IDE."
