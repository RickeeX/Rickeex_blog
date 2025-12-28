import { slug as slugify } from 'github-slugger'

// 类型定义
export interface Blog {
  title: string
  date: string
  tags: string[]
  lastmod?: string
  draft: boolean
  summary?: string | null
  images?: string[]
  authors: string[]
  layout: string
  bibliography?: string
  canonicalUrl?: string
  slug: string
  path: string
  filePath: string
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  structuredData: {
    '@context': string
    '@type': string
    headline: string
    datePublished: string
    dateModified: string
    description?: string | null
    image?: string
    url: string
  }
  content: string
  raw: string
}

export interface Authors {
  name: string
  avatar?: string
  occupation?: string
  company?: string
  email?: string
  twitter?: string
  bluesky?: string
  linkedin?: string
  github?: string
  layout?: string
  slug: string
  path: string
  filePath: string
  content: string
  raw: string
}

// CoreContent 类型 - 移除 content 和 raw 字段
export type CoreContent<T> = Omit<T, 'content' | 'raw'>

/**
 * 提取核心内容（移除 MDX body）
 */
export function coreContent<T extends { content: string; raw: string }>(
  content: T
): CoreContent<T> {
  const { content: _, raw: __, ...rest } = content
  return rest as CoreContent<T>
}

/**
 * 获取所有核心内容
 */
export function allCoreContent<T extends { content: string; raw: string; draft?: boolean }>(
  contents: T[]
): CoreContent<T>[] {
  return contents.filter((c) => !('draft' in c) || c.draft !== true).map((c) => coreContent(c))
}

/**
 * 按日期排序文章
 */
export function sortPosts<T extends { date: string; draft?: boolean }>(
  posts: T[],
  dateKey: keyof T = 'date' as keyof T
): T[] {
  return posts
    .filter((post) => !('draft' in post) || post.draft !== true)
    .sort((a, b) => {
      const dateA = new Date(a[dateKey] as string)
      const dateB = new Date(b[dateKey] as string)
      return dateB.getTime() - dateA.getTime()
    })
}

/**
 * 格式化日期
 */
export function formatDate(date: string, locale: string = 'en-US'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString(locale, options)
}

/**
 * 创建 tag 统计
 */
export function createTagCount(blogs: Blog[]): Record<string, number> {
  const tagCount: Record<string, number> = {}
  blogs.forEach((blog) => {
    if (blog.tags && blog.draft !== true) {
      blog.tags.forEach((tag) => {
        const formattedTag = slugify(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  return tagCount
}
