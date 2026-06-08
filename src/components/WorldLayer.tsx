import type { Dispatch, RefObject } from 'react'
import type { CanvasItem, CanvasSlide, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { PhotoItem } from './PhotoItem'
import { Slide } from './Slide'

interface WorldLayerProps {
  viewport: Viewport
  viewportRef: RefObject<HTMLDivElement | null>
  slides: CanvasSlide[]
  items: CanvasItem[]
  dispatch: Dispatch<CanvasAction>
}

export function WorldLayer({
  viewport,
  viewportRef,
  slides,
  items,
  dispatch,
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
      {slides.map((slide) => (
        <Slide key={slide.id} x={slide.x} y={slide.y} />
      ))}
      {items.map((item) => (
        <PhotoItem
          key={item.id}
          item={item}
          allItems={items}
          slides={slides}
          viewport={viewport}
          viewportRef={viewportRef}
          dispatch={dispatch}
        />
      ))}
    </div>
  )
}
