import { readdir, rm, rmdir } from 'node:fs/promises'
import path from 'node:path'

// Next.js 16.1 rejects an empty generateStaticParams() result under output:
// 'export'. The pagination route therefore emits a private notFound sentinel
// when there is only one page. Remove only that known build artifact so it
// cannot become a public URL in the Pages deployment.
const pageDirectory = path.join(process.cwd(), 'out', 'blog', 'page')
const sentinelTargets = [
  path.join(pageDirectory, '_empty.html'),
  path.join(pageDirectory, '_empty.txt'),
  path.join(pageDirectory, '_empty'),
]

await Promise.all(sentinelTargets.map((target) => rm(target, { force: true, recursive: true })))

try {
  if ((await readdir(pageDirectory)).length === 0) await rmdir(pageDirectory)
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
