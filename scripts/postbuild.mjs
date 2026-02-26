import { writeFileSync } from 'fs'
import path from 'path'
import siteMetadata from '../data/siteMetadata.js'
import rss from './rss.mjs'

/**
 * 创建搜索索引
 */
function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    // 提取核心内容用于搜索
    const searchData = allBlogs
      .filter((post) => !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((post) => ({
        title: post.title,
        date: post.date,
        tags: post.tags,
        lastmod: post.lastmod,
        draft: post.draft,
        summary: post.summary,
        images: post.images,
        authors: post.authors,
        layout: post.layout,
        slug: post.slug,
        path: post.path,
        filePath: post.filePath,
        readingTime: post.readingTime,
        structuredData: post.structuredData,
      }))

    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(searchData)
    )
    console.log('Local search index generated...')
  }
}

async function postbuild() {
  try {
    // 动态导入 velite 生成的数据
    const { default: blogs } = await import('../.velite/blogs.json', { with: { type: 'json' } })

    // 生成搜索索引
    createSearchIndex(blogs)

    // 生成 RSS
    await rss()
  } catch (error) {
    console.error('Postbuild failed:', error.message)
    console.log('Make sure to run "velite" first to generate content.')
  }
}

postbuild()
