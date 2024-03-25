import { useRef } from 'react'
import ChatBox from './components/ChatBox'
import { DisplayCopyId } from './components/DisplayCopyId'
import EndCall from './components/EndCall'
import PeerIdInput from './components/PeerIdInput'
import { Alert, AlertTitle } from './components/ui/alert'
import { ScrollArea } from './components/ui/scroll-area'
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
  }

  return (
    <ScrollArea className="p-2 h-svh w-svw">
      <div className="flex justify-between items-center px-4">
        <DisplayCopyId peerState={state} />
        {state?.status === 'connected' && (
          <div className="flex gap-x-1">
            <ChatBox peer={peer!} />
            <EndCall onClose={() => peer?.call?.close()} />
          </div>
        )}
        {state?.status === 'idle' && <PeerIdInput onSuccess={handleFormSubmit} />}
      </div>
      <Separator className="my-1  lg:my-2" />
      {state?.status === 'connecting' && (
        <Alert className="w-fit mx-auto">
          <AlertTitle className="font-bold">Connecting...</AlertTitle>
        </Alert>
      )}
      <video ref={videoRef} muted className="w-full aspect-video">
        Video not available
      </video>
    </ScrollArea>
  )
}

export default App
