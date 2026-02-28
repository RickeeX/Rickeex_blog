'use client'

import { useEffect, useState, useMemo } from 'react'

const GRID_SPACING = 24 // 网格间距 (px)

// 氛围光晕参数
const GLOW_CONFIG = {
  // 尺寸 (px)
  desktopSize: 900,
  mobileSize: 500,
  // 位置 (百分比) - 光晕中心在页面的位置
  centerPosition: '35%',
  // 夜间模式: 紫红色 (rgba 最后一位是 opacity)
  darkColor: 'rgba(192, 38, 211, 0.35)',
}

const GridBackgroundMinimal = () => {
  const [mounted, setMounted] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setMounted(true)
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  // 防抖监听 Resize
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null
    const updateViewport = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, 150)
    }
    window.addEventListener('resize', updateViewport, { passive: true })
    return () => {
      window.removeEventListener('resize', updateViewport)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // 生成网格位置
  const verticalLines = useMemo(() => {
    if (viewport.width === 0) return []
    const count = Math.ceil(viewport.width / GRID_SPACING)
    return Array.from({ length: count }, (_, i) => i * GRID_SPACING)
  }, [viewport.width])

  const horizontalLines = useMemo(() => {
    if (viewport.height === 0) return []
    const count = Math.ceil(viewport.height / GRID_SPACING)
    return Array.from({ length: count }, (_, i) => i * GRID_SPACING)
  }, [viewport.height])

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden bg-[#fdfbf7] transition-colors duration-500 dark:bg-gray-950">
      {/* 竖线 - 静态显示 */}
      {verticalLines.map((pos) => (
        <div
          key={`v-${pos}`}
          className="absolute top-0 h-full w-[1px] bg-gray-100 dark:bg-gray-800/35"
          style={{
            left: `${pos}px`,
          }}
        />
      ))}

      {/* 横线 - 静态显示 */}
      {horizontalLines.map((pos) => (
        <div
          key={`h-${pos}`}
          className="absolute left-0 h-[1px] w-full bg-gray-100 dark:bg-gray-800/35"
          style={{
            top: `${pos}px`,
          }}
        />
      ))}

      {/* 氛围光晕 - 夜间模式 */}
      <div
        className="absolute left-0 right-0 m-auto hidden -translate-y-1/2 rounded-full opacity-20 dark:block"
        style={{
          top: GLOW_CONFIG.centerPosition,
          width: GLOW_CONFIG.mobileSize,
          height: GLOW_CONFIG.mobileSize,
          background: `radial-gradient(circle, ${GLOW_CONFIG.darkColor} 0%, transparent 70%)`,
        }}
      >
        {/* 桌面端更大尺寸 */}
        <style jsx>{`
          @media (min-width: 640px) {
            div {
              width: ${GLOW_CONFIG.desktopSize}px !important;
              height: ${GLOW_CONFIG.desktopSize}px !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default GridBackgroundMinimal
