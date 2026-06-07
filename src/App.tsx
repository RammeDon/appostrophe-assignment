import { useReducer, useRef } from 'react'
import { CanvasViewport } from './components/CanvasViewport'
import { Slide } from './components/Slide'
import { Toolbar } from './components/Toolbar'
import { WorldLayer } from './components/WorldLayer'
import { canvasReducer, initialState } from './state/canvasReducer'

function App() {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Toolbar dispatch={dispatch} />
      <CanvasViewport ref={viewportRef} state={state} dispatch={dispatch}>
        <WorldLayer viewport={state.viewport} items={state.items}>
          <Slide />
        </WorldLayer>
      </CanvasViewport>
    </>
  )
}

export default App
