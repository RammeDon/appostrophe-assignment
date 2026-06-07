import { useRef, type ChangeEvent, type Dispatch } from 'react'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from './Slide'
import type { CanvasItem } from '../lib/types'
import type { CanvasAction } from '../state/canvasReducer'

interface ToolbarProps {
  dispatch: Dispatch<CanvasAction>
}

export function Toolbar({ dispatch }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !file.type.startsWith('image/')) return

    const src = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const maxWidth = SLIDE_WIDTH / 2
      let width = img.naturalWidth
      let height = img.naturalHeight
      if (width > maxWidth) {
        const ratio = maxWidth / width
        width = maxWidth
        height = height * ratio
      }

      const item: CanvasItem = {
        id: crypto.randomUUID(),
        src,
        x: (SLIDE_WIDTH - width) / 2,
        y: (SLIDE_HEIGHT - height) / 2,
        width,
        height,
        rotation: 0,
      }
      dispatch({ type: 'ADD_ITEM', item })
    }
    img.src = src
  }

  return (
    <div className="fixed left-4 top-4 z-10">
      <button
        type="button"
        className="rounded bg-neutral-700 px-3 py-1.5 text-sm text-white hover:bg-neutral-600"
        onClick={handleClick}
      >
        Add photo
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
