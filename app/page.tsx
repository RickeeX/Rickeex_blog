import { sortPosts, allCoreContent } from '@/lib/content'
import { blogs } from '#site/content'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(blogs)
  const posts = allCoreContent(sortedPosts)
  return <Main posts={posts} />
}
