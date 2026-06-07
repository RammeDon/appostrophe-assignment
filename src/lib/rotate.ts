import type { Point } from './types'

export function rotationForPointer(center: Point, pointer: Point): number {
  return (
    Math.atan2(pointer.y - center.y, pointer.x - center.x) + Math.PI / 2
  )
}
