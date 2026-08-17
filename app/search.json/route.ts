import { getSearchDocuments } from '@/lib/content.server'

export const dynamic = 'force-static'

export function GET() {
  return Response.json(getSearchDocuments())
}
