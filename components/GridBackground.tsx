'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

const GRID_SPACING = 24 // 网格间距 (px)
const CONTENT_WIDTH = 1000 // 核心内容区宽度 (px)，用于判断文字区域

// --- 概率配置区 (在这里微调下雨概率) ---
const PROB_MOBILE = 0.0 // 手机/平板 (< 768px) 的下雨概率 (0% - 不下雨)
const PROB_CENTER = 0.02 // 文字核心区 (|x| < 0.3) 的概率 (2% - 极少)
const PROB_MEDIUM = 0.08 // 文字稍外侧 (0.3 < |x| < 0.6) 的概率 (15% - 适中)
const PROB_OUTER = 0.18 // 屏幕最外侧 (|x| > 0.6) 的概率 (40% - 大雨)

const GridBackground = () => {
  const [mounted, setMounted] = useState(false)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setMounted(true)
    // 初始化视口
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

  // 决定某根竖线是否要有“雨滴”
  const getRainDropConfig = useCallback(
    (xPosition: number) => {
      if (viewport.width === 0) return null

      const isMobile = viewport.width < 768
      if (isMobile && Math.random() > PROB_MOBILE) return null

      const centerX = viewport.width / 2
      // 计算该线距离中心的归一化距离 (0 = 中心, 1 = 边缘)
      const distanceRatio = Math.abs(xPosition - centerX) / (viewport.width / 2)

      let probability = PROB_CENTER

      if (distanceRatio > 0.6) {
        probability = PROB_OUTER
      } else if (distanceRatio > 0.3) {
        probability = PROB_MEDIUM
      }

      // 随机决定是否生成，并返回随机延迟
      if (Math.random() < probability) {
        return {
          delay: Math.random() * 5, // 0-5s 随机延迟
          duration: 3 + Math.random() * 4, // 3-7s 随机下落时长
        }
      }
      return null
    },
    [viewport.width]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] select-none overflow-hidden bg-white transition-colors duration-500 dark:bg-gray-950">
      {/* 
          网格容器 
          mask-image: 使用遮罩让网格边缘淡出，显得更自然 (可选，目前暂不加，保持清晰)
      */}

      {/* 竖线 */}
      {verticalLines.map((pos, index) => {
        const rainConfig = getRainDropConfig(pos)
        return (
          <div
            key={`v-${pos}`}
            className="absolute top-0 w-[1px] bg-gray-100 dark:bg-gray-800/35"
            style={{
              left: `${pos}px`,
              height: '0%',
              animationName: mounted ? 'line-grow' : 'none',
              animationDuration: '1.5s',
              animationTimingFunction: 'ease-out',
              animationFillMode: 'forwards',
              animationDelay: `${index * 0.02}s`, // 稍微快一点的展开
            }}
          >
            {/* 雨滴 (如果被选中) */}
            {mounted && rainConfig && (
              <div
                className="absolute -left-[1px] top-[-20%] h-32 w-[3px] bg-gradient-to-b from-transparent via-indigo-400/40 to-transparent dark:via-fuchsia-500/50"
                style={{
                  animationName: 'beam-scan',
                  animationDuration: `${rainConfig.duration}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: `${rainConfig.delay}s`,
                }}
              />
            )}
          </div>
        )
      })}

      {/* 横线 */}
      {horizontalLines.map((pos, index) => (
        <div
          key={`h-${pos}`}
          className="absolute left-0 h-[1px] w-full bg-gray-100 dark:bg-gray-800/35"
          style={{
            top: `${pos}px`,
            width: '0%',
            animationName: mounted ? 'grid-line-horizontal' : 'none', // 使用原有的 horizontal 动画
            animationDuration: '1.5s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
            animationDelay: `${0.5 + index * 0.02}s`,
          }}
        />
      ))}

      {/* 氛围光晕 (保留之前的 Radial Gradient 优化) */}
      <div
        className="absolute left-0 right-0 top-[10%] m-auto h-[600px] w-[600px] rounded-full opacity-20 dark:opacity-20 sm:w-[600px]"
        style={{
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, transparent 70%)',
        }}
      >
        <div
          className="hidden h-full w-full dark:block"
          style={{
            background: 'radial-gradient(circle, rgba(192, 38, 211, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>
    </div>
  )
}

export default GridBackground
