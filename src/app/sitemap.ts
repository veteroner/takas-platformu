import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://takazone.com'
  const currentDate = new Date().toISOString()

  return [
    // PUBLIC SAYFALAR - Herkesin erişebileceği sayfalar
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/destek`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/data-privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/kvkk-aydinlatma`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/uyelik-sozlesmesi`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/acik-riza`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    // PRIVATE SAYFALAR - Authentication gerektiren (sitemap'e EKLENMEMELİ):
    // - /matches (eşleşmeler - giriş gerekli)
    // - /messages (mesajlar - giriş gerekli)
    // - /profile (profil - giriş gerekli)
    // - /settings (ayarlar - giriş gerekli)
    // - /my-items (ürünlerim - giriş gerekli)
    // - /upload (ürün ekle - giriş gerekli)
    // - /notifications (bildirimler - giriş gerekli)
    // - /preferences (tercihler - giriş gerekli)
    // - /admin/** (admin panel - giriş gerekli)
  ]
}
