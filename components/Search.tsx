'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import SearchButton from './SearchButton'

const SearchDialog = dynamic(() => import('./SearchDialog'), { ssr: false })

export default function Search({ searchPath }: { searchPath: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <>
      <SearchButton onOpen={() => setOpen(true)} />
      {open && <SearchDialog searchPath={searchPath} onClose={() => setOpen(false)} />}
    </>
  )
}
