import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../components/Slide'
import type { Viewport } from './types'

const REF_SLIDE_WIDTH_FRACTION = (SLIDE_WIDTH * 0.6) / 1920
const REF_SLIDE_HEIGHT_FRACTION = (SLIDE_HEIGHT * 0.6) / 1008

const MIN_SCALE = 0.2
const MAX_SCALE = 8

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function computeFitViewport(
  canvasWidth: number,
  canvasHeight: number,
): Viewport {
  const scaleX =
    (canvasWidth * REF_SLIDE_WIDTH_FRACTION) / SLIDE_WIDTH
  const scaleY =
    (canvasHeight * REF_SLIDE_HEIGHT_FRACTION) / SLIDE_HEIGHT
  const scale = clamp(Math.min(scaleX, scaleY), MIN_SCALE, MAX_SCALE)

  return {
    scale,
    offsetX: canvasWidth / 2 - (SLIDE_WIDTH * scale) / 2,
    offsetY: canvasHeight / 2 - (SLIDE_HEIGHT * scale) / 2,
  }
}
