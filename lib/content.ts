import { slug as slugify } from 'github-slugger'
import type { Authors, Blog } from '#site/content'

export type { Authors, Blog }
export type PostLayoutName = Blog['layout']
export type CoreContent<T> = Omit<T, 'content'>
export type PostListItem = Pick<CoreContent<Blog>, 'path' | 'date' | 'title' | 'summary' | 'tags'>

export interface SearchDocument {
  title: string
  date: string
  tags: string[]
  summary?: string | null
  slug: string
  path: string
}

export function coreContent<T extends { content: string }>(content: T): CoreContent<T> {
  const { content: omitted, ...rest } = content
  void omitted
  return rest
}

export function allCoreContent<T extends { content: string }>(contents: T[]): CoreContent<T>[] {
  return contents.map(coreContent)
}

export function postListItem(post: CoreContent<Blog>): PostListItem {
  const { path, date, title, summary, tags } = post
  return { path, date, title, summary, tags }
}

export function sortPosts<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
}

export function formatDate(date: string, locale = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function createTagCount(posts: Pick<Blog, 'tags'>[]): Record<string, number> {
  return posts.reduce<Record<string, number>>((counts, post) => {
    post.tags.forEach((tag) => {
      const key = slugify(tag)
      counts[key] = (counts[key] ?? 0) + 1
    })
    return counts
  }, {})
}
