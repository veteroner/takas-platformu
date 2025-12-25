import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/', 
          '/_next/', 
          '/static/',
          // Authentication gerektiren sayfalar - Google bot erişemez
          '/eslesmeler',
          '/mesajlar',
          '/profil',
          '/ayarlar',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          // Private sayfalar - Googlebot'un indexlememesi için
          '/eslesmeler',
          '/mesajlar',
          '/profil',
          '/ayarlar',
        ],
      },
    ],
    sitemap: 'https://takazone.com/sitemap.xml',
  }
}
