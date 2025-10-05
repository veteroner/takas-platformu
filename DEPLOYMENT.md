# 🚀 Deployment Guide - Takas Platform

Bu rehber, Takas Platform'u GitHub ve Netlify'a nasıl deploy edeceğinizi adım adım açıklar.

## 📋 Ön Gereksinimler

- ✅ Git kurulu olmalı
- ✅ GitHub hesabı
- ✅ Netlify hesabı
- ✅ Node.js 20+ yüklü

## 1️⃣ GitHub'a Push

### İlk Kurulum
```bash
cd /Users/onerozbey/Desktop/Takas-platform

# Git repository başlat (eğer yoksa)
git init

# Remote ekle
git remote add origin https://github.com/veteroner/takas-platformu.git

# Dosyaları ekle
git add .

# Commit yap
git commit -m "Initial commit - Takas Platform with upload feature"

# GitHub'a push
git push -u origin main
```

### Sonraki Güncellemeler
```bash
git add .
git commit -m "Açıklayıcı mesaj buraya"
git push
```

## 2️⃣ Netlify Deploy

### Otomatik Deploy (Önerilen)

1. **Netlify'a Giriş Yap**
   - https://app.netlify.com/teams/veteroner/projects

2. **Yeni Site Ekle**
   - "Add new site" → "Import an existing project"
   - GitHub'ı seç
   - Repository seç: `veteroner/takas-platformu`

3. **Build Ayarları**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables** (Opsiyonel)
   ```
   NODE_VERSION=20
   ```

5. **Deploy!**
   - "Deploy site" butonuna tıkla
   - Netlify otomatik olarak build edip yayına alacak

### Manuel Deploy

```bash
# Netlify CLI kur
npm install -g netlify-cli

# Netlify'a login
netlify login

# Site oluştur ve deploy et
netlify init

# Build ve deploy
npm run build
netlify deploy --prod
```

## 3️⃣ GitHub Actions (CI/CD)

GitHub Actions otomatik olarak çalışacak:
- ✅ Her push'ta linting ve build kontrolü
- ✅ PR'larda preview deploy
- ✅ Main branch'e merge'de production deploy

### Secrets Ayarlama

GitHub Repository → Settings → Secrets and variables → Actions:

1. `NETLIFY_AUTH_TOKEN`: 
   - Netlify → User Settings → Applications → New access token

2. `NETLIFY_SITE_ID`:
   - Netlify → Site → Site settings → Site information → API ID

## 4️⃣ Custom Domain (Opsiyonel)

Netlify Dashboard:
1. Site settings → Domain management
2. "Add custom domain"
3. DNS kayıtlarını güncelle
4. SSL sertifikası otomatik kurulacak

## 5️⃣ Performans Optimizasyonu

### Next.js Config
```javascript
// next.config.ts zaten optimize edilmiş:
- Image optimization
- Compression
- Turbopack
```

### Netlify Config
```toml
# netlify.toml zaten yapılandırılmış:
- Next.js plugin
- Cache headers
- Security headers
```

## 6️⃣ Test Etme

Deploy sonrası kontrol et:

```bash
# Netlify URL'i tarayıcıda aç
# Örnek: https://takas-platformu.netlify.app

# Kontrol listesi:
- ✅ Ana sayfa yükleniyor mu?
- ✅ Swipe animasyonları çalışıyor mu?
- ✅ Ürün yükleme sayfası açılıyor mu?
- ✅ Mesajlaşma çalışıyor mu?
- ✅ Mobil responsive düzgün mü?
- ✅ PWA install çalışıyor mu?
```

## 7️⃣ Monitoring

### Netlify Analytics
- Site → Analytics
- Trafik, performans, form submission verileri

### Netlify Logs
- Deploys → Deploy log
- Function logs (eğer kullanıyorsanız)

## 🐛 Sorun Giderme

### Build Hatası
```bash
# Local'de test et
npm run build

# Dependencies kontrol
npm ci --legacy-peer-deps
```

### Deployment Hatası
```bash
# Netlify logs kontrol et
netlify logs

# Cache temizle
netlify deploy --clear-cache
```

### 404 Hatası
- `netlify.toml` dosyası doğru yapılandırılmış mı?
- Redirects kuralları var mı?

## 📊 Deployment Checklist

Deployment öncesi kontrol:

- [ ] `package.json` güncel
- [ ] Environment variables ayarlandı
- [ ] `.gitignore` doğru
- [ ] `README.md` güncel
- [ ] Build local'de çalışıyor
- [ ] Lint hatasız
- [ ] TypeScript hatasız
- [ ] Git commit'lendi
- [ ] GitHub'a push edildi
- [ ] Netlify build başarılı
- [ ] Site canlı test edildi

## 🎉 Başarılı Deployment!

Siteniz şu adreslerden erişilebilir:

- **Netlify**: https://takas-platformu.netlify.app
- **Custom Domain**: (eğer ayarladıysanız)

Her `git push` sonrası otomatik olarak güncellenecek!

---

## 🔗 Yararlı Linkler

- [Netlify Dashboard](https://app.netlify.com/teams/veteroner/projects)
- [GitHub Repo](https://github.com/veteroner/takas-platformu)
- [Next.js Deploy Docs](https://nextjs.org/docs/deployment)
- [Netlify Next.js Plugin](https://github.com/netlify/netlify-plugin-nextjs)
