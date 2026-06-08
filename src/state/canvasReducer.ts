import type { CanvasItem, CanvasSlide, Viewport } from '../lib/types'
import { createNextSlide } from '../lib/slides'
import { computeFitViewport } from '../lib/viewport'

// Footer chrome below canvas — used for pre-paint initial viewport estimate only
const TOOLBAR_ZONE_HEIGHT = 72

export interface CanvasState {
  slides: CanvasSlide[]
  items: CanvasItem[]
  selectedId: string | null
  viewport: Viewport
}

export type CanvasAction =
  | { type: 'ADD_ITEM'; item: CanvasItem }
  | { type: 'ADD_SLIDE' }
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
  | { type: 'SET_ITEM_SLIDE'; id: string; slideId: string }

const initialSlideId = crypto.randomUUID()
const initialSlide: CanvasSlide = { id: initialSlideId, x: 0, y: 0 }

function createInitialViewport(): Viewport {
  return computeFitViewport(
    window.innerWidth,
    window.innerHeight - TOOLBAR_ZONE_HEIGHT,
  )
}

export const initialState: CanvasState = {
  slides: [initialSlide],
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
    case 'ADD_SLIDE':
      return { ...state, slides: [...state.slides, createNextSlide(state.slides)] }
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
    case 'RESIZE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? {
                ...item,
                x: action.x,
                y: action.y,
                width: action.width,
                height: action.height,
              }
            : item,
        ),
      }
    case 'ROTATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, rotation: action.rotation }
            : item,
        ),
      }
    case 'SET_VIEWPORT':
      return { ...state, viewport: action.viewport }
    case 'SET_ITEM_SLIDE':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, slideId: action.slideId }
            : item,
        ),
      }
    default:
      return state
  }
}
