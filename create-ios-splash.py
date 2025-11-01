#!/usr/bin/env python3
"""
iOS Splash Screen Generator
Yeni tasarımı iOS için PNG'lere dönüştürür
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_splash(size, filename, is_dark=False):
    """Splash screen PNG oluştur"""
    print(f"🎨 {filename} oluşturuluyor...")
    
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
    
    # Gradient çiz (yukarıdan aşağıya)
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
    
    # Background blur circles
    # Sol üst
    circle_size = size // 4
    for i in range(20):
        opacity = int(255 * (0.05 + i * 0.01))
        radius = circle_size + i * 10
        xy = [
            size//4 - radius//2,
            size//4 - radius//2,
            size//4 + radius//2,
            size//4 + radius//2
        ]
        draw.ellipse(xy, fill=(255, 255, 255, opacity))
    
    # Sağ alt
    for i in range(20):
        opacity = int(255 * (0.05 + i * 0.01))
        radius = circle_size + i * 10
        xy = [
            3*size//4 - radius//2,
            3*size//4 - radius//2,
            3*size//4 + radius//2,
            3*size//4 + radius//2
        ]
        draw.ellipse(xy, fill=(255, 255, 255, opacity))
    
    # Icon container (beyaz yarı-şeffaf rounded rectangle)
    icon_size = size // 5
    icon_x = (size - icon_size) // 2
    icon_y = (size - icon_size) // 2 - size // 10
    
    # Rounded rectangle background
    radius = icon_size // 6
    for i in range(10):
        opacity = 8 + i * 2
        r = radius + i
        xy = [
            icon_x - i,
            icon_y - i,
            icon_x + icon_size + i,
            icon_y + icon_size + i
        ]
        draw.rounded_rectangle(xy, radius=r, fill=(255, 255, 255, opacity))
    
    # Exchange icon (arrows)
    arrow_w = icon_size // 2
    arrow_h = icon_size // 8
    arrow_head = icon_size // 12
    center_x = size // 2
    center_y = icon_y + icon_size // 2
    line_width = max(6, size // 200)
    
    # Üst ok (sağa) - Top arrow pointing right
    y1 = center_y - arrow_h - line_width
    # Horizontal line
    draw.line(
        [(center_x - arrow_w//2, y1), (center_x + arrow_w//2, y1)],
        fill='white',
        width=line_width
    )
    # Arrow head
    draw.line(
        [(center_x + arrow_w//2 - arrow_head, y1 - arrow_head),
         (center_x + arrow_w//2, y1)],
        fill='white',
        width=line_width
    )
    draw.line(
        [(center_x + arrow_w//2 - arrow_head, y1 + arrow_head),
         (center_x + arrow_w//2, y1)],
        fill='white',
        width=line_width
    )
    
    # Alt ok (sola) - Bottom arrow pointing left
    y2 = center_y + arrow_h + line_width
    # Horizontal line
    draw.line(
        [(center_x + arrow_w//2, y2), (center_x - arrow_w//2, y2)],
        fill='white',
        width=line_width
    )
    # Arrow head
    draw.line(
        [(center_x - arrow_w//2 + arrow_head, y2 - arrow_head),
         (center_x - arrow_w//2, y2)],
        fill='white',
        width=line_width
    )
    draw.line(
        [(center_x - arrow_w//2 + arrow_head, y2 + arrow_head),
         (center_x - arrow_w//2, y2)],
        fill='white',
        width=line_width
    )
    
    # Pulsing glow around icon
    glow_radius = icon_size // 2 + 20
    for i in range(15):
        opacity = int(40 - i * 2)
        r = glow_radius + i * 8
        xy = [
            center_x - r, icon_y + icon_size//2 - r,
            center_x + r, icon_y + icon_size//2 + r
        ]
        draw.ellipse(xy, fill=(255, 255, 255, opacity))
    
    # Text ekle
    try:
        # Helvetica Bold için system font
        title_size = size // 14
        font_title = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", title_size)
        subtitle_size = size // 38
        font_subtitle = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", subtitle_size)
    except:
        # Fallback
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
    
    # TAKAS (bold)
    text_y = icon_y + icon_size + size // 12
    
    # Text with shadow
    shadow_offset = 2
    draw.text((size//2 + shadow_offset, text_y + shadow_offset), "TAKAS", 
              fill=(0, 0, 0, 60), font=font_title, anchor='mm')
    draw.text((size//2, text_y), "TAKAS", 
              fill='white', font=font_title, anchor='mm')
    
    # Tagline
    tagline_y = text_y + size // 20
    draw.text((size//2, tagline_y), "Takas yap, mutlu ol", 
              fill=(255, 255, 255, 230), font=font_subtitle, anchor='mm')
    
    # Loading dots
    dots_y = tagline_y + size // 18
    dot_radius = size // 250
    dot_spacing = size // 80
    for i in range(3):
        x = size//2 - dot_spacing + i * dot_spacing
        opacity = 180 + (i * 25)
        xy = [x - dot_radius, dots_y - dot_radius, x + dot_radius, dots_y + dot_radius]
        draw.ellipse(xy, fill=(255, 255, 255, opacity))
    
    # Kaydet
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, 'PNG', quality=95, optimize=True)
    print(f"✅ {os.path.basename(filename)} oluşturuldu ({size}x{size})")

def main():
    print("🎨 iOS Splash Screen Generator")
    print("=" * 50)
    print()
    
    base_path = "ios/App/App/Assets.xcassets/Splash.imageset"
    
    # Light mode
    print("📱 Light mode görselleri oluşturuluyor...")
    create_splash(2732, f"{base_path}/Default@1x~universal~anyany.png", False)
    create_splash(2732, f"{base_path}/Default@2x~universal~anyany.png", False)
    create_splash(2732, f"{base_path}/Default@3x~universal~anyany.png", False)
    
    print()
    
    # Dark mode
    print("🌙 Dark mode görselleri oluşturuluyor...")
    create_splash(2732, f"{base_path}/Default@1x~universal~anyany-dark.png", True)
    create_splash(2732, f"{base_path}/Default@2x~universal~anyany-dark.png", True)
    create_splash(2732, f"{base_path}/Default@3x~universal~anyany-dark.png", True)
    
    print()
    print("=" * 50)
    print("✅ Tüm iOS splash screen'ler başarıyla oluşturuldu!")
    print()
    print("🔄 Sıradaki adım:")
    print("   npx cap sync ios")
    print("   npx cap open ios")
    print()
    print("📱 Xcode'da Run tuşuna basarak test edebilirsin!")

if __name__ == "__main__":
    main()
