export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Viewport {
  scale: number
  offsetX: number
  offsetY: number
}

export interface CanvasItem {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}
