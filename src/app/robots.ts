import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/'], // Hide your future admin dashboard from Google
    },
    sitemap: 'https://kidus.dev/sitemap.xml',
  }
}
