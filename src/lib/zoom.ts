import type { Point, Viewport } from './types'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function zoomAtPoint(
  vp: Viewport,
  cursor: Point,
  factor: number,
  min = 0.2,
  max = 8,
): Viewport {
  const scale = clamp(vp.scale * factor, min, max)
  const wx = (cursor.x - vp.offsetX) / vp.scale
  const wy = (cursor.y - vp.offsetY) / vp.scale
  return {
    scale,
    offsetX: cursor.x - wx * scale,
    offsetY: cursor.y - wy * scale,
  }
}
