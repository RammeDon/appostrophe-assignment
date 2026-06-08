import { expect, test } from 'vitest'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../components/Slide'
import { computeFitViewport } from './viewport'

test('reference canvas size reproduces scale 0.6 and centres slide', () => {
  const vp = computeFitViewport(1920, 1008)

  expect(vp.scale).toBeCloseTo(0.6)
  expect(vp.offsetX).toBeCloseTo(1920 / 2 - (SLIDE_WIDTH * 0.6) / 2)
  expect(vp.offsetY).toBeCloseTo(1008 / 2 - (SLIDE_HEIGHT * 0.6) / 2)
})

test('wide monitor scales up with same width fraction', () => {
  const canvasWidth = 2560
  const canvasHeight = 1368
  const vp = computeFitViewport(canvasWidth, canvasHeight)

  const slideScreenWidth = SLIDE_WIDTH * vp.scale
  expect(slideScreenWidth / canvasWidth).toBeCloseTo(0.28125)
})

test('short canvas is height-limited with same height fraction', () => {
  const canvasWidth = 1920
  const canvasHeight = 500
  const vp = computeFitViewport(canvasWidth, canvasHeight)

  const slideScreenHeight = SLIDE_HEIGHT * vp.scale
  expect(slideScreenHeight / canvasHeight).toBeCloseTo(0.714286, 2)
})

test('wide short canvas is height-limited', () => {
  const canvasWidth = 1600
  const canvasHeight = 400
  const vp = computeFitViewport(canvasWidth, canvasHeight)

  const scaleFromHeight =
    (canvasHeight * ((SLIDE_HEIGHT * 0.6) / 1008)) / SLIDE_HEIGHT
  expect(vp.scale).toBeCloseTo(scaleFromHeight)
  expect(vp.offsetX).toBeCloseTo(
    canvasWidth / 2 - (SLIDE_WIDTH * vp.scale) / 2,
  )
})
