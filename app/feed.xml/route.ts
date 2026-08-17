import { publishedBlogs } from '@/lib/content.server'
import { generateRss, rssResponse } from '@/lib/rss'

export const dynamic = 'force-static'

export function GET() {
  return rssResponse(generateRss(publishedBlogs, 'feed.xml'))
}
