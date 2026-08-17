/* eslint-disable react-hooks/static-components -- compiled MDX components are evaluated on the server */
import * as jsxRuntime from 'react/jsx-runtime'
import type { ComponentType } from 'react'
import type { MDXComponents } from 'mdx/types'
import CodeBlock from '@/components/CodeBlock'
import DataWrapper from '@/components/DataWrapper'
import Image from '@/components/Image'
import CustomLink from '@/components/Link'
import TableWrapper from '@/components/TableWrapper'

interface MDXLayoutRendererProps {
  code: string
}

interface TOCInlineProps {
  toc: { value: string; url: string; depth: number }[]
  indentDepth?: number
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
}

export function TOCInline({
  toc,
  indentDepth = 3,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
}: TOCInlineProps) {
  const expression = Array.isArray(exclude) ? exclude.join('|') : exclude
  const excludedHeading = expression ? new RegExp(`^(${expression})$`, 'i') : null
  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading &&
      heading.depth <= toHeading &&
      !excludedHeading?.test(heading.value)
  )

  const list = (
    <ul className="ml-0 list-none">
      {filteredToc.map((heading) => (
        <li key={heading.url} className={heading.depth >= indentDepth ? 'ml-6' : undefined}>
          <a href={heading.url}>{heading.value}</a>
        </li>
      ))}
    </ul>
  )

  return asDisclosure ? (
    <details open>
      <summary className="ml-6 pb-2 pt-2 text-xl font-bold">Table of Contents</summary>
      <div className="ml-6">{list}</div>
    </details>
  ) : (
    list
  )
}

const mdxComponents: MDXComponents = {
  Image,
  img: Image,
  TOCInline,
  a: CustomLink,
  pre: CodeBlock,
  table: TableWrapper,
  DataWrapper,
}

function getMDXComponent(code: string): ComponentType<{ components: MDXComponents }> {
  const evaluate = new Function('_jsx_runtime', code)
  return evaluate(jsxRuntime).default
}

export function MDXLayoutRenderer({ code }: MDXLayoutRendererProps) {
  if (!code.trim()) return null
  const Component = getMDXComponent(code)
  return <Component components={mdxComponents} />
}
