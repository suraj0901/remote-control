import { useSyncExternalStore } from 'react'
import { PeerWrapper } from '../PeerWrapper'
import { MessageType } from '../Chat'

export function useMessage({ peer }: { peer: PeerWrapper }) {
  const message_list = useSyncExternalStore(peer.chat.subscribe, peer.chat.get_message)

  const send_message = (message: string) => {
    peer.chat?.send_message(message)
  }

  peer.chat.on_input_events = ({ type, payload }) => {
    if (type === MessageType.mouse_move) {
      window.electron.ipcRenderer.send('MOUSE_MOVE', payload)
    }
  }

  return { message_list, send_message }
}
