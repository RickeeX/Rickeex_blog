import { authors } from '#site/content'
import { MDXLayoutRenderer } from '@/lib/mdx'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from '@/lib/content'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = authors.find((p) => p.slug === 'default')
  if (!author) {
    return <div>Author not found</div>
  }
  const mainContent = coreContent(author)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.content} />
    </AuthorLayout>
  )
}
