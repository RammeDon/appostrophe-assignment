import { useRef, type ChangeEvent, type Dispatch } from 'react'
import { loadItemFromFile } from '../lib/loadItemFromFile'
import type { CanvasAction, CanvasState } from '../state/canvasReducer'

interface ToolbarProps {
  state: CanvasState
  dispatch: Dispatch<CanvasAction>
}

export function Toolbar({ state, dispatch }: ToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    // Upload to the slide that owns the selected item, or the first slide
    const selectedItem = state.items.find((i) => i.id === state.selectedId)
    const targetSlide =
      (selectedItem
        ? state.slides.find((s) => s.id === selectedItem.slideId)
        : null) ?? state.slides[0]

    if (!targetSlide) return

    loadItemFromFile(
      file,
      { kind: 'slideCenter', slide: targetSlide },
      (item) => dispatch({ type: 'ADD_ITEM', item }),
    )
  }

  return (
    <div className="fixed left-4 top-4 z-10 flex gap-2">
      <button
        type="button"
        className="rounded bg-neutral-700 px-3 py-1.5 text-sm text-white hover:bg-neutral-600"
        onClick={handleClick}
      >
        Add photo
      </button>
      <button
        type="button"
        className="rounded bg-neutral-700 px-3 py-1.5 text-sm text-white hover:bg-neutral-600"
        onClick={() => dispatch({ type: 'ADD_SLIDE' })}
      >
        Add slide
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
