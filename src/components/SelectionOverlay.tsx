import { worldToScreen } from '../lib/coords'
import type { CanvasItem, Viewport } from '../lib/types'

interface SelectionOverlayProps {
  item: CanvasItem
  viewport: Viewport
}

export function SelectionOverlay({ item, viewport }: SelectionOverlayProps) {
  const { x, y, width, height, rotation } = item
  const screenPos = worldToScreen({ x, y }, viewport)
  const scale = viewport.scale

  return (
    <div
      className="pointer-events-none absolute z-10 outline outline-2 outline-blue-500"
      style={{
        left: screenPos.x,
        top: screenPos.y,
        width: width * scale,
        height: height * scale,
        transformOrigin: 'center center',
        transform: `rotate(${rotation}rad)`,
      }}
    />
  )
}
