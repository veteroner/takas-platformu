# 🎯 Netlify Deployment - Quick Start

## GitHub Push'tan Sonra

GitHub'a push işlemi tamamlandıktan sonra:

## 1️⃣ Netlify'a Git

https://app.netlify.com/teams/veteroner/projects

## 2️⃣ Yeni Site Ekle

1. **"Add new site"** butonuna tıkla
2. **"Import an existing project"** seç
3. **GitHub** seç (GitHub'a bağlan)
4. **Repository seç**: `veteroner/takas-platformu`

## 3️⃣ Build Settings

Netlify otomatik algılayacak, ama emin olmak için:

```
Base directory: (boş bırak)
Build command: npm run build
Publish directory: .next
```

### Environment Variables (Opsiyonel)
```
NODE_VERSION = 20
```

## 4️⃣ Deploy!

- **"Deploy site"** butonuna tıkla
- Build process başlayacak (2-3 dakika)
- Build başarılı olunca site yayına alınır

## 5️⃣ Site URL'i Özelleştir

Deploy sonrası:

1. **Site settings** → **Site information**
2. **Change site name** tıkla
3. Yeni isim gir: `takas-platformu`
4. Save

Site URL'iniz: `https://takas-platformu.netlify.app`

## 6️⃣ GitHub Actions Secrets (Otomatik Deploy İçin)

GitHub repo'da Settings → Secrets and variables → Actions:

### NETLIFY_AUTH_TOKEN
1. Netlify → User Settings → Applications
2. **New access token** tıkla
3. Description: "GitHub Actions"
4. Token'ı kopyala
5. GitHub'da secret olarak ekle

### NETLIFY_SITE_ID
1. Netlify → Site settings → Site information
2. **API ID** kopyala
3. GitHub'da secret olarak ekle

## ✅ Otomatik Deployment

Artık her `git push` yaptığınızda:
- GitHub Actions çalışacak
- Build test edilecek
- Netlify'a otomatik deploy edilecek

## 🎉 Tamamlandı!

Site canlı: https://takas-platformu.netlify.app

## 🔧 Sorun Giderme

### Build Hatası
```bash
# Local'de test et
npm run build

# Hata varsa düzelt
npm ci
npm run build
```

### Deployment Hatası
- Netlify → Deploys → Failed deploy
- "Deploy log" tıklayıp hatayı oku
- Genellikle dependencies veya build komutu hatası

### 404 Hatası
- Site yükleniyor ama sayfalar 404 veriyor
- `netlify.toml` dosyası var mı kontrol et
- Next.js plugin kurulu mu kontrol et

## 📊 Monitoring

- **Analytics**: Netlify → Site → Analytics
- **Logs**: Netlify → Site → Deploys → Deploy log
- **Forms**: Netlify → Site → Forms (eğer form kullanıyorsanız)

---

**Başarılı deployment için tüm dosyalar hazır! 🚀**
