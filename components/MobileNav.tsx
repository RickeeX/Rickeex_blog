'use client'

import { useState, useEffect } from 'react'
import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'

const MobileNav = () => {
  const [navShow, setNavShow] = useState(false)

  const onToggleNav = () => {
    setNavShow((status) => {
      if (status) {
        document.body.style.overflow = 'auto'
      } else {
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
      }
      return !status
    })
  }

  // 这里的 useEffect 确保在页面跳转后自动关闭菜单
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      {/* 汉堡按钮：Node.js 风格通常比较方正，这里保持简洁的 SVG */}
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="ml-1 mr-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-gray-900 dark:text-gray-100"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* 全屏覆盖层：实色背景，无透明度，左对齐列表 */}
      <div
        className={`fixed inset-0 z-50 transform bg-white transition-transform duration-300 ease-in-out dark:bg-gray-950 ${
          navShow ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 顶部栏：包含关闭按钮，位置与 Header 上的汉堡按钮对齐 */}
        <div className="flex justify-end px-4 py-6 sm:px-6">
          <button
            aria-label="Toggle Menu"
            onClick={onToggleNav}
            className="mr-0 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-gray-900 dark:text-gray-100"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* 菜单列表区域 */}
        <nav className="fixed mt-8 h-full w-full px-6">
          {headerNavLinks.map((link) => (
            <div
              key={link.title}
              className="w-full border-b border-gray-100 py-4 dark:border-gray-800"
            >
              <Link
                href={link.href}
                className="block text-xl font-medium tracking-wide text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
                onClick={onToggleNav}
              >
                {link.title}
              </Link>
            </div>
          ))}

          {/* 这里可以放额外的底部链接或社交图标，如果需要的话 */}
          <div className="mt-8 text-sm text-gray-400">
            {/* 示例：可以在这里放一个简单的文字Logo或版本号 */}
            Rickee's Corner
          </div>
        </nav>
      </div>
    </>
  )
}

export default MobileNav
