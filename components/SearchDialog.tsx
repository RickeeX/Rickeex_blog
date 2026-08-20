'use client'

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarResults,
  KBarSearch,
  useKBar,
  useMatches,
  VisualState,
  type Action,
} from 'kbar'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchDocument } from '@/lib/content'

function Results() {
  const { results } = useMatches()
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className="px-4 py-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {item}
          </div>
        ) : (
          <div
            className={`flex cursor-pointer items-center justify-between px-4 py-3 ${
              active
                ? 'bg-primary-500 text-white'
                : 'bg-transparent text-gray-700 dark:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.name}</span>
            </div>
          </div>
        )
      }
    />
  )
}

function DialogContent({ searchPath }: { searchPath: string }) {
  const router = useRouter()
  const { query } = useKBar()
  const [posts, setPosts] = useState<SearchDocument[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    query.setVisualState(VisualState.showing)
  }, [query])

  useEffect(() => {
    const controller = new AbortController()
    fetch(searchPath, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`)
        return response.json() as Promise<SearchDocument[]>
      })
      .then((documents) => {
        setPosts(documents)
        setLoadError(null)
      })
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          console.error('Unable to load search index:', error)
          setLoadError('Unable to load the search index.')
        }
      })
    return () => controller.abort()
  }, [requestVersion, searchPath])

  const actions = useMemo<Action[]>(
    () => [
      {
        id: 'home',
        name: 'Home',
        shortcut: ['h'],
        keywords: 'home',
        section: 'Navigation',
        perform: () => router.push('/'),
        icon: '🏠',
      },
      {
        id: 'blog',
        name: 'Blog',
        shortcut: ['b'],
        keywords: 'blog posts',
        section: 'Navigation',
        perform: () => router.push('/blog'),
        icon: '📝',
      },
      {
        id: 'tags',
        name: 'Tags',
        shortcut: ['t'],
        keywords: 'tags',
        section: 'Navigation',
        perform: () => router.push('/tags'),
        icon: '🏷️',
      },
      {
        id: 'about',
        name: 'About',
        shortcut: ['a'],
        keywords: 'about',
        section: 'Navigation',
        perform: () => router.push('/about'),
        icon: '👤',
      },
      ...posts.map((post) => ({
        id: post.path,
        name: post.title,
        keywords: `${post.title} ${post.summary || ''} ${post.tags.join(' ')} ${post.slug}`,
        section: 'Blog',
        subtitle: post.summary || undefined,
        perform: () => router.push(`/${post.path}`),
      })),
    ],
    [posts, router]
  )

  useEffect(() => query.registerActions(actions), [actions, query])

  return (
    <KBarPortal>
      <KBarPositioner className="z-50 bg-gray-900/80 backdrop-blur-sm">
        <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <KBarSearch
            className="w-full border-b border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            placeholder={
              loadError
                ? 'Search is temporarily unavailable'
                : posts.length
                  ? `Search ${posts.length} posts...`
                  : 'Loading posts...'
            }
          />
          {loadError ? (
            <div className="flex items-center justify-between gap-4 px-4 py-5" role="alert">
              <span className="text-sm text-gray-600 dark:text-gray-300">{loadError}</span>
              <button
                type="button"
                className="text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                onClick={() => {
                  setLoadError(null)
                  setRequestVersion((version) => version + 1)
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <Results />
          )}
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  )
}

export default function SearchDialog({
  onClose,
  searchPath,
}: {
  onClose: () => void
  searchPath: string
}) {
  const hasOpened = useRef(false)

  return (
    <KBarProvider
      options={{
        callbacks: {
          onOpen: () => {
            hasOpened.current = true
          },
          onClose: () => {
            if (hasOpened.current) onClose()
          },
        },
      }}
    >
      <DialogContent searchPath={searchPath} />
    </KBarProvider>
  )
}
