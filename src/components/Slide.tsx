export const SLIDE_WIDTH = 900
export const SLIDE_HEIGHT = 1200

interface SlideProps {
  x: number
  y: number
}

export function Slide({ x, y }: SlideProps) {
  return (
    <div
      className="bg-white shadow-lg"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
      }}
    />
  )
}
