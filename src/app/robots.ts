import portfolio from '@/data/portfolio'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api'],
    },
    sitemap: `${portfolio.publicUrl}/sitemap.xml`,
    host: portfolio.publicUrl,
  }
}
