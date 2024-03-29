import { useSyncExternalStore } from 'react'
import { PeerWrapper } from '../PeerWrapper'

export function useMessage({ peer }: { peer: PeerWrapper }) {
  const message_list = useSyncExternalStore(peer.chat.subscribe, peer.chat.get_message)

  const send_message = (message: string) => {
    peer.chat?.send_message(message)
  }

  return { message_list, send_message }
}
