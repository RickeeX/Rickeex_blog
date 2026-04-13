'use client'

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  KBarResults,
  useMatches,
  useRegisterActions,
  Action,
} from 'kbar'
import { useRouter } from 'next/navigation'
import { ReactNode, useMemo, useEffect, useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

interface SearchProviderProps {
  children: ReactNode
}

function RenderResults() {
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
            {item.shortcut && item.shortcut.length > 0 && (
              <div className="flex gap-1">
                {item.shortcut.map((sc: string) => (
                  <kbd
                    key={sc}
                    className={`rounded px-2 py-1 text-xs ${
                      active ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {sc}
                  </kbd>
                ))}
              </div>
            )}
          </div>
        )
      }
    />
  )
}

function StaticNavigation({ router }: { router: ReturnType<typeof useRouter> }) {
  const staticActions = useMemo<Action[]>(
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
    ],
    [router]
  )

  useRegisterActions(staticActions, [router])

  return null
}

function BlogSearchActions({
  router,
  onLoaded,
}: {
  router: ReturnType<typeof useRouter>
  onLoaded: (count: number) => void
}) {
  const [blogActions, setBlogActions] = useState<Action[]>([])

  useEffect(() => {
    const loadSearchData = async () => {
      try {
        const searchDocumentsPath =
          siteMetadata.search?.kbarConfig?.searchDocumentsPath || '/search.json'
        const res = await fetch(searchDocumentsPath)

        if (!res.ok) return

        const data = await res.json()

        if (!Array.isArray(data) || data.length === 0) return

        const actions: Action[] = data.map((post: Record<string, string>) => ({
          id: post.path,
          name: post.title,
          keywords: `${post.title} ${post.summary || ''} ${Array.isArray(post.tags) ? post.tags.join(' ') : ''} ${post.slug || ''}`,
          section: 'Blog',
          subtitle: post.summary,
          perform: () => router.push('/' + post.path),
        }))

        setBlogActions(actions)
        onLoaded(actions.length)
      } catch (error) {
        console.error('Search load error:', error)
      }
    }

    loadSearchData()
  }, [router, onLoaded])

  useRegisterActions(blogActions, [blogActions])

  return null
}

export default function SearchProvider({ children }: SearchProviderProps) {
  const router = useRouter()
  const [loadedCount, setLoadedCount] = useState(0)

  return (
    <KBarProvider>
      <StaticNavigation router={router} />
      <BlogSearchActions router={router} onLoaded={setLoadedCount} />
      <KBarPortal>
        <KBarPositioner className="z-50 bg-gray-900/80 backdrop-blur-sm">
          <KBarAnimator className="w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <KBarSearch
              className="w-full border-b border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              placeholder={loadedCount > 0 ? `Search ${loadedCount} posts...` : 'Search...'}
            />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  )
}
