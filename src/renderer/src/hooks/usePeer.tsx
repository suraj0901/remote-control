import { MessageType } from '@/components/Chat'
import { RefObject, useEffect, useRef, useState } from 'react'
import { PeerWrapper } from '../components/PeerWrapper'
import { useToast } from '../components/ui/use-toast'

export function usePeer(videoRef: RefObject<HTMLVideoElement>) {
  const { toast } = useToast()
  const peer = useRef<PeerWrapper>()
  const [state, set_state] = useState<PeerWrapperState>()

  useEffect(() => {
    peer.current = new PeerWrapper({
      on_error(message) {
        console.log(message)
        toast({
          variant: 'destructive',
          description: message
        })
      },
      subscribe: set_state,
      remote_video_element: videoRef.current!
    })

    peer.current.on_end_call = () => {
      toast({
        title: 'Call disconnected'
      })
    }

    peer.current.chat.on_input_events = ({ type, payload }) => {
      if (type === MessageType.mouse_move) {
        // console.log({ payload })
        window.electron.ipcRenderer.send('MOUSE_MOVE', payload)
      } else if (type === MessageType.mouse_click) {
        console.log(MessageType.mouse_click, 'hmmm....')
        window.electron.ipcRenderer.send('MOUSE_CLICK', payload)
      } else if (type === MessageType.keyboard_input) {
        window.electron.ipcRenderer.send('KEYBOARD_INPUT', payload)
      }
    }

    window?.api?.getScreenId?.((_event, screen) => {
      console.log({ screen })
      window.selected_screen = screen
    })

    return () => {
      peer.current?.peer?.destroy()
    }
  }, [])
  return { state, peer: peer.current }
}
