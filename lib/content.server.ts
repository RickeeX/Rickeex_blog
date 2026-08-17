import { slug as slugify } from 'github-slugger'
import { blogs } from '#site/content'
import {
  allCoreContent,
  createTagCount,
  sortPosts,
  type Blog,
  type CoreContent,
  type SearchDocument,
} from './content'

export const POSTS_PER_PAGE = 10

export const publishedBlogs: Blog[] = sortPosts(blogs.filter((post) => !post.draft))
export const publishedPosts: CoreContent<Blog>[] = allCoreContent(publishedBlogs)

export function getPostBySlug(slug: string): Blog | undefined {
  return publishedBlogs.find((post) => post.slug === slug)
}

export function getTagCounts(): Record<string, number> {
  return createTagCount(publishedBlogs)
}

export function getPostsByTag(tag: string): CoreContent<Blog>[] {
  return publishedPosts.filter((post) => post.tags.some((name) => slugify(name) === tag))
}

export function getBlogsByTag(tag: string): Blog[] {
  return publishedBlogs.filter((post) => post.tags.some((name) => slugify(name) === tag))
}

export function getPostsPage(page: number): {
  items: CoreContent<Blog>[]
  currentPage: number
  totalPages: number
} | null {
  const totalPages = Math.max(1, Math.ceil(publishedPosts.length / POSTS_PER_PAGE))
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null

  return {
    items: publishedPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    currentPage: page,
    totalPages,
  }
}

export function getSearchDocuments(): SearchDocument[] {
  return publishedPosts.map(({ title, date, tags, summary, slug, path }) => ({
    title,
    date,
    tags,
    summary,
    slug,
    path,
  }))
}
