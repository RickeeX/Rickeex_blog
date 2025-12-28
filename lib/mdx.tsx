'use client'

import * as React from 'react'
import * as _jsx_runtime from 'react/jsx-runtime'
import Image from '@/components/Image'
import CustomLink from '@/components/Link'
import TableWrapper from '@/components/TableWrapper'
import DataWrapper from '@/components/DataWrapper'
import NewsletterForm from '@/components/NewsletterForm'

// 客户端组件的 MDX 渲染器
interface MDXLayoutRendererProps {
  code: string
}

// TOC 内联组件
interface TOCInlineProps {
  toc: { value: string; url: string; depth: number }[]
  indentDepth?: number
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
}

function TOCInline({
  toc,
  indentDepth = 3,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
}: TOCInlineProps) {
  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )

  const tocList = (
    <ul className="ml-0 list-none">
      {filteredToc.map((heading) => (
        <li key={heading.value} className={`${heading.depth >= indentDepth && 'ml-6'}`}>
          <a href={heading.url}>{heading.value}</a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {asDisclosure ? (
        <details open>
          <summary className="ml-6 pb-2 pt-2 text-xl font-bold">Table of Contents</summary>
          <div className="ml-6">{tocList}</div>
        </details>
      ) : (
        tocList
      )}
    </>
  )
}

// 代码块组件
interface PreProps {
  children: React.ReactNode
  className?: string
}

function Pre({ children, className, ...props }: PreProps) {
  return (
    <pre className={className} {...props}>
      {children}
    </pre>
  )
}

// 内置的 MDX 组件
const mdxComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm: NewsletterForm,
  DataWrapper,
}

export function MDXLayoutRenderer({ code }: MDXLayoutRendererProps) {
  const Component = React.useMemo(() => {
    if (!code || code.trim() === '') {
      return () => null
    }
    try {
      const fn = new Function('_jsx_runtime', code)
      const result = fn(_jsx_runtime)
      return result?.default || (() => null)
    } catch (error) {
      console.error('Error parsing MDX:', error)
      return () => null
    }
  }, [code])

  return <Component components={mdxComponents} />
}

export { TOCInline, Pre }
