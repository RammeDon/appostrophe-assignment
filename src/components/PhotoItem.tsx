import { useRef, type Dispatch, type RefObject } from 'react'
import type { CanvasItem, CanvasSlide, Point, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide'
import { snapValue } from '../lib/snap'
import { findSlideContainingPoint } from '../lib/slides'

const SNAP_PX = 8

function bestSnapCorrection(
  edge: number,
  size: number,
  targets: number[],
  threshold: number,
): number {
  const snapPoints = [edge, edge + size / 2, edge + size]
  const corrections: number[] = []
  for (const sp of snapPoints) {
    const snapped = snapValue(sp, targets, threshold)
    if (snapped !== sp) corrections.push(snapped - sp)
  }
  if (corrections.length === 0) return 0
  return corrections.reduce((best, c) => (Math.abs(c) < Math.abs(best) ? c : best))
}

interface PhotoItemProps {
  item: CanvasItem
  allItems: CanvasItem[]
  slides: CanvasSlide[]
  viewport: Viewport
  viewportRef: RefObject<HTMLDivElement | null>
  dispatch: Dispatch<CanvasAction>
}

function clientToScreen(
  e: React.PointerEvent,
  ref: RefObject<HTMLDivElement | null>,
): Point {
  const rect = ref.current!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

export function PhotoItem({
  item,
  allItems,
  slides,
  viewport,
  viewportRef,
  dispatch,
}: PhotoItemProps) {
  const { x, y, width, height, rotation, src } = item
  const draggingRef = useRef(false)
  const startScreenRef = useRef<Point | null>(null)
  const startItemPosRef = useRef<Point | null>(null)

  const owningSlide = slides.find((s) => s.id === item.slideId) ?? slides[0]

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    draggingRef.current = false
    startScreenRef.current = null
    startItemPosRef.current = null
  }

  // Clip rect for the owning slide
  const clipX = owningSlide?.x ?? 0
  const clipY = owningSlide?.y ?? 0

  return (
    <div
      className="cursor-grab active:cursor-grabbing"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation()
        dispatch({ type: 'SELECT', id: item.id })
        e.currentTarget.setPointerCapture(e.pointerId)
        startScreenRef.current = clientToScreen(e, viewportRef)
        startItemPosRef.current = { x: item.x, y: item.y }
        draggingRef.current = true
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current || !startScreenRef.current || !startItemPosRef.current) return

        const current = clientToScreen(e, viewportRef)
        const totalDelta = {
          x: current.x - startScreenRef.current.x,
          y: current.y - startScreenRef.current.y,
        }

        const rawX = startItemPosRef.current.x + totalDelta.x / viewport.scale
        const rawY = startItemPosRef.current.y + totalDelta.y / viewport.scale
        const threshold = SNAP_PX / viewport.scale

        const others = allItems.filter((o) => o.id !== item.id)

        // Snap targets from the owning slide
        const slide = owningSlide
        const slideLeft = slide?.x ?? 0
        const slideTop = slide?.y ?? 0
        const slideW = SLIDE_WIDTH
        const slideH = SLIDE_HEIGHT

        const xTargets = [
          slideLeft,
          slideLeft + slideW / 2,
          slideLeft + slideW,
          ...others.flatMap((o) => [o.x, o.x + o.width / 2, o.x + o.width]),
        ]
        const yTargets = [
          slideTop,
          slideTop + slideH / 2,
          slideTop + slideH,
          ...others.flatMap((o) => [o.y, o.y + o.height / 2, o.y + o.height]),
        ]

        const corrX = bestSnapCorrection(rawX, item.width, xTargets, threshold)
        const corrY = bestSnapCorrection(rawY, item.height, yTargets, threshold)

        const snappedX = rawX + corrX
        const snappedY = rawY + corrY

        const itemCenter = {
          x: snappedX + item.width / 2,
          y: snappedY + item.height / 2,
        }
        const targetSlide = findSlideContainingPoint(itemCenter, slides)
        if (targetSlide && targetSlide.id !== item.slideId) {
          dispatch({ type: 'SET_ITEM_SLIDE', id: item.id, slideId: targetSlide.id })
        }

        dispatch({
          type: 'MOVE_ITEM',
          id: item.id,
          dx: snappedX - item.x,
          dy: snappedY - item.y,
        })
      }}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: clipX - x,
          top: clipY - y,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: x - clipX,
            top: y - clipY,
            width,
            height,
            transformOrigin: 'center center',
            transform: `rotate(${rotation}rad)`,
            pointerEvents: 'none',
          }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}
