import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostsPage, getTagCounts, POSTS_PER_PAGE, publishedPosts } from '@/lib/content.server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(publishedPosts.length / POSTS_PER_PAGE)
  const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2),
  }))

  // Static export currently rejects a dynamic route whose params array is empty.
  // This sentinel renders through notFound() and never appears in navigation.
  return pages.length ? pages : [{ page: '_empty' }]
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = Number(params.page)
  const page = getPostsPage(pageNumber)
  if (!page || pageNumber === 1) notFound()

  return (
    <ListLayout posts={page.items} pagination={page} title="All Posts" allTags={getTagCounts()} />
  )
}
