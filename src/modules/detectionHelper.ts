import { Rect } from '../state'

// calculating actual seconds from json object keys
export function timeFromFrameKey(key: string) {
  const matches = /(\d{1,2}):(\d{2}):(\d{2}\.\d{6})/.exec(key)
  if (!matches) {
    return
  }
  return (
    parseInt(matches[1]) * 3600 +
    parseInt(matches[2]) * 60 +
    parseFloat(matches[3])
  )
}

// calculating detection rectangles from actual player sizes
export function transformedRects(
  rects: Rect[],
  videoWidth: number,
  videoHeight: number,
  width: number,
  height: number
) {
  const widthRate = width / videoWidth
  const heightRate = height / videoHeight
  return rects.map((rect) => ({
    ...rect,
    x: Math.round(rect.x * widthRate),
    y: Math.round(rect.y * heightRate),
    w: Math.round(rect.w * widthRate),
    h: Math.round(rect.h * heightRate),
  }))
}
