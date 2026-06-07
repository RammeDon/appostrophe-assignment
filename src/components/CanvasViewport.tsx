import {
  forwardRef,
  useEffect,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'
import { zoomAtPoint } from '../lib/zoom'
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

        const vp = viewportRef.current

        if (e.ctrlKey) {
          const rect = el.getBoundingClientRect()
          const cursor = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          }
          const factor = Math.pow(1.0015, -e.deltaY)
          dispatch({
            type: 'SET_VIEWPORT',
            viewport: zoomAtPoint(vp, cursor, factor),
          })
          return
        }

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
