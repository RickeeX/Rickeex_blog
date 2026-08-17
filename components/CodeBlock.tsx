'use client'

import { isValidElement, useState, type ReactElement, type ReactNode } from 'react'

interface CodeBlockProps {
  children: ReactNode
  className?: string
}

function getCodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getCodeText).join('')
  if (isValidElement(node)) {
    return getCodeText((node as ReactElement<{ children?: ReactNode }>).props.children)
  }
  return ''
}

export default function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const language = className?.match(/language-(\w+)/)?.[1]
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(getCodeText(children))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <div className="code-block-wrapper">
      {language && (
        <div className="code-header">
          <span className="language-tag">{language}</span>
          <button className="copy-button" onClick={copyCode} aria-label="Copy code">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  copied
                    ? 'M5 13l4 4L19 7'
                    : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                }
              />
            </svg>
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}
      <pre className={className} {...props}>
        {children}
      </pre>
    </div>
  )
}
