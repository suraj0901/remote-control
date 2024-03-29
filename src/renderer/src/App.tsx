import { useRef } from 'react'
import { MessageType } from './components/Chat'
import ChatBox from './components/ChatBox'
import { DisplayCopyId } from './components/DisplayCopyId'
import EndCall from './components/EndCall'
import PeerIdInput from './components/PeerIdInput'
import { Alert, AlertTitle } from './components/ui/alert'
import { Separator } from './components/ui/separator'
import { usePeer } from './hooks/usePeer'

function App(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { state, peer } = usePeer(videoRef)
  const ref = useRef<NodeJS.Timeout>()

  const handleFormSubmit = (id: string) => {
    peer?.start_call(id)
  }

  const handle_mouse_move = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!peer?.chat.can_send_event) return
    const { clientX, clientY } = e
    const clientWidth = window.innerWidth
    const clientHeight = window.innerHeight
    const payload = {
      clientX,
      clientY,
      clientHeight,
      clientWidth
    }
    if (ref.current) {
      clearTimeout(ref.current)
    }
    ref.current = setTimeout(() => {
      peer?.chat.send_event(MessageType.mouse_move, payload)
    }, 300)
  }

  const handle_mouse_click = () => {
    peer?.chat.send_event(MessageType.mouse_click, {})
  }

  // useEffect(() => {
  //   window.onkeyup = (e: KeyboardEvent) => {
  //     // peer?.chat.send_event(MessageType.keyboard_input, {})
  //   }
  // }, [])

  return (
    <div className="p-2 h-svh w-svw flex flex-col">
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
        className="h-full mx-auto"
        onMouseMove={handle_mouse_move}
        onMouseUp={handle_mouse_click}
      >
        <video ref={videoRef} muted className="h-full mx-auto aspect-video">
          Video not available
        </video>
      </div>
    </div>
  )
}

export default App
