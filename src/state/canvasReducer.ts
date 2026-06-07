import type { CanvasItem, Viewport } from '../lib/types'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../components/Slide'

const INITIAL_SCALE = 0.6

export interface CanvasState {
  items: CanvasItem[]
  selectedId: string | null
  viewport: Viewport
}

export type CanvasAction =
  | { type: 'ADD_ITEM'; item: CanvasItem }
  | { type: 'SELECT'; id: string }
  | { type: 'DESELECT' }
  | { type: 'MOVE_ITEM'; id: string; dx: number; dy: number }
  | {
      type: 'RESIZE_ITEM'
      id: string
      x: number
      y: number
      width: number
      height: number
    }
  | { type: 'ROTATE_ITEM'; id: string; rotation: number }
  | { type: 'SET_VIEWPORT'; viewport: Viewport }

function createInitialViewport(): Viewport {
  const scale = INITIAL_SCALE
  return {
    scale,
    offsetX: window.innerWidth / 2 - (SLIDE_WIDTH * scale) / 2,
    offsetY: window.innerHeight / 2 - (SLIDE_HEIGHT * scale) / 2,
  }
}

export const initialState: CanvasState = {
  items: [],
  selectedId: null,
  viewport: createInitialViewport(),
}

export function canvasReducer(
  state: CanvasState,
  action: CanvasAction,
): CanvasState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item] }
    case 'SELECT':
      return { ...state, selectedId: action.id }
    case 'DESELECT':
      return { ...state, selectedId: null }
    case 'MOVE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, x: item.x + action.dx, y: item.y + action.dy }
            : item,
        ),
      }
    case 'SET_VIEWPORT':
      return { ...state, viewport: action.viewport }
    default:
      return state
  }
}
