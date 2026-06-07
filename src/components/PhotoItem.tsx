import { useRef, type Dispatch, type RefObject } from 'react'
import type { CanvasItem, Point, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide'

interface PhotoItemProps {
  item: CanvasItem
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
  viewport,
  viewportRef,
  dispatch,
}: PhotoItemProps) {
  const { x, y, width, height, rotation, src } = item
  const draggingRef = useRef(false)
  const lastScreenRef = useRef<Point | null>(null)

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    draggingRef.current = false
    lastScreenRef.current = null
  }

  return (
    <div
      className="cursor-grab active:cursor-grabbing"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => {
        e.stopPropagation()
        dispatch({ type: 'SELECT', id: item.id })
        e.currentTarget.setPointerCapture(e.pointerId)
        lastScreenRef.current = clientToScreen(e, viewportRef)
        draggingRef.current = true
      }}
      onPointerMove={(e) => {
        if (!draggingRef.current || !lastScreenRef.current) return

        const current = clientToScreen(e, viewportRef)
        const screenDelta = {
          x: current.x - lastScreenRef.current.x,
          y: current.y - lastScreenRef.current.y,
        }

        if (screenDelta.x !== 0 || screenDelta.y !== 0) {
          dispatch({
            type: 'MOVE_ITEM',
            id: item.id,
            dx: screenDelta.x / viewport.scale,
            dy: screenDelta.y / viewport.scale,
          })
        }

        lastScreenRef.current = current
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
