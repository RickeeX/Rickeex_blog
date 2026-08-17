import { ImageResponse } from 'next/og'

export const alt = "Rickee's Blog"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '90px',
        color: '#f9fafb',
        backgroundColor: '#030712',
        backgroundImage:
          'radial-gradient(circle at 75% 30%, rgba(219, 39, 119, 0.45), transparent 38%)',
      }}
    >
      <div style={{ fontSize: 78, fontWeight: 800, letterSpacing: '-0.04em' }}>
        Rickee&apos;s Blog
      </div>
      <div style={{ marginTop: 30, fontSize: 32, color: '#d1d5db' }}>Per Aspera Ad Astra.</div>
      <div style={{ marginTop: 86, fontSize: 25, color: '#f472b6' }}>rickeex.com</div>
    </div>,
    size
  )
}
