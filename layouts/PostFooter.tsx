import Comments from '@/components/Comments'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

interface PostLink {
  path: string
  title: string
}

export function PostComments() {
  if (!siteMetadata.comments?.provider) return null

  return (
    <div className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300" id="comment">
      <Comments />
    </div>
  )
}

export default function PostFooter({
  next,
  prev,
  tags,
  backHref,
  compact = false,
}: {
  next?: PostLink
  prev?: PostLink
  tags?: string[]
  backHref?: string
  compact?: boolean
}) {
  return (
    <>
      {tags?.length ? (
        <div className="py-4 xl:py-8">
          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tags</h2>
          <div className="flex flex-wrap">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
      ) : null}
      {(next || prev) && (
        <div
          className={
            compact
              ? 'flex justify-between py-4 xl:block xl:space-y-8 xl:py-8'
              : 'flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base'
          }
        >
          {prev?.path && (
            <div className={compact ? undefined : 'pt-4 xl:pt-8'}>
              {compact && (
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Previous Article
                </h2>
              )}
              <Link
                href={`/${prev.path}`}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={`Previous post: ${prev.title}`}
              >
                &larr; {prev.title}
              </Link>
            </div>
          )}
          {next?.path && (
            <div className={compact ? undefined : 'pt-4 xl:pt-8'}>
              {compact && (
                <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Next Article
                </h2>
              )}
              <Link
                href={`/${next.path}`}
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label={`Next post: ${next.title}`}
              >
                {next.title} &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
      {backHref && (
        <div className="pt-4 xl:pt-8">
          <Link
            href={backHref}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="Back to the blog"
          >
            &larr; Back to the blog
          </Link>
        </div>
      )}
    </>
  )
}
