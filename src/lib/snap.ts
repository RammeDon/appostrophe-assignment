
export function snapValue(value: number, targets: number[], threshold: number): number {
  let best = value
  let bestDist = threshold
  for (const t of targets) {
    const dist = Math.abs(value - t)
    if (dist <= bestDist) {
      bestDist = dist
      best = t
    }
  }
  return best
}
