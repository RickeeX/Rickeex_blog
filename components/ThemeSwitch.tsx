'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'

const Sun = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707A1 1 0 016.464 14.95zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const Moon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6" aria-hidden="true">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const Monitor = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="14" height="10" rx="2" />
    <path d="M7 17h6M10 13v4" />
  </svg>
)

export default function ThemeSwitch() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )
  const { theme = 'system', setTheme, resolvedTheme } = useTheme()

  return (
    <label className="relative mr-5 flex cursor-pointer items-center hover:text-primary-500 dark:hover:text-primary-400">
      <span className="sr-only">Theme</span>
      {mounted ? (
        theme === 'system' ? (
          <Monitor />
        ) : resolvedTheme === 'dark' ? (
          <Moon />
        ) : (
          <Sun />
        )
      ) : (
        <span className="h-6 w-6" />
      )}
      <select
        aria-label="Theme"
        value={mounted ? theme : 'system'}
        onChange={(event) => setTheme(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  )
}
