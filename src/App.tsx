import { ErrorBoundary } from 'react-error-boundary'
import './App.css'
import { DetectionPlayer } from './components/DetectionPlayer/DetectionPlayer'
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer'
import { VideoSelector } from './components/VideoSelector/VideoSelector'
import { currentVideo } from './state'
import { ErrorFallback } from './components/ErrorFallback/ErrorFallback'

function App() {
  return (
    <>
      <div>
        <VideoSelector />
      </div>
      <div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {currentVideo.value.name && (
            <VideoPlayer>
              <DetectionPlayer />
            </VideoPlayer>
          )}
        </ErrorBoundary>
      </div>
    </>
  )
}

export default App
