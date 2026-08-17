import ListLayout from '@/layouts/ListLayoutWithTags'
import { getPostsPage, getTagCounts, publishedPosts } from '@/lib/content.server'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Blog' })

export default async function BlogPage() {
  const page = getPostsPage(1)
  const allTags = getTagCounts()

  if (!page) return null

  return (
    <ListLayout
      posts={publishedPosts}
      initialDisplayPosts={page.items}
      pagination={page}
      title="All Posts"
      allTags={allTags}
    />
  )
}
