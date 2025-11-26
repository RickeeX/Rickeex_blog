'use client' // 👈 这一行非常重要，必须在第一行

import { useEffect, useRef } from 'react' // 👈 报错就是因为漏了这句

// 定义组件参数的类型 (TypeScript 规范)
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
  // 给 ref 加上具体的 HTML 类型
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data['datawrapper-height'] !== 'undefined') {
        const iframes = document.querySelectorAll('iframe')
        for (const key in event.data['datawrapper-height']) {
          for (let i = 0; i < iframes.length; i++) {
            // 安全检查：确保 iframeRef.current 存在
            if (iframes[i].contentWindow === event.source) {
              const newHeight = event.data['datawrapper-height'][key] + 'px'
              iframes[i].style.height = newHeight
            }
          }
        }
      }
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
