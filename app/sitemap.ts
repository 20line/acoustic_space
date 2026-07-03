import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/utils'
import { products, productCategories } from '@/data/products'
import { portfolioProjects } from '@/data/portfolio'
import { segmentsData } from '@/data/segments'
import { prisma, dbRetry } from '@/lib/prisma'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/catalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/diffuser`, lastModified: now, changeFrequency: 'monthly', priority: 0.72 },
    { url: `${SITE_URL}/skyline`, lastModified: now, changeFrequency: 'monthly', priority: 0.72 },
    { url: `${SITE_URL}/configurator`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/segments`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${SITE_URL}/room-designer`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = productCategories.map((cat) => ({
    url: `${SITE_URL}/catalog/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/catalog/${p.category}/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const portfolioRoutes: MetadataRoute.Sitemap = portfolioProjects.map((p) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const segmentRoutes: MetadataRoute.Sitemap = segmentsData.map((s) => ({
    url: `${SITE_URL}/segments/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.72,
  }))

  // Blog posts, categories, tags from DB
  let blogPostRoutes: MetadataRoute.Sitemap = []
  let blogCategoryRoutes: MetadataRoute.Sitemap = []
  let blogTagRoutes: MetadataRoute.Sitemap = []
  let blogAuthorRoutes: MetadataRoute.Sitemap = []

  try {
    const [posts, categories, tags, authors] = await Promise.all([
      dbRetry(() =>
        prisma.blogPost.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
          orderBy: { publishedAt: 'desc' },
        })
      ),
      dbRetry(() =>
        prisma.blogCategory.findMany({
          select: { slug: true },
          where: { posts: { some: { published: true } } },
        })
      ),
      dbRetry(() =>
        prisma.blogTag.findMany({
          select: { slug: true },
          where: { posts: { some: { post: { published: true } } } },
        })
      ),
      dbRetry(() =>
        prisma.blogAuthor.findMany({
          select: { slug: true },
          where: { posts: { some: { published: true } } },
        })
      ),
    ])

    blogPostRoutes = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))

    blogCategoryRoutes = categories.map((c) => ({
      url: `${SITE_URL}/blog/category/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }))

    blogTagRoutes = tags.map((t) => ({
      url: `${SITE_URL}/blog/tag/${t.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.55,
    }))

    blogAuthorRoutes = authors.map((a) => ({
      url: `${SITE_URL}/blog/author/${a.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))
  } catch {
    // DB unavailable — sitemap still serves static routes
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...portfolioRoutes,
    ...segmentRoutes,
    ...blogPostRoutes,
    ...blogCategoryRoutes,
    ...blogTagRoutes,
    ...blogAuthorRoutes,
  ]
}
