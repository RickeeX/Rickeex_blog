import { defineConfig, defineCollection, s } from 'velite'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypePrismPlus from 'rehype-prism-plus'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import readingTime from 'reading-time'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'

const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

// 计算 slug - 从文件路径生成
const computeSlug = (path: string) => {
  // 移除 blog/ 前缀
  return path.replace(/^blog\//, '')
}

const blogs = defineCollection({
  name: 'Blog',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(200),
      date: s.isodate(),
      tags: s.array(s.string()).default([]),
      lastmod: s.isodate().optional(),
      draft: s.boolean().default(false),
      summary: s.string().optional().nullable(),
      images: s.array(s.string()).optional(),
      authors: s.array(s.string()).default(['default']),
      layout: s.string().default('PostLayout'),
      bibliography: s.string().optional(),
      canonicalUrl: s.string().optional(),
      // Velite 内置字段
      slug: s.path(),
      content: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => {
      const slugPath = computeSlug(data.slug)
      return {
        ...data,
        slug: slugPath,
        path: `blog/${slugPath}`,
        filePath: `data/blog/${slugPath}.mdx`,
        readingTime: readingTime(data.raw),
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.title,
          datePublished: data.date,
          dateModified: data.lastmod || data.date,
          description: data.summary,
          image: data.images?.[0],
          url: `blog/${slugPath}`,
        },
      }
    }),
})

const authors = defineCollection({
  name: 'Authors',
  pattern: 'authors/**/*.mdx',
  schema: s
    .object({
      name: s.string().max(100),
      avatar: s.string().optional(),
      occupation: s.string().optional(),
      company: s.string().optional(),
      email: s.string().optional(),
      twitter: s.string().optional(),
      bluesky: s.string().optional(),
      linkedin: s.string().optional(),
      github: s.string().optional(),
      layout: s.string().optional(),
      slug: s.path(),
      content: s.mdx(),
      raw: s.raw(),
    })
    .transform((data) => {
      const slugPath = data.slug.replace(/^authors\//, '')
      return {
        ...data,
        slug: slugPath,
        path: `authors/${slugPath}`,
        filePath: `data/authors/${slugPath}.mdx`,
        readingTime: readingTime(data.raw),
      }
    }),
})

export default defineConfig({
  root: 'data',
  output: {
    data: '.velite',
    assets: 'public/static/velite',
    base: '/static/velite/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { blogs, authors },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath, remarkAlert],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
    ],
  },
})
