import { useRef, type Dispatch, type RefObject } from 'react'
import { screenToWorld, worldToScreen } from '../lib/coords'
import {
  resizeFromHandle,
  SIGNS,
  type ResizeHandle,
} from '../lib/resize'
import { rotationForPointer } from '../lib/rotate'
import type { CanvasItem, Point, Viewport } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'

interface SelectionOverlayProps {
  item: CanvasItem
  viewport: Viewport
  viewportRef: RefObject<HTMLDivElement | null>
  dispatch: Dispatch<CanvasAction>
}

const HANDLES = Object.keys(SIGNS) as ResizeHandle[]
const ROTATE_HANDLE_GAP_PX = 20

type DragMode =
  | { type: 'resize'; handle: ResizeHandle }
  | { type: 'rotate' }
  | null

function clientToScreen(
  e: React.PointerEvent,
  ref: RefObject<HTMLDivElement | null>,
): Point {
  const rect = ref.current!.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function getCornerWorld(item: CanvasItem, handle: ResizeHandle): Point {
  const t = item.rotation
  const c = Math.cos(t)
  const s = Math.sin(t)
  const ux = { x: c, y: s }
  const uy = { x: -s, y: c }
  const cx = item.x + item.width / 2
  const cy = item.y + item.height / 2
  const sign = SIGNS[handle]
  const localX = (sign.sx * item.width) / 2
  const localY = (sign.sy * item.height) / 2
  return {
    x: cx + localX * ux.x + localY * uy.x,
    y: cy + localX * ux.y + localY * uy.y,
  }
}

function getRotateHandleWorld(item: CanvasItem, scale: number): Point {
  const t = item.rotation
  const uy = { x: -Math.sin(t), y: Math.cos(t) }
  const cx = item.x + item.width / 2
  const cy = item.y + item.height / 2
  const gapWorld = ROTATE_HANDLE_GAP_PX / scale
  return {
    x: cx + uy.x * (-item.height / 2 - gapWorld),
    y: cy + uy.y * (-item.height / 2 - gapWorld),
  }
}

export function SelectionOverlay({
  item,
  viewport,
  viewportRef,
  dispatch,
}: SelectionOverlayProps) {
  const { x, y, width, height, rotation } = item
  const screenPos = worldToScreen({ x, y }, viewport)
  const scale = viewport.scale

  const dragModeRef = useRef<DragMode>(null)

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    dragModeRef.current = null
  }

  const onResizeHandlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: ResizeHandle,
  ) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragModeRef.current = { type: 'resize', handle }
  }

  const onRotateHandlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
  ) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    dragModeRef.current = { type: 'rotate' }
  }

  const onHandlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dragMode = dragModeRef.current
    if (!dragMode) return

    const screen = clientToScreen(e, viewportRef)
    const pointerWorld = screenToWorld(screen, viewport)

    if (dragMode.type === 'resize') {
      const result = resizeFromHandle(item, dragMode.handle, pointerWorld)
      dispatch({
        type: 'RESIZE_ITEM',
        id: item.id,
        ...result,
      })
    } else {
      const center = {
        x: item.x + item.width / 2,
        y: item.y + item.height / 2,
      }
      dispatch({
        type: 'ROTATE_ITEM',
        id: item.id,
        rotation: rotationForPointer(center, pointerWorld),
      })
    }
  }

  const rotateHandleScreen = worldToScreen(
    getRotateHandleWorld(item, scale),
    viewport,
  )

  return (
    <div className="absolute inset-0 z-10">
      <div
        className="pointer-events-none absolute outline outline-2 outline-blue-500"
        style={{
          left: screenPos.x,
          top: screenPos.y,
          width: width * scale,
          height: height * scale,
          transformOrigin: 'center center',
          transform: `rotate(${rotation}rad)`,
        }}
      />
      {HANDLES.map((handle) => {
        const cornerScreen = worldToScreen(getCornerWorld(item, handle), viewport)
        return (
          <div
            key={handle}
            className="absolute h-3 w-3 border-2 border-blue-500 bg-white"
            style={{
              left: cornerScreen.x,
              top: cornerScreen.y,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => onResizeHandlePointerDown(e, handle)}
            onPointerMove={onHandlePointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        )
      })}
      <div
        className="absolute h-3 w-3 rounded-full border-2 border-blue-500 bg-white"
        style={{
          left: rotateHandleScreen.x,
          top: rotateHandleScreen.y,
          transform: 'translate(-50%, -50%)',
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={onRotateHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
    </div>
  )
}
