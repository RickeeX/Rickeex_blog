import 'server-only'

import { slug as slugify } from 'github-slugger'
import { authors, blogs } from '#site/content'
import {
  allCoreContent,
  coreContent,
  createTagCount,
  postListItem,
  sortPosts,
  type Authors,
  type Blog,
  type CoreContent,
  type PostListItem,
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

export function getPostsByTag(tag: string): PostListItem[] {
  return publishedPosts
    .filter((post) => post.tags.some((name) => slugify(name) === tag))
    .map(postListItem)
}

export function getBlogsByTag(tag: string): Blog[] {
  return publishedBlogs.filter((post) => post.tags.some((name) => slugify(name) === tag))
}

export function getPostsPage(page: number): {
  items: PostListItem[]
  currentPage: number
  totalPages: number
} | null {
  const totalPages = Math.max(1, Math.ceil(publishedPosts.length / POSTS_PER_PAGE))
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null

  return {
    items: publishedPosts
      .slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE)
      .map(postListItem),
    currentPage: page,
    totalPages,
  }
}

export function getAuthorBySlug(slug: string): Authors | undefined {
  return authors.find((author) => author.slug === slug)
}

export function getAuthorDetails(authorSlugs: string[]): CoreContent<Authors>[] {
  return authorSlugs.map((authorSlug) => {
    const author = getAuthorBySlug(authorSlug)
    if (!author) throw new Error(`Unknown author referenced by blog post: ${authorSlug}`)
    return coreContent(author)
  })
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
