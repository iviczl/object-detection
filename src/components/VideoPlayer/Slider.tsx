import { ChangeEvent, useEffect, useState } from 'react'
import { Video } from '../../state'

type SliderProp = {
  video: Video
  onSlide: (time: number) => void
}
export function Slider({ video, onSlide }: SliderProp) {
  const [time, setTime] = useState(video.currentTime)
  const [isMouseDown, setIsMouseDown] = useState(false)

  useEffect(() => {
    if (isMouseDown) {
      return
    }
    setTime(video.currentTime), [video.currentTime]
  })

  return (
    <>
      <input
        className='video-slider'
        type='range'
        min='0'
        max={video.length}
        value={time}
        step='.1'
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTime(parseFloat(e.target.value))
        }}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => {
          setIsMouseDown(false)
          onSlide(time)
        }}
      />
      <label className='video-time'>{Math.round(time * 10) / 10}</label>
    </>
  )
}
