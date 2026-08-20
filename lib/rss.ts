import siteMetadata from '@/data/siteMetadata'
import type { Blog } from './content'

function escapeXml(value: string | null | undefined): string {
  return (value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function generateRss(posts: Blog[], feedPath: string, title = siteMetadata.title): string {
  const items = posts
    .map((post) => {
      const postUrl = `${siteMetadata.siteUrl}/${post.path}`
      return `
    <item>
      <guid>${escapeXml(postUrl)}</guid>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      ${post.summary ? `<description>${escapeXml(post.summary)}</description>` : ''}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${escapeXml(siteMetadata.email)} (${escapeXml(siteMetadata.author)})</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
    </item>`
    })
    .join('')

  const lastBuildDate = posts[0]?.lastmod || posts[0]?.date || '1970-01-01'

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(`${siteMetadata.siteUrl}/blog`)}</link>
    <description>${escapeXml(siteMetadata.description)}</description>
    <language>${siteMetadata.language}</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteMetadata.siteUrl}/${feedPath}`)}" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`
}

export function rssResponse(xml: string): Response {
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
