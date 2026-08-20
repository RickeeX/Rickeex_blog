'use client'

import { useEffect, useRef, useState } from 'react'
import Link from './Link'
import headerNavLinks from '@/data/headerNavLinks'

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const closeMenu = () => setOpen(false)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(true)}
        className="ml-1 mr-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5 text-gray-900 dark:text-gray-100"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Mobile navigation"
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false)
          triggerRef.current?.focus()
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 text-gray-900 backdrop:bg-black/40 dark:bg-gray-950 dark:text-gray-100 sm:hidden"
      >
        <div className="flex justify-end px-4 py-6 sm:px-6">
          <button
            ref={closeRef}
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8 w-full px-6" aria-label="Primary navigation">
          {headerNavLinks.map((link) => (
            <div
              key={link.title}
              className="w-full border-b border-gray-100 py-4 dark:border-gray-800"
            >
              <Link
                href={link.href}
                className="block text-xl font-medium tracking-wide hover:text-primary-500 dark:hover:text-primary-400"
                onClick={closeMenu}
              >
                {link.title}
              </Link>
            </div>
          ))}
          <div className="mt-8 text-sm text-gray-400">Rickee's Corner</div>
        </nav>
      </dialog>
    </>
  )
}
