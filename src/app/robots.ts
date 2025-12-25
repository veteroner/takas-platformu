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
          '/matches',
          '/messages',
          '/profile',
          '/settings',
          '/my-items',
          '/upload',
          '/notifications',
          '/preferences',
          '/chat',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/', 
          '/admin/',
          // Private sayfalar - Googlebot'un indexlememesi için
          '/matches',
          '/messages',
          '/profile',
          '/settings',
          '/my-items',
          '/upload',
          '/notifications',
          '/preferences',
          '/chat',
        ],
      },
    ],
    sitemap: 'https://takazone.com/sitemap.xml',
  }
}
