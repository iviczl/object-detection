import { useRef } from 'react'
import { ClassType, currentVideo, frame } from '../../state'

export function DetectionPlayer() {
  const detector = useRef<HTMLCanvasElement>(null)

  const draw = async () => {
    if (detector.current) {
      detector.current.width = currentVideo.value.width
      detector.current.height = currentVideo.value.height
      const context = detector.current.getContext('2d', {
        desynchronized: true,
      })
      if (!context) {
        return
      }
      const rects = await frame.value
      if (rects === null) {
        return
      }
      context.lineWidth = 1
      context.clearRect(0, 0, detector.current.width, detector.current.height)
      for (const rect of rects) {
        if (rect.class === ClassType.PERSON) {
          context.strokeStyle = 'orange'
        } else if (rect.class === ClassType.CAR) {
          context.strokeStyle = 'cyan'
        }
        context.strokeRect(rect.x, rect.y, rect.w, rect.h)
      }
    }
  }

  draw()

  return <canvas className='detector-screen' ref={detector}></canvas>
}
