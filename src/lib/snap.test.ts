import { describe, it, expect } from 'vitest'
import { snapValue } from './snap.ts'

describe('snapValue', () => {
  it('returns value unchanged when targets is empty', () => {
    expect(snapValue(50, [], 10)).toBe(50)
  })

  it('snaps to a target within threshold', () => {
    expect(snapValue(48, [50], 10)).toBe(50)
  })

  it('returns value unchanged when target is outside threshold', () => {
    expect(snapValue(30, [50], 10)).toBe(30)
  })

  it('snaps at exactly the threshold boundary (inclusive)', () => {
    expect(snapValue(40, [50], 10)).toBe(50)
  })

  it('does not snap just beyond the threshold', () => {
    expect(snapValue(39, [50], 10)).toBe(39)
  })

  it('snaps to the nearer of two targets when only one is within threshold', () => {
    expect(snapValue(48, [35, 50], 10)).toBe(50)
  })

  it('snaps to the nearest target when multiple are within threshold', () => {
    expect(snapValue(43, [40, 50], 10)).toBe(40)
  })

  it('returns target when value equals target exactly (threshold 0)', () => {
    expect(snapValue(50, [50], 0)).toBe(50)
  })
})
