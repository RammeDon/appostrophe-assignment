import { useReducer, useRef } from 'react'
import { CanvasViewport } from './components/CanvasViewport'
import { SelectionOverlay } from './components/SelectionOverlay'
import { Slide } from './components/Slide'
import { Toolbar } from './components/Toolbar'
import { WorldLayer } from './components/WorldLayer'
import { canvasReducer, initialState } from './state/canvasReducer'

function App() {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  const viewportRef = useRef<HTMLDivElement>(null)
  const selectedItem = state.items.find((item) => item.id === state.selectedId)

  return (
    <>
      <Toolbar dispatch={dispatch} />
      <CanvasViewport ref={viewportRef} state={state} dispatch={dispatch}>
        <WorldLayer
          viewport={state.viewport}
          viewportRef={viewportRef}
          items={state.items}
          dispatch={dispatch}
        >
          <Slide />
        </WorldLayer>
        {selectedItem && (
          <SelectionOverlay item={selectedItem} viewport={state.viewport} />
        )}
      </CanvasViewport>
    </>
  )
}

export default App
