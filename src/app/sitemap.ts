import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://takazone.com'
  const currentDate = new Date().toISOString()

  return [
    // Public sayfalar - Herkesin erişebileceği sayfalar
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/kesfet`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/giris`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kayit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/gizlilik`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/kullanim-kosullari`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    // NOT: Authentication gerektiren sayfalar sitemap'e eklenmez:
    // - /eslesmeler (giriş gerekli)
    // - /mesajlar (giriş gerekli)
    // - /profil (giriş gerekli)
    // - /ayarlar (giriş gerekli)
    // Google bot bu sayfalara erişemez, indexlenemez
  ]
}
