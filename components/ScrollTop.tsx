'use client'

import { useEffect, useState } from 'react'

export default function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleWindowScroll = () => {
      if (ticking) return

      window.requestAnimationFrame(() => {
        setShow(window.scrollY > 50)
        ticking = false
      })
      ticking = true
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  return (
    <div className={`fixed bottom-8 right-8 ${show ? 'hidden md:block' : 'hidden'}`}>
      <button
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}
