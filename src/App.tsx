import { useLayoutEffect, useReducer, useRef } from 'react'
import { CanvasViewport } from './components/CanvasViewport'
import { SelectionOverlay } from './components/SelectionOverlay'
import { Toolbar } from './components/Toolbar'
import { WorldLayer } from './components/WorldLayer'
import { computeFitViewport } from './lib/viewport'
import { canvasReducer, initialState } from './state/canvasReducer'

function App() {
  const [state, dispatch] = useReducer(canvasReducer, initialState)
  const viewportRef = useRef<HTMLDivElement>(null)
  const selectedItem = state.items.find((item) => item.id === state.selectedId)

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const fit = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width === 0 || height === 0) return
      dispatch({
        type: 'SET_VIEWPORT',
        viewport: computeFitViewport(width, height),
      })
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [dispatch])

  return (
    <div className="flex h-screen flex-col bg-neutral-900">
      <CanvasViewport
        ref={viewportRef}
        state={state}
        dispatch={dispatch}
        className="min-h-0 flex-1"
      >
        <WorldLayer
          viewport={state.viewport}
          viewportRef={viewportRef}
          slides={state.slides}
          items={state.items}
          dispatch={dispatch}
        />
        {selectedItem && (
          <SelectionOverlay
            item={selectedItem}
            viewport={state.viewport}
            viewportRef={viewportRef}
            dispatch={dispatch}
          />
        )}
      </CanvasViewport>
      <footer className="flex shrink-0 justify-center px-4 pb-4 pt-2">
        <Toolbar state={state} dispatch={dispatch} />
      </footer>
    </div>
  )
}

export default App
