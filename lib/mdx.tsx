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
  // 从 className 提取语言
  const languageMatch = className?.match(/language-(\w+)/)
  const language = languageMatch ? languageMatch[1] : ''

  // 提取代码文本
  const getCodeText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(getCodeText).join('')
    if (React.isValidElement(node) && node.props?.children) {
      return getCodeText(node.props.children)
    }
    return ''
  }

  const codeText = getCodeText(children)

  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="code-block-wrapper">
      {language && (
        <div className="code-header">
          <span className="language-tag">{language}</span>
          <button className="copy-button" onClick={handleCopy} aria-label="Copy code">
            {copied ? (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}
      <pre className={className} {...props}>
        {children}
      </pre>
    </div>
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
