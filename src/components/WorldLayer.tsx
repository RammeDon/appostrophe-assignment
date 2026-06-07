import type { ReactNode } from 'react'
import type { Viewport } from '../lib/types'

interface WorldLayerProps {
  viewport: Viewport
  children: ReactNode
}

export function WorldLayer({ viewport, children }: WorldLayerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '0 0',
        transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
      }}
    >
      {children}
    </div>
  )
}
