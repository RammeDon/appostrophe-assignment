import { expect, test } from 'vitest'
import { screenToWorld, worldToScreen } from './coords'
import type { Point, Viewport } from './types'
import { zoomAtPoint } from './zoom'

test('zoomAtPoint doubles scale and adjusts offset for centred cursor', () => {
  expect(
    zoomAtPoint({ scale: 1, offsetX: 0, offsetY: 0 }, { x: 100, y: 100 }, 2),
  ).toEqual({ scale: 2, offsetX: -100, offsetY: -100 })
})

test('zoomAtPoint keeps world point under cursor fixed at identity viewport', () => {
  const vp: Viewport = { scale: 1, offsetX: 0, offsetY: 0 }
  const cursor: Point = { x: 200, y: 150 }
  const worldUnderCursor = screenToWorld(cursor, vp)
  const newVp = zoomAtPoint(vp, cursor, 1.5)

  const screenAfter = worldToScreen(worldUnderCursor, newVp)
  expect(screenAfter.x).toBeCloseTo(cursor.x)
  expect(screenAfter.y).toBeCloseTo(cursor.y)
})

test('zoomAtPoint keeps world point under cursor fixed at non-identity viewport', () => {
  const vp: Viewport = { scale: 2, offsetX: 50, offsetY: 30 }
  const cursor: Point = { x: 150, y: 70 }
  const worldUnderCursor = screenToWorld(cursor, vp)
  const newVp = zoomAtPoint(vp, cursor, 0.75)

  const screenAfter = worldToScreen(worldUnderCursor, newVp)
  expect(screenAfter.x).toBeCloseTo(cursor.x)
  expect(screenAfter.y).toBeCloseTo(cursor.y)
})

test('zoomAtPoint clamps scale at minimum', () => {
  const vp: Viewport = { scale: 0.2, offsetX: 10, offsetY: 20 }
  const cursor: Point = { x: 100, y: 100 }
  const result = zoomAtPoint(vp, cursor, 0.1)

  expect(result.scale).toBe(0.2)
  expect(Number.isFinite(result.offsetX)).toBe(true)
  expect(Number.isFinite(result.offsetY)).toBe(true)
})

test('zoomAtPoint clamps scale at maximum', () => {
  const vp: Viewport = { scale: 8, offsetX: -50, offsetY: -30 }
  const cursor: Point = { x: 300, y: 400 }
  const result = zoomAtPoint(vp, cursor, 2)

  expect(result.scale).toBe(8)
  expect(Number.isFinite(result.offsetX)).toBe(true)
  expect(Number.isFinite(result.offsetY)).toBe(true)
})

test('zoomAtPoint handles extreme factor without NaN and preserves anchor at clamp', () => {
  const vp: Viewport = { scale: 7, offsetX: 0, offsetY: 0 }
  const cursor: Point = { x: 100, y: 100 }
  const worldUnderCursor = screenToWorld(cursor, vp)
  const result = zoomAtPoint(vp, cursor, 100)

  expect(result.scale).toBe(8)
  expect(Number.isFinite(result.offsetX)).toBe(true)
  expect(Number.isFinite(result.offsetY)).toBe(true)

  const screenAfter = worldToScreen(worldUnderCursor, result)
  expect(screenAfter.x).toBeCloseTo(cursor.x)
  expect(screenAfter.y).toBeCloseTo(cursor.y)
})
