import { expect, test } from 'vitest'
import { rotationForPointer } from './rotate'
import type { Point } from './types'

const center: Point = { x: 0, y: 0 }

function normalizeAngle(a: number): number {
  let angle = a
  while (angle > Math.PI) angle -= 2 * Math.PI
  while (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

test('pointer above centre yields rotation 0', () => {
  expect(normalizeAngle(rotationForPointer(center, { x: 0, y: -100 }))).toBe(0)
})

test('pointer right of centre yields rotation π/2', () => {
  expect(
    normalizeAngle(rotationForPointer(center, { x: 100, y: 0 })),
  ).toBeCloseTo(Math.PI / 2)
})

test('pointer below centre yields rotation π', () => {
  expect(
    normalizeAngle(rotationForPointer(center, { x: 0, y: 100 })),
  ).toBeCloseTo(Math.PI)
})

test('pointer left of centre yields rotation -π/2', () => {
  expect(
    normalizeAngle(rotationForPointer(center, { x: -100, y: 0 })),
  ).toBeCloseTo(-Math.PI / 2)
})

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % (2 * Math.PI)
  return diff > Math.PI ? 2 * Math.PI - diff : diff
}

test('angles are continuous across the ±π boundary', () => {
  const epsilon = 0.001
  const left = rotationForPointer(center, { x: -epsilon, y: 100 })
  const right = rotationForPointer(center, { x: epsilon, y: 100 })
  expect(angularDistance(left, right)).toBeLessThan(epsilon * 2)
})
