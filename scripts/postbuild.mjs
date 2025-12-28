import { writeFileSync } from 'fs'
import path from 'path'
import { slug } from 'github-slugger'
import siteMetadata from '../data/siteMetadata.js'
import rss from './rss.mjs'

const isProduction = process.env.NODE_ENV === 'production'

/**
 * 创建 tag 统计
 */
function createTagCount(allBlogs) {
  const tagCount = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
  console.log('Tag data generated...')
}

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

    // 生成 tag 数据
    createTagCount(blogs)

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
