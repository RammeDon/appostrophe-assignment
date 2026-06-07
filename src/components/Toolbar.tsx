import { useRef, type ChangeEvent, type Dispatch } from 'react'
import { loadItemFromFile } from '../lib/loadItemFromFile'
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
    if (!file) return

    loadItemFromFile(file, { kind: 'slideCenter' }, (item) =>
      dispatch({ type: 'ADD_ITEM', item }),
    )
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
