import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { slug as slugify } from 'github-slugger'

const root = process.cwd()
const outputDirectory = path.join(root, 'out')
const basePath = (process.env.BASE_PATH || '').replace(/\/$/, '')

const blogs = JSON.parse(await readFile(path.join(root, '.velite', 'blogs.json'), 'utf8'))
const authors = JSON.parse(await readFile(path.join(root, '.velite', 'authors.json'), 'utf8'))
const publishedBlogs = blogs.filter((post) => !post.draft)
const publishedPaths = new Set(publishedBlogs.map((post) => post.path))
const authorSlugs = new Set(authors.map((author) => author.slug))
const failures = []
const postsPerPage = 10

function fail(message) {
  failures.push(message)
}

function assertUnique(values, label) {
  const seen = new Set()
  for (const value of values) {
    if (seen.has(value)) fail(`Duplicate ${label}: ${value}`)
    seen.add(value)
  }
}

async function exists(target) {
  try {
    await stat(target)
    return true
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
}

async function walk(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(target, extension)))
    else if (!extension || target.endsWith(extension)) files.push(target)
  }
  return files
}

function stripBasePath(urlPath) {
  if (!basePath) return urlPath
  if (urlPath === basePath) return '/'
  if (urlPath.startsWith(`${basePath}/`)) return urlPath.slice(basePath.length)
  return null
}

async function resolveReference(htmlFile, reference) {
  if (
    !reference ||
    reference.startsWith('#') ||
    reference.startsWith('//') ||
    /^(?:data|mailto|tel|javascript):/i.test(reference)
  ) {
    return true
  }

  let parsed
  try {
    parsed = new URL(reference, 'https://local.invalid')
  } catch {
    return false
  }
  if (parsed.origin !== 'https://local.invalid') return true

  let target
  if (reference.startsWith('/')) {
    const strippedPath = stripBasePath(decodeURI(parsed.pathname))
    if (strippedPath === null) return false
    target = path.join(outputDirectory, strippedPath.replace(/^\//, ''))
  } else {
    const relativePath = decodeURI(reference.split(/[?#]/, 1)[0])
    target = path.resolve(path.dirname(htmlFile), relativePath)
  }

  return (
    (await exists(target)) ||
    (await exists(`${target}.html`)) ||
    (await exists(path.join(target, 'index.html')))
  )
}

assertUnique(
  blogs.map((post) => post.slug),
  'blog slug'
)
assertUnique(
  authors.map((author) => author.slug),
  'author slug'
)

for (const post of blogs) {
  for (const author of post.authors) {
    if (!authorSlugs.has(author)) fail(`${post.slug} references unknown author ${author}`)
  }
}

for (const post of publishedBlogs) {
  if (!(await exists(path.join(outputDirectory, `${post.path}.html`)))) {
    fail(`Missing exported post: /${post.path}`)
  }
}

for (const post of blogs.filter((entry) => entry.draft)) {
  if (await exists(path.join(outputDirectory, `${post.path}.html`))) {
    fail(`Draft post was exported: /${post.path}`)
  }
}

const searchDocuments = JSON.parse(
  await readFile(path.join(outputDirectory, 'search.json'), 'utf8')
)
const searchPaths = new Set(searchDocuments.map((document) => document.path))
if (searchDocuments.length !== publishedBlogs.length) {
  fail(`Search index has ${searchDocuments.length} entries; expected ${publishedBlogs.length}`)
}
for (const publishedPath of publishedPaths) {
  if (!searchPaths.has(publishedPath)) fail(`Search index is missing ${publishedPath}`)
}

const feed = await readFile(path.join(outputDirectory, 'feed.xml'), 'utf8')
const feedItemCount = feed.match(/<item>/g)?.length ?? 0
if (feedItemCount !== publishedBlogs.length) {
  fail(`RSS feed has ${feedItemCount} entries; expected ${publishedBlogs.length}`)
}

const sitemap = await readFile(path.join(outputDirectory, 'sitemap.xml'), 'utf8')
const sitemapPaths = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    decodeURI(new URL(match[1]).pathname.replace(/\/$/, '') || '/')
  )
)
const expectedSitemapPaths = new Set([
  '/',
  '/blog',
  '/about',
  '/tags',
  ...publishedBlogs.map((post) => `/${post.path}`),
  ...new Set(publishedBlogs.flatMap((post) => post.tags.map((tag) => `/tags/${slugify(tag)}`))),
  ...Array.from(
    { length: Math.max(0, Math.ceil(publishedBlogs.length / postsPerPage) - 1) },
    (_, index) => `/blog/page/${index + 2}`
  ),
])
for (const expectedPath of expectedSitemapPaths) {
  if (!sitemapPaths.has(expectedPath)) fail(`Sitemap is missing ${expectedPath}`)
}
for (const sitemapPath of sitemapPaths) {
  if (!expectedSitemapPaths.has(sitemapPath)) fail(`Sitemap has unexpected route ${sitemapPath}`)
}

const sentinelTargets = [
  path.join(outputDirectory, 'blog', 'page', '_empty.html'),
  path.join(outputDirectory, 'blog', 'page', '_empty.txt'),
  path.join(outputDirectory, 'blog', 'page', '_empty'),
]
for (const target of sentinelTargets) {
  if (await exists(target)) fail(`Pagination sentinel leaked into export: ${target}`)
}

const htmlFiles = await walk(outputDirectory, '.html')
const referencePattern = /\b(?:href|src)="([^"]+)"/g
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8')
  for (const match of html.matchAll(referencePattern)) {
    if (!(await resolveReference(htmlFile, match[1]))) {
      fail(`${path.relative(outputDirectory, htmlFile)} has missing reference ${match[1]}`)
    }
  }
}

const manifestPath = path.join(outputDirectory, 'static', 'favicons', 'site.webmanifest')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const icon of manifest.icons || []) {
  const iconTarget = icon.src.startsWith('/')
    ? path.join(outputDirectory, icon.src.replace(/^\//, ''))
    : path.resolve(path.dirname(manifestPath), icon.src)
  if (!(await exists(iconTarget))) fail(`Web manifest references missing icon ${icon.src}`)
}

if (failures.length) {
  console.error(`Export verification failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exitCode = 1
} else {
  console.log(
    `Export verification passed: ${htmlFiles.length} HTML files, ${publishedBlogs.length} published posts.`
  )
}
