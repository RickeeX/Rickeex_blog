import { TOCInline, Pre } from '@/lib/mdx'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import DataWrapper from './DataWrapper'
import NewsletterForm from './NewsletterForm'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm: NewsletterForm,
  DataWrapper,
}
