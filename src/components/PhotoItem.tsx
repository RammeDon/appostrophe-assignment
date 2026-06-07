import type { CanvasItem } from '../lib/types'

interface PhotoItemProps {
  item: CanvasItem
}

export function PhotoItem({ item }: PhotoItemProps) {
  const { x, y, width, height, rotation, src } = item

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        transformOrigin: 'center center',
        transform: `rotate(${rotation}rad)`,
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'fill' }}
      />
    </div>
  )
}
