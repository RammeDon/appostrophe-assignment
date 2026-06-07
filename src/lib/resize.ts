import type { CanvasItem, Point } from './types'

export const SIGNS = {
  tl: { sx: -1, sy: -1 },
  tr: { sx: +1, sy: -1 },
  bl: { sx: -1, sy: +1 },
  br: { sx: +1, sy: +1 },
} as const

export type ResizeHandle = keyof typeof SIGNS

export function resizeFromHandle(
  item: CanvasItem,
  handle: ResizeHandle,
  pointerWorld: Point,
  minSize = 20,
): { x: number; y: number; width: number; height: number } {
  const t = item.rotation
  const c = Math.cos(t)
  const s = Math.sin(t)
  const ux = { x: c, y: s }
  const uy = { x: -s, y: c }
  const cx = item.x + item.width / 2
  const cy = item.y + item.height / 2
  const sign = SIGNS[handle]
  const aLx = (-sign.sx * item.width) / 2
  const aLy = (-sign.sy * item.height) / 2
  const anchor = {
    x: cx + aLx * ux.x + aLy * uy.x,
    y: cy + aLx * ux.y + aLy * uy.y,
  }
  const d = {
    x: pointerWorld.x - anchor.x,
    y: pointerWorld.y - anchor.y,
  }
  const diagX = ux.x * sign.sx * item.width + uy.x * sign.sy * item.height
  const diagY = ux.y * sign.sx * item.width + uy.y * sign.sy * item.height
  const diagSq = diagX * diagX + diagY * diagY
  const proj = d.x * diagX + d.y * diagY
  const scaleFactor = Math.max(minSize / Math.min(item.width, item.height), proj / diagSq)
  const width = item.width * scaleFactor
  const height = item.height * scaleFactor
  const corner = {
    x: anchor.x + ux.x * sign.sx * width + uy.x * sign.sy * height,
    y: anchor.y + ux.y * sign.sx * width + uy.y * sign.sy * height,
  }
  const ncx = (anchor.x + corner.x) / 2
  const ncy = (anchor.y + corner.y) / 2
  return {
    x: ncx - width / 2,
    y: ncy - height / 2,
    width,
    height,
  }
}
