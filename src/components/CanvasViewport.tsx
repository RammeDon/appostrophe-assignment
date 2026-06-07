import { forwardRef, type Dispatch, type ReactNode } from 'react'
import type { CanvasAction, CanvasState } from '../state/canvasReducer'

interface CanvasViewportProps {
  state: CanvasState
  dispatch: Dispatch<CanvasAction>
  children: ReactNode
}

export const CanvasViewport = forwardRef<HTMLDivElement, CanvasViewportProps>(
  function CanvasViewport({ children }, ref) {
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
