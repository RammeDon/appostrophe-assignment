import { useRef, type Dispatch, type RefObject } from 'react'
import type { CanvasItem, Point, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide'
import { snapValue } from '../lib/snap'

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
  viewport,
  viewportRef,
  dispatch,
}: PhotoItemProps) {
  const { x, y, width, height, rotation, src } = item
  const draggingRef = useRef(false)
  const startScreenRef = useRef<Point | null>(null)
  const startItemPosRef = useRef<Point | null>(null)

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    draggingRef.current = false
    startScreenRef.current = null
    startItemPosRef.current = null
  }

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

        // Raw candidate: where the item's top-left would be based on cumulative drag from start
        const rawX = startItemPosRef.current.x + totalDelta.x / viewport.scale
        const rawY = startItemPosRef.current.y + totalDelta.y / viewport.scale
        const threshold = SNAP_PX / viewport.scale

        const others = allItems.filter((o) => o.id !== item.id)
        const xTargets = [
          0,
          SLIDE_WIDTH / 2,
          SLIDE_WIDTH,
          ...others.flatMap((o) => [o.x, o.x + o.width / 2, o.x + o.width]),
        ]
        const yTargets = [
          0,
          SLIDE_HEIGHT / 2,
          SLIDE_HEIGHT,
          ...others.flatMap((o) => [o.y, o.y + o.height / 2, o.y + o.height]),
        ]

        const corrX = bestSnapCorrection(rawX, item.width, xTargets, threshold)
        const corrY = bestSnapCorrection(rawY, item.height, yTargets, threshold)

        const snappedX = rawX + corrX
        const snappedY = rawY + corrY

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
          left: -x,
          top: -y,
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
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
