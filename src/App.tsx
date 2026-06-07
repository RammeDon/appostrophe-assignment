import { useReducer, useRef } from 'react'
import { CanvasViewport } from './components/CanvasViewport'
import { Slide } from './components/Slide'
import { WorldLayer } from './components/WorldLayer'
import { canvasReducer, initialState } from './state/canvasReducer'

function App() {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  const viewportRef = useRef<HTMLDivElement>(null)

  return (
    <CanvasViewport ref={viewportRef} state={state} dispatch={dispatch}>
      <WorldLayer viewport={state.viewport}>
        <Slide />
      </WorldLayer>
    </CanvasViewport>
  )
}

export default App
