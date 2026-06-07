import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type DragEvent,
  type ReactNode,
} from 'react'
import { screenToWorld } from '../lib/coords'
import { loadItemFromFile } from '../lib/loadItemFromFile'
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
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return
      setIsDragging(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      const screen = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
      const world = screenToWorld(screen, state.viewport)

      const imageFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/'),
      )
      for (const file of imageFiles) {
        loadItemFromFile(file, { kind: 'worldCenter', point: world }, (item) =>
          dispatch({ type: 'ADD_ITEM', item }),
        )
      }
    }

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
        className={
          isDragging
            ? 'relative h-screen w-screen overflow-hidden bg-neutral-900 ring-2 ring-inset ring-neutral-500'
            : 'relative h-screen w-screen overflow-hidden bg-neutral-900'
        }
        onClick={() => dispatch({ type: 'DESELECT' })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {children}
      </div>
    )
  },
)
