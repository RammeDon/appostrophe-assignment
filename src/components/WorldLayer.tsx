import type { ReactNode } from 'react'
import type { CanvasItem, Viewport } from '../lib/types'
import { PhotoItem } from './PhotoItem'

interface WorldLayerProps {
  viewport: Viewport
  items: CanvasItem[]
  children: ReactNode
}

export function WorldLayer({ viewport, items, children }: WorldLayerProps) {
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
      {items.map((item) => (
        <PhotoItem key={item.id} item={item} />
      ))}
    </div>
  )
}
