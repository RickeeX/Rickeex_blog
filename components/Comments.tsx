'use client'

import { useState } from 'react'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

type GiscusMapping = 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const commentsTheme =
    siteMetadata.comments?.giscusConfig?.themeURL ||
    (theme === 'dark' || resolvedTheme === 'dark'
      ? siteMetadata.comments?.giscusConfig?.darkTheme || 'transparent_dark'
      : siteMetadata.comments?.giscusConfig?.theme || 'light')

  if (!siteMetadata.comments?.provider) {
    return null
  }

  return (
    <>
      {loadComments ? (
        <Giscus
          id="comments"
          repo={siteMetadata.comments.giscusConfig.repo as `${string}/${string}`}
          repoId={siteMetadata.comments.giscusConfig.repositoryId}
          category={siteMetadata.comments.giscusConfig.category}
          categoryId={siteMetadata.comments.giscusConfig.categoryId}
          mapping={siteMetadata.comments.giscusConfig.mapping as GiscusMapping}
          reactionsEnabled={siteMetadata.comments.giscusConfig.reactions}
          emitMetadata={siteMetadata.comments.giscusConfig.metadata}
          inputPosition="top"
          theme={commentsTheme}
          lang={siteMetadata.comments.giscusConfig.lang}
          loading="lazy"
        />
      ) : (
        <button
          onClick={() => setLoadComments(true)}
          className="rounded-md bg-primary-500 px-4 py-2 text-white transition-colors hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
        >
          加载评论
        </button>
      )}
    </>
  )
}
