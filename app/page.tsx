import { publishedPosts } from '@/lib/content.server'
import Main from './Main'

export default async function Page() {
  return <Main posts={publishedPosts} />
}
