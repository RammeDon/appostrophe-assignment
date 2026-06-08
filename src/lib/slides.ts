import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../components/Slide'
import type { CanvasSlide, Point } from './types'

export const SLIDE_GAP = 120

export function createNextSlide(slides: CanvasSlide[]): CanvasSlide {
  const last = slides[slides.length - 1]
  const x = last ? last.x + SLIDE_WIDTH + SLIDE_GAP : 0
  return { id: crypto.randomUUID(), x, y: 0 }
}

export function findSlideContainingPoint(
  point: Point,
  slides: CanvasSlide[],
): CanvasSlide | null {
  for (const slide of slides) {
    if (
      point.x >= slide.x &&
      point.x < slide.x + SLIDE_WIDTH &&
      point.y >= slide.y &&
      point.y < slide.y + SLIDE_HEIGHT
    ) {
      return slide
    }
  }
  return null
}
