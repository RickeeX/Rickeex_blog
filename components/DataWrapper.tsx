'use client'

import { useEffect, useRef } from 'react'

interface DatawrapperProps {
  src: string
  title?: string
  height?: number
  className?: string
}

export default function Datawrapper({
  src,
  title = 'Chart',
  height = 500,
  className = '',
}: DatawrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const frame = iframeRef.current
      if (!frame || event.source !== frame.contentWindow) return
      const heights = event.data?.['datawrapper-height']
      if (!heights || typeof heights !== 'object') return
      const nextHeight = Object.values(heights).find((value) => typeof value === 'number')
      if (typeof nextHeight === 'number') frame.style.height = `${nextHeight}px`
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className={`my-8 w-full ${className}`}>
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        scrolling="no"
        frameBorder="0"
        style={{ width: '100%', minWidth: '100%', border: 'none' }}
        height={height}
      />
    </div>
  )
}
