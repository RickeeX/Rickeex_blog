import 'css/prism.css'
import 'katex/dist/katex.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { authors } from '#site/content'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import { coreContent, type Authors, type CoreContent, type PostLayoutName } from '@/lib/content'
import { getPostBySlug, publishedPosts } from '@/lib/content.server'
import { MDXLayoutRenderer } from '@/lib/mdx'

const layouts = {
  PostLayout,
  PostSimple,
  PostBanner,
} satisfies Record<PostLayoutName, typeof PostLayout>

function getAuthorDetails(authorSlugs: string[]): CoreContent<Authors>[] {
  return authorSlugs.flatMap((authorSlug) => {
    const author = authors.find(({ slug }) => slug === authorSlug)
    return author ? [coreContent(author)] : []
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const { slug: segments } = await params
  const post = getPostBySlug(decodeURI(segments.join('/')))
  if (!post) return undefined

  const authorNames = getAuthorDetails(post.authors).map(({ name }) => name)
  const images = (post.images?.length ? post.images : ['/opengraph-image']).map((image) =>
    image.startsWith('http') ? image : new URL(image, siteMetadata.siteUrl).toString()
  )

  return {
    title: post.title,
    description: post.summary || undefined,
    alternates: { canonical: post.canonicalUrl || `/${post.path}` },
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.lastmod || post.date).toISOString(),
      url: `${siteMetadata.siteUrl}/${post.path}`,
      images,
      authors: authorNames.length ? authorNames : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || undefined,
      images,
    },
  }
}

export function generateStaticParams() {
  return publishedPosts.map((post) => ({
    slug: post.slug.split('/').map(decodeURI),
  }))
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug: segments } = await params
  const slug = decodeURI(segments.join('/'))
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const postIndex = publishedPosts.findIndex((item) => item.slug === slug)
  const prev = publishedPosts[postIndex + 1]
  const next = publishedPosts[postIndex - 1]
  const authorDetails = getAuthorDetails(post.authors)
  const mainContent = coreContent(post)
  const Layout = layouts[post.layout]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
    description: post.summary,
    image: post.images?.[0],
    url: `${siteMetadata.siteUrl}/${post.path}`,
    author: authorDetails.map(({ name }) => ({
      '@type': 'Person',
      name,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.content} />
      </Layout>
    </>
  )
}
