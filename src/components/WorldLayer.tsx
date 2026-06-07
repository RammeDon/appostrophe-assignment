import type { Dispatch, ReactNode } from 'react'
import type { CanvasItem, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { PhotoItem } from './PhotoItem'

interface WorldLayerProps {
  viewport: Viewport
  items: CanvasItem[]
  dispatch: Dispatch<CanvasAction>
  children: ReactNode
}

export function WorldLayer({ viewport, items, dispatch, children }: WorldLayerProps) {
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
        <PhotoItem key={item.id} item={item} dispatch={dispatch} />
      ))}
    </div>
  )
}
