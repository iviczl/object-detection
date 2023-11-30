import { ChangeEvent, useRef } from 'react'
import { currentVideo } from '../../state'
import './VideoSelector.css'

const videos = [
  { name: 'Test 1', path: 'test_1' },
  { name: 'Test 2', path: 'test_2' },
]
const VIDEO_EXTENSION = '.mp4'

export function VideoSelector() {
  const selector = useRef<HTMLSelectElement>(null)
  const selectVideo = (value: string) => {
    if (selector.current) {
      selector.current.blur()
    }
    currentVideo.value = {
      ...currentVideo.value,
      name: value,
      filePath: value ? value + VIDEO_EXTENSION : '',
    }
  }

  return (
    <select
      className='video-select'
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        selectVideo(e.target.value)
      }
      ref={selector}
    >
      <option value=''>(Select an option)</option>
      {videos.map((video) => {
        return (
          <option key={video.path} value={video.path}>
            {video.name}
          </option>
        )
      })}
    </select>
  )
}
