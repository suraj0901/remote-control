import { useRef } from 'react'
import { DisplayCopyId } from './DisplayCopyId'
import PeerIdInput from './components/PeerIdInput'
import { Alert, AlertTitle } from './components/ui/alert'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { usePeer } from './hooks/usePeer'

export interface PeerState {
  id: string
}

function App(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, peer } = usePeer(videoRef)

  const handleFormSubmit = (id: string) => {
    peer?.start_call(id)
    // handleStream(window.screenId)
  }

  // const handleStream = async (sourceId: string) => {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({
  //       audio: false,
  //       video: {
  //         mandatory: {
  //           chromeMediaSource: 'desktop',
  //           chromeMediaSourceId: sourceId
  //         }
  //       }
  //     })
  //     const video = videoRef.current
  //     if (!video) return
  //     video.srcObject = stream
  //     video.onloadedmetadata = async () => await video.play()
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }

  // useEffect(() => {
  //   window?.api?.getScreenId?.((_event, screenId) => {
  //     window.screenId = screenId
  //     console.log({ screenId })
  //   })
  // }, [])

  return (
    <div className="p-2">
      <div className="flex justify-between items-center px-4">
        <DisplayCopyId peerState={state} />
        <PeerIdInput onSuccess={handleFormSubmit} />
      </div>
      <Separator className="my-4" />
      {state?.status === 'connecting' && (
        <Alert className="w-full max-w-xs mx-auto">
          <AlertTitle className="font-bold"> Connecting</AlertTitle>
        </Alert>
      )}
      {state?.status === 'connected' && (
        <div className="mx-auto">
          <Button variant="destructive" onClick={() => peer?.stop_call()}>
            End Call
          </Button>
        </div>
      )}
      <video ref={videoRef} muted className="w-full aspect-video">
        Video not available
      </video>
    </div>
  )
}

export default App
