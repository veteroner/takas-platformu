# 🔐 GitHub Authentication Guide

GitHub'a push yapabilmek için authentication yapmanız gerekiyor.

## Seçenek 1: Personal Access Token (PAT) - Kolay

### 1. GitHub Token Oluştur
1. GitHub'da: https://github.com/settings/tokens/new
2. Note: "Takas Platform Deploy"
3. Expiration: 90 gün veya "No expiration"
4. Select scopes:
   - ✅ `repo` (tüm seçenekler)
   - ✅ `workflow`
5. "Generate token" tıkla
6. **Token'ı kopyala** (bir daha göremezsiniz!)

### 2. Token ile Push
```bash
cd /Users/onerozbey/Desktop/Takas-platform

# Remote URL'i token ile güncelle
git remote set-url origin https://YOUR_TOKEN@github.com/veteroner/takas-platformu.git

# Push yap
git push -u origin main
```

**YOUR_TOKEN** yerine kopyaladığınız token'ı yapıştırın.

## Seçenek 2: GitHub CLI - Önerilen

```bash
# GitHub CLI kur (eğer yoksa)
brew install gh

# Login ol
gh auth login

# Repository'yi kontrol et
gh repo view veteroner/takas-platformu

# Push yap
git push -u origin main
```

## Seçenek 3: SSH Key

### 1. SSH Key Oluştur (eğer yoksa)
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter tuşuna bas (varsayılan konum)
# Passphrase gir (opsiyonel)
```

### 2. SSH Key'i GitHub'a Ekle
```bash
# Public key'i kopyala
cat ~/.ssh/id_ed25519.pub | pbcopy

# GitHub'da:
# Settings → SSH and GPG keys → New SSH key
# Yapıştır ve "Add SSH key" tıkla
```

### 3. Remote URL'i SSH'e Çevir
```bash
git remote set-url origin git@github.com:veteroner/takas-platformu.git
git push -u origin main
```

## Hızlı Çözüm - GitHub Desktop

1. **GitHub Desktop İndir**: https://desktop.github.com
2. Uygulamayı aç ve GitHub hesabınla giriş yap
3. "Add Existing Repository" → Takas-platform klasörünü seç
4. "Publish repository" tıkla
5. Repository adı: `takas-platformu`
6. Organization: `veteroner`
7. "Publish Repository" tıkla

## ✅ Push Başarılı mı?

Push başarılı olduktan sonra:
1. https://github.com/veteroner/takas-platformu ziyaret et
2. Dosyaların yüklendiğini kontrol et
3. Netlify deployment için DEPLOYMENT.md dosyasını takip et
