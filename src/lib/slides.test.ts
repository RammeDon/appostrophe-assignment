import { describe, it, expect } from 'vitest'
import { createNextSlide, findSlideContainingPoint } from './slides'
import type { CanvasSlide } from './types'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../components/Slide'

const SLIDE_GAP = 120

const slide1: CanvasSlide = { id: 's1', x: 0, y: 0 }
const slide2: CanvasSlide = { id: 's2', x: SLIDE_WIDTH + SLIDE_GAP, y: 0 }

describe('createNextSlide', () => {
  it('places first extra slide to the right of the last one with a gap', () => {
    const next = createNextSlide([slide1])
    expect(next.x).toBe(SLIDE_WIDTH + SLIDE_GAP)
    expect(next.y).toBe(0)
    expect(next.id).toBeTypeOf('string')
  })

  it('stacks a third slide to the right of the second', () => {
    const next = createNextSlide([slide1, slide2])
    expect(next.x).toBe(slide2.x + SLIDE_WIDTH + SLIDE_GAP)
    expect(next.y).toBe(0)
  })

  it('generates unique ids', () => {
    const a = createNextSlide([slide1])
    const b = createNextSlide([slide1])
    expect(a.id).not.toBe(b.id)
  })
})

describe('findSlideContainingPoint', () => {
  const slides = [slide1, slide2]

  it('returns slide1 for a point inside slide1', () => {
    const result = findSlideContainingPoint({ x: 100, y: 100 }, slides)
    expect(result?.id).toBe('s1')
  })

  it('returns slide2 for a point inside slide2', () => {
    const result = findSlideContainingPoint(
      { x: slide2.x + 100, y: 100 },
      slides,
    )
    expect(result?.id).toBe('s2')
  })

  it('returns null for a point between slides (in the gap)', () => {
    const result = findSlideContainingPoint(
      { x: SLIDE_WIDTH + SLIDE_GAP / 2, y: 100 },
      slides,
    )
    expect(result).toBeNull()
  })

  it('returns null for a point below all slides', () => {
    const result = findSlideContainingPoint({ x: 100, y: SLIDE_HEIGHT + 1 }, slides)
    expect(result).toBeNull()
  })

  it('returns null for an empty array', () => {
    const result = findSlideContainingPoint({ x: 0, y: 0 }, [])
    expect(result).toBeNull()
  })

  it('handles a point on the right edge of slide1', () => {
    
    const result = findSlideContainingPoint({ x: SLIDE_WIDTH, y: 100 }, slides)
    expect(result).toBeNull()
  })

  it('handles a point on the top-left corner of slide1 (inclusive)', () => {
    const result = findSlideContainingPoint({ x: 0, y: 0 }, slides)
    expect(result?.id).toBe('s1')
  })
})
