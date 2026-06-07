import type { Point, Viewport } from './types'

export function screenToWorld(p: Point, vp: Viewport): Point {
  return {
    x: (p.x - vp.offsetX) / vp.scale,
    y: (p.y - vp.offsetY) / vp.scale,
  }
}

export function worldToScreen(p: Point, vp: Viewport): Point {
  return {
    x: p.x * vp.scale + vp.offsetX,
    y: p.y * vp.scale + vp.offsetY,
  }
}
