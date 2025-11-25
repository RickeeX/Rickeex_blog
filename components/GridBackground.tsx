'use client'

import { useEffect, useState } from 'react'

const GridBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [viewport, setViewport] = useState({ width: 1920, height: 1080 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const updateViewport = () =>
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const gridSpacing = 24 // px，网格边长
  const createPositions = (length: number) =>
    Array.from({ length: Math.ceil(length / gridSpacing) + 2 }, (_, i) => i * gridSpacing)

  const verticalPositions = createPositions(viewport.width)
  const horizontalPositions = createPositions(viewport.height)

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden">
      {/* 垂直线 - 从顶部向下绘制 */}
      {verticalPositions.map((pos, index) => (
        <div
          key={`v-${pos}`}
          className="grid-line grid-line-vertical absolute top-0"
          style={{
            left: `${pos}px`,
            width: '1px',
            height: '0%',
            animationName: mounted ? 'grid-line-vertical' : 'none',
            animationDuration: '1.2s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
            animationDelay: `${index * 0.05}s`,
            willChange: 'height',
          }}
        />
      ))}

      {/* 水平线 - 从左向右绘制 */}
      {horizontalPositions.map((pos, index) => (
        <div
          key={`h-${pos}`}
          className="grid-line grid-line-horizontal absolute left-0"
          style={{
            top: `${pos}px`,
            width: '0%',
            height: '1px',
            animationName: mounted ? 'grid-line-horizontal' : 'none',
            animationDuration: '1.2s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
            // 水平线延迟稍后开始，让垂直线先绘制
            animationDelay: `${0.3 + index * 0.05}s`,
            willChange: 'width',
          }}
        />
      ))}

      {/* 微妙的氛围光晕 - 更轻量 */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-[120px] dark:bg-fuchsia-500/10"></div>
    </div>
  )
}

export default GridBackground
