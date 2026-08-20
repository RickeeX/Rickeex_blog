import { MDXLayoutRenderer } from '@/lib/mdx'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/lib/content'
import { getAuthorBySlug } from '@/lib/content.server'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = getAuthorBySlug('default')
  if (!author) throw new Error('Required default author is missing')
  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.content} />
    </AuthorLayout>
  )
}
