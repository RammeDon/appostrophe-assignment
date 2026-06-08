import { expect, test } from 'vitest'
import { resizeFromHandle } from './resize'
import type { CanvasItem } from './types'

const baseItem: CanvasItem = {
  id: 'test',
  src: '',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation: 0,
  slideId: 'slide-test',
}

test('unrotated br resize expands from top-left anchor', () => {
  expect(resizeFromHandle(baseItem, 'br', { x: 150, y: 150 })).toEqual({
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  })
})

test('unrotated tl resize expands from bottom-right anchor', () => {
  expect(resizeFromHandle(baseItem, 'tl', { x: -50, y: -50 })).toEqual({
    x: -50,
    y: -50,
    width: 150,
    height: 150,
  })
})

test('min-size clamp prevents collapse below 20px', () => {
  const result = resizeFromHandle(baseItem, 'br', { x: 5, y: 5 })
  expect(result.width).toBe(20)
  expect(result.height).toBe(20)
})

test('rotated π/2 br resize preserves aspect ratio via diagonal projection', () => {
  const rotated: CanvasItem = { ...baseItem, rotation: Math.PI / 2 }
  const result = resizeFromHandle(rotated, 'br', { x: 50, y: 100 })
  expect(result.x).toBeCloseTo(25)
  expect(result.y).toBeCloseTo(0)
  expect(result.width).toBeCloseTo(75)
  expect(result.height).toBeCloseTo(75)
})
