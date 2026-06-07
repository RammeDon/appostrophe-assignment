export const SLIDE_WIDTH = 900
export const SLIDE_HEIGHT = 1200

export function Slide() {
  return (
    <div
      className="bg-white shadow-lg"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
      }}
    />
  )
}
