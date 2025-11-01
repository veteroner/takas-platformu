#!/bin/bash

# iOS Splash Screen Generator
# Yeni splash screen tasarımını iOS için PNG'lere dönüştürür

echo "🎨 iOS Splash Screen Oluşturuluyor..."

# Kaynak SVG dosyası
SOURCE_SVG="resources/splash/splash-light.svg"
SOURCE_SVG_DARK="resources/splash/splash-dark.svg"

# Hedef klasör
IOS_DIR="ios/App/App/Assets.xcassets/Splash.imageset"

# SVG'yi önce büyük bir PNG'ye dönüştür (macOS sips kullanarak)
echo "📱 Light mode görselleri oluşturuluyor..."

# Geçici büyük PNG oluştur
qlmanage -t -s 2732 -o /tmp "$SOURCE_SVG" 2>/dev/null
mv /tmp/$(basename "$SOURCE_SVG").png /tmp/splash_temp.png 2>/dev/null

# Eğer qlmanage çalışmazsa Python kullan
if [ ! -f /tmp/splash_temp.png ]; then
    echo "⚠️  qlmanage çalışmadı, alternatif yöntem deneniyor..."
    
    # Python ile basit bir PNG oluştur (gradient + text)
    python3 << 'EOF'
from PIL import Image, ImageDraw, ImageFont
import sys

# Boyutlar
sizes = {
    '1x': 2732,
    '2x': 2732,
    '3x': 2732
}

def create_splash(size, filename, is_dark=False):
    # Gradient oluştur
    img = Image.new('RGB', (size, size))
    draw = ImageDraw.Draw(img)
    
    # Gradient renkler
    if is_dark:
        colors = [
            (236, 72, 153),   # Pink
            (147, 51, 234),   # Darker Purple
            (79, 70, 229)     # Darker Indigo
        ]
    else:
        colors = [
            (236, 72, 153),   # Pink
            (168, 85, 247),   # Purple
            (99, 102, 241)    # Indigo
        ]
    
    # Gradient çiz
    for y in range(size):
        progress = y / size
        if progress < 0.5:
            # Pink to Purple
            t = progress * 2
            r = int(colors[0][0] + (colors[1][0] - colors[0][0]) * t)
            g = int(colors[0][1] + (colors[1][1] - colors[0][1]) * t)
            b = int(colors[0][2] + (colors[1][2] - colors[0][2]) * t)
        else:
            # Purple to Indigo
            t = (progress - 0.5) * 2
            r = int(colors[1][0] + (colors[2][0] - colors[1][0]) * t)
            g = int(colors[1][1] + (colors[2][1] - colors[1][1]) * t)
            b = int(colors[1][2] + (colors[2][2] - colors[1][2]) * t)
        
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Icon container (beyaz yarı-şeffaf kare)
    icon_size = size // 4
    icon_x = (size - icon_size) // 2
    icon_y = (size - icon_size) // 2 - size // 8
    
    # Rounded rectangle için circle kullan
    radius = icon_size // 4
    draw.rounded_rectangle(
        [icon_x, icon_y, icon_x + icon_size, icon_y + icon_size],
        radius=radius,
        fill=(255, 255, 255, 51)  # 20% opacity
    )
    
    # Ok simgeleri (basit çizgiler)
    arrow_w = icon_size // 2
    arrow_h = icon_size // 6
    center_x = size // 2
    center_y = icon_y + icon_size // 2
    
    # Üst ok (sağa)
    y1 = center_y - arrow_h
    draw.line([(center_x - arrow_w//2, y1), (center_x + arrow_w//2, y1)], fill='white', width=size//150)
    draw.line([(center_x + arrow_w//2 - arrow_h, y1 - arrow_h//2), (center_x + arrow_w//2, y1)], fill='white', width=size//150)
    draw.line([(center_x + arrow_w//2 - arrow_h, y1 + arrow_h//2), (center_x + arrow_w//2, y1)], fill='white', width=size//150)
    
    # Alt ok (sola)
    y2 = center_y + arrow_h
    draw.line([(center_x + arrow_w//2, y2), (center_x - arrow_w//2, y2)], fill='white', width=size//150)
    draw.line([(center_x - arrow_w//2 + arrow_h, y2 - arrow_h//2), (center_x - arrow_w//2, y2)], fill='white', width=size//150)
    draw.line([(center_x - arrow_w//2 + arrow_h, y2 + arrow_h//2), (center_x - arrow_w//2, y2)], fill='white', width=size//150)
    
    # Text ekle
    try:
        # System font kullan
        title_size = size // 15
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_size)
        subtitle_size = size // 40
        font_subtitle = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_size)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
    
    # TAKAS
    text_y = icon_y + icon_size + size // 15
    draw.text((size//2, text_y), "TAKAS", fill='white', font=font_title, anchor='mm')
    
    # Tagline
    draw.text((size//2, text_y + size//20), "Takas yap, mutlu ol", fill=(255, 255, 255, 230), font=font_subtitle, anchor='mm')
    
    # Kaydet
    img.save(filename, 'PNG', quality=95)
    print(f"✅ {filename} oluşturuldu")

# Light mode
print("Creating light mode splash screens...")
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@1x~universal~anyany.png', False)
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@2x~universal~anyany.png', False)
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@3x~universal~anyany.png', False)

# Dark mode
print("Creating dark mode splash screens...")
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@1x~universal~anyany-dark.png', True)
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@2x~universal~anyany-dark.png', True)
create_splash(2732, 'ios/App/App/Assets.xcassets/Splash.imageset/Default@3x~universal~anyany-dark.png', True)

print("✅ Tüm iOS splash screen'ler oluşturuldu!")
EOF
    
    if [ $? -eq 0 ]; then
        echo "✅ iOS splash screen'ler Python ile oluşturuldu!"
        echo ""
        echo "📁 Oluşturulan dosyalar:"
        ls -lh "$IOS_DIR"/*.png
        echo ""
        echo "✅ Tamamlandı! Artık iOS'ta yeni splash screen'i göreceksin."
        echo ""
        echo "🔄 Sıradaki adım:"
        echo "   npx cap sync ios"
        exit 0
    else
        echo "❌ Python ile oluşturulamadı. PIL (Pillow) kurulu mu?"
        echo "Kurmak için: pip3 install Pillow"
        exit 1
    fi
fi

echo "✅ iOS splash screen'ler başarıyla oluşturuldu!"
