import { ReadonlySignal, computed, signal } from '@preact/signals-react'
import reader from './modules/fileReader'
import { timeFromFrameKey, transformedRects } from './modules/detectionHelper'

const DETECTION_EXTENSION = '.json'

export enum PlayingState {
  None,
  Loading,
  Playing,
  Paused,
  Seeking,
}

export type Video = {
  name: string
  filePath: string
  playingState: PlayingState
  currentTime: number
  height: number
  width: number
  length: number
  videoWidth: number
  videoHeight: number
}

export enum ClassType {
  PERSON = 'PERSON',
  CAR = 'CAR',
}

export type Rect = {
  x: number
  y: number
  w: number
  h: number
  class: ClassType
}

export const currentVideo = signal({
  name: '',
  filePath: '',
  playingState: PlayingState.None,
  currentTime: 0,
  height: window.innerHeight * 0.6,
  width: 0,
  length: 0,
  videoWidth: 0,
  videoHeight: 0,
} as Video)

export const currentDetection = computed(async () => {
  if (currentVideo.value.name === '') {
    return null
  }
  try {
    return await reader.readJsonFile(
      currentVideo.value.name + DETECTION_EXTENSION
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.warn(`Something went wrong: ${error.message}`)
    }
  }
  return null
})

export const frame = computed(async () => {
  let time = Math.floor(currentVideo.value.currentTime * 10) / 10
  const frames = await currentDetection.value

  if (
    !frames ||
    !Number.isFinite(currentVideo.value.videoWidth) ||
    currentVideo.value.videoWidth === 0 ||
    !Number.isFinite(currentVideo.value.videoHeight) ||
    currentVideo.value.videoHeight === 0 ||
    !Number.isFinite(currentVideo.value.width) ||
    currentVideo.value.width === 0 ||
    !Number.isFinite(currentVideo.value.height) ||
    currentVideo.value.height === 0
  ) {
    return null
  }

  const keys = Object.keys(frames)
  let index = 0
  let key = ''
  let keyTime = timeFromFrameKey(keys[index]) ?? Infinity

  while (keyTime <= time) {
    key = keys[index]
    index++
    keyTime = timeFromFrameKey(keys[index]) ?? Infinity
  }

  return key
    ? transformedRects(
        frames[key],
        currentVideo.value.videoWidth,
        currentVideo.value.videoHeight,
        currentVideo.value.width,
        currentVideo.value.height
      )
    : null
}) as ReadonlySignal<Promise<Rect[]>>
