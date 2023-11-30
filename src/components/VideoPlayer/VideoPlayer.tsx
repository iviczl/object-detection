import { ChangeEvent, useEffect, useRef } from 'react'
import { computed } from '@preact/signals-react'
import { PlayingState, currentVideo } from '../../state'
import './VideoPlayer.css'

type Props = {
  children?: JSX.Element
}

export function VideoPlayer({ children }: Props) {
  const player = useRef<HTMLVideoElement>(null)
  const slider = useRef(null)
  const filePath = computed(() => currentVideo.value.filePath)
  const currentTime = computed(() => currentVideo.value.currentTime)
  const height = computed(() => currentVideo.value.height)
  const length = computed(() => currentVideo.value.length)

  // handles all the needed video element events
  function eventHandler(event: { type: string }) {
    if (player.current) {
      const newValue = { ...currentVideo.value }
      switch (event.type) {
        case 'timeupdate':
          newValue.currentTime = player.current.currentTime
          newValue.length = Number.isNaN(player.current.duration)
            ? 0
            : player.current.duration
          break
        case 'loadedmetadata':
          newValue.videoWidth = player.current.videoWidth
          newValue.videoHeight = player.current.videoHeight
          newValue.length = Number.isNaN(player.current.duration)
            ? 0
            : player.current.duration
          break
        case 'loadeddata':
          newValue.currentTime = player.current.currentTime
          newValue.length = Number.isNaN(player.current.duration)
            ? 0
            : player.current.duration
          newValue.playingState = PlayingState.Paused
          newValue.width = player.current.clientWidth
          newValue.height = player.current.clientHeight
          break
        case 'pause':
          newValue.playingState = PlayingState.Paused
          break
        case 'play':
          newValue.playingState = PlayingState.Playing
          break
        case 'seeking':
          newValue.playingState = PlayingState.Seeking
          break
        case 'seeked':
          newValue.playingState = PlayingState.Paused
          break
        case 'resize':
          newValue.width = player.current.clientWidth
          newValue.height = player.current.clientHeight
          break
      }
      currentVideo.value = newValue
    }
  }

  useEffect(() => {
    window.addEventListener('resize', setPlayerSize)
    return () => {
      window.removeEventListener('resize', setPlayerSize)
    }
  }, [])

  function setPlayerSize() {
    eventHandler({ type: 'resize' })
  }

  const playAction = () => {
    if (player.current?.paused) {
      player.current.play()
      return
    }
    player.current?.pause()
  }

  const seek = (value: string) => {
    if (!player.current) {
      return
    }
    const numericValue = parseFloat(value)
    player.current.currentTime = numericValue
    currentVideo.value = {
      ...currentVideo.value,
      currentTime: numericValue,
    }
  }

  return (
    <>
      <div className='screen-area' onClick={playAction}>
        <video
          className='video-screen'
          height={height.value}
          ref={player}
          src={filePath.value}
          onTimeUpdate={eventHandler}
          onLoadedMetadata={eventHandler}
          onLoadedData={eventHandler}
          onPause={eventHandler}
          onPlay={eventHandler}
          onSeeking={eventHandler}
          onSeeked={eventHandler}
          onResize={eventHandler}
        ></video>
        {children}
      </div>
      <div className='video-control'>
        <button
          className={
            'play-button' +
            (currentVideo.value.playingState === PlayingState.Playing
              ? ' playing'
              : '')
          }
          onClick={playAction}
          disabled={
            ![PlayingState.Paused, PlayingState.Playing].includes(
              currentVideo.value.playingState
            )
          }
        >
          {/* {currentVideo.value.playingState === PlayingState.Playing
            ? 'Pause'
            : 'Play'} */}
        </button>
        <input
          className='video-slider'
          type='range'
          ref={slider}
          min='0'
          max={length.value}
          value={currentTime.value}
          step='.1'
          onChange={(e: ChangeEvent<HTMLInputElement>) => seek(e.target.value)}
        />
        <label className='video-time'>
          {Math.round(currentTime.value * 10) / 10}
        </label>
      </div>
    </>
  )
}
