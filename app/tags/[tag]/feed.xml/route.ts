import siteMetadata from '@/data/siteMetadata'
import { getBlogsByTag, getTagCounts } from '@/lib/content.server'
import { generateRss, rssResponse } from '@/lib/rss'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return Object.keys(getTagCounts()).map((tag) => ({ tag }))
}

export async function GET(_: Request, { params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params
  const decodedTag = decodeURI(tag)
  return rssResponse(
    generateRss(
      getBlogsByTag(decodedTag),
      `tags/${decodedTag}/feed.xml`,
      `${siteMetadata.title} – ${decodedTag}`
    )
  )
}
