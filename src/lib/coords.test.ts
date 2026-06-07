import { expect, test } from 'vitest'
import { screenToWorld, worldToScreen } from './coords'
import type { Point, Viewport } from './types'

const vp: Viewport = { scale: 2, offsetX: 50, offsetY: 30 }

test('screenToWorld converts screen to world with pan and zoom', () => {
  expect(screenToWorld({ x: 150, y: 70 }, vp)).toEqual({ x: 50, y: 20 })
})

test('worldToScreen converts world to screen with pan and zoom', () => {
  expect(worldToScreen({ x: 50, y: 20 }, vp)).toEqual({ x: 150, y: 70 })
})

test('round-trip screen → world → screen preserves screen point', () => {
  const screen: Point = { x: 123.5, y: 456.7 }
  const roundTripped = worldToScreen(screenToWorld(screen, vp), vp)
  expect(roundTripped.x).toBeCloseTo(screen.x)
  expect(roundTripped.y).toBeCloseTo(screen.y)
})

test('round-trip world → screen → world preserves world point', () => {
  const world: Point = { x: 100, y: 200 }
  const roundTripped = screenToWorld(worldToScreen(world, vp), vp)
  expect(roundTripped.x).toBeCloseTo(world.x)
  expect(roundTripped.y).toBeCloseTo(world.y)
})
