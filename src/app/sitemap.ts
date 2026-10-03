import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kidus.dev' // Ensure you update this to your final domain
  
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/lab/invite/new`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/lab/cover-letter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
