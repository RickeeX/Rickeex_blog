import { NextResponse } from 'next/server'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const provider = siteMetadata.newsletter?.provider

  try {
    if (provider === 'buttondown') {
      const API_KEY = process.env.BUTTONDOWN_API_KEY
      if (!API_KEY) {
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
      }

      const response = await fetch('https://api.buttondown.email/v1/subscribers', {
        method: 'POST',
        headers: {
          Authorization: `Token ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.status >= 400) {
        const data = await response.json()
        return NextResponse.json(
          { error: data.detail || 'Subscription failed' },
          { status: response.status }
        )
      }

      return NextResponse.json({ message: 'Successfully subscribed!' })
    }

    if (provider === 'mailchimp') {
      const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY
      const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID
      const MAILCHIMP_API_SERVER = process.env.MAILCHIMP_API_SERVER

      if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_API_SERVER) {
        return NextResponse.json({ error: 'Mailchimp not configured' }, { status: 500 })
      }

      const mcResponse = await fetch(
        `https://${MAILCHIMP_API_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: 'POST',
          headers: {
            Authorization: `apikey ${MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
          }),
        }
      )

      if (mcResponse.status >= 400) {
        return NextResponse.json({ error: 'Subscription failed' }, { status: mcResponse.status })
      }

      return NextResponse.json({ message: 'Successfully subscribed!' })
    }

    return NextResponse.json({ error: 'Newsletter provider not configured' }, { status: 500 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Newsletter API' })
}
