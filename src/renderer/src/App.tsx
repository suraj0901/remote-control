import { useRef } from 'react'
import ChatBox from './components/ChatBox'
import { DisplayCopyId } from './components/DisplayCopyId'
import EndCall from './components/EndCall'
import PeerIdInput from './components/PeerIdInput'
import { Alert, AlertTitle } from './components/ui/alert'
import { ScrollArea } from './components/ui/scroll-area'
import { Separator } from './components/ui/separator'
import { usePeer } from './hooks/usePeer'
import { MessageType } from './components/Chat'

function App(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, peer } = usePeer(videoRef)

  const handleFormSubmit = (id: string) => {
    peer?.start_call(id)
  }

  const handle_mouse_move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = e
    const clientWidth = window.innerWidth
    const clientHeight = window.innerHeight
    peer?.chat.send_event(MessageType.mouse_move, { clientX, clientY, clientHeight, clientWidth })
  }

  // const handle_mouse_click = () => {
  //   peer?.chat.send_event(MessageType.mouse_click, {})
  // }

  const handle_key_down = (e) => {
    console.log({ keyCode: e.code })
    // peer?.chat.send_event(MessageType.keyboard_input, {})
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

      <div
        onMouseMove={handle_mouse_move}
        // onClick={handle_mouse_click}
        onKeyDown={handle_key_down}
      >
        <video ref={videoRef} muted className="w-full aspect-video">
          Video not available
        </video>
      </div>
    </ScrollArea>
  )
}

export default App
