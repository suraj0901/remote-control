import { RefObject, useEffect, useRef, useState } from 'react'
import { useToast } from '../components/ui/use-toast'
import { PeerWrapper, PeerWrapperState } from '../components/PeerWrapper'

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

    window?.api?.getScreenId?.((_event, screenId) => {
      window.screenId = screenId
    })

    return () => {
      peer.current?.peer?.destroy()
    }
  }, [])
  return { state, peer: peer.current }
}
