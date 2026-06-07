import {
  forwardRef,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { CanvasAction, CanvasState } from '../state/canvasReducer'

interface CanvasViewportProps {
  state: CanvasState
  dispatch: Dispatch<CanvasAction>
  children: ReactNode
}

export const CanvasViewport = forwardRef<HTMLDivElement, CanvasViewportProps>(
  function CanvasViewport({ state, dispatch, children }, ref) {
    const viewportRef = useRef(state.viewport)
    viewportRef.current = state.viewport

    useEffect(() => {
      if (!ref || typeof ref === 'function') return
      const el = ref.current
      if (!el) return

      const handler = (e: WheelEvent) => {
        e.preventDefault()
        if (e.ctrlKey) return // zoom in phase 08

        const vp = viewportRef.current
        dispatch({
          type: 'SET_VIEWPORT',
          viewport: {
            ...vp,
            offsetX: vp.offsetX - e.deltaX,
            offsetY: vp.offsetY - e.deltaY,
          },
        })
      }

      el.addEventListener('wheel', handler, { passive: false })
      return () => el.removeEventListener('wheel', handler)
    }, [dispatch, ref])

    return (
      <div
        ref={ref}
        className="relative h-screen w-screen overflow-hidden bg-neutral-900"
      >
        {children}
      </div>
    )
  },
)
