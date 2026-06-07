import type { Dispatch } from 'react'
import type { CanvasItem } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'

interface PhotoItemProps {
  item: CanvasItem
  dispatch: Dispatch<CanvasAction>
}

export function PhotoItem({ item, dispatch }: PhotoItemProps) {
  const { x, y, width, height, rotation, src } = item

  return (
    <div
      className="cursor-pointer"
      onClick={(e) => {
        e.stopPropagation()
        dispatch({ type: 'SELECT', id: item.id })
      }}
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
