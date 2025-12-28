import { ReactNode } from 'react'

interface BleedProps {
  full?: boolean
  children: ReactNode
}

export default function Bleed({ full = true, children }: BleedProps) {
  return (
    <div className={`relative ${full ? 'left-[50%] right-[50%] mx-[-50vw] w-[100vw]' : ''}`}>
      {children}
    </div>
  )
}
