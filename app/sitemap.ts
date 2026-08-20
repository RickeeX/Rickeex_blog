import { MetadataRoute } from 'next'
import { getTagCounts, POSTS_PER_PAGE, publishedPosts } from '@/lib/content.server'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = publishedPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = ['', 'blog', 'about', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const tagRoutes = Object.keys(getTagCounts()).map((tag) => ({
    url: `${siteUrl}/tags/${encodeURI(tag)}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const paginationRoutes = Array.from(
    { length: Math.max(0, Math.ceil(publishedPosts.length / POSTS_PER_PAGE) - 1) },
    (_, index) => ({
      url: `${siteUrl}/blog/page/${index + 2}`,
      lastModified: new Date().toISOString().split('T')[0],
    })
  )

  return [...routes, ...tagRoutes, ...paginationRoutes, ...blogRoutes]
}
