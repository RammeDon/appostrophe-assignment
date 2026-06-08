import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../components/Slide'
import type { CanvasItem, CanvasSlide, Point } from './types'

export type ItemPlacement =
  | { kind: 'slideCenter'; slide: CanvasSlide }
  | { kind: 'worldCenter'; point: Point; slide: CanvasSlide }

function sizedDimensions(naturalWidth: number, naturalHeight: number) {
  const maxWidth = SLIDE_WIDTH / 2
  let width = naturalWidth
  let height = naturalHeight
  if (width > maxWidth) {
    const ratio = maxWidth / width
    width = maxWidth
    height = height * ratio
  }
  return { width, height }
}

function positionForPlacement(
  placement: ItemPlacement,
  width: number,
  height: number,
): { x: number; y: number } {
  if (placement.kind === 'slideCenter') {
    return {
      x: placement.slide.x + (SLIDE_WIDTH - width) / 2,
      y: placement.slide.y + (SLIDE_HEIGHT - height) / 2,
    }
  }
  return {
    x: placement.point.x - width / 2,
    y: placement.point.y - height / 2,
  }
}

export function loadItemFromFile(
  file: File,
  placement: ItemPlacement,
  onReady: (item: CanvasItem) => void,
): void {
  if (!file.type.startsWith('image/')) return

  const src = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    const { width, height } = sizedDimensions(
      img.naturalWidth,
      img.naturalHeight,
    )
    const { x, y } = positionForPlacement(placement, width, height)
    onReady({
      id: crypto.randomUUID(),
      src,
      x,
      y,
      width,
      height,
      rotation: 0,
      slideId: placement.slide.id,
    })
  }
  img.src = src
}
