import type { Dispatch, ReactNode, RefObject } from 'react'
import type { CanvasItem, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { PhotoItem } from './PhotoItem'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide'

interface WorldLayerProps {
  viewport: Viewport
  viewportRef: RefObject<HTMLDivElement | null>
  items: CanvasItem[]
  dispatch: Dispatch<CanvasAction>
  children: ReactNode
}

export function WorldLayer({
  viewport,
  viewportRef,
  items,
  dispatch,
  children,
}: WorldLayerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        transformOrigin: '0 0',
        transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
      {items.map((item) => (
        <PhotoItem
          key={item.id}
          item={item}
          viewport={viewport}
          viewportRef={viewportRef}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}
