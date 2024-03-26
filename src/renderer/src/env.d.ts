/// <reference types="vite/client" />
interface Message {
  time_stamp: number
  message: string
  is_self: boolean
  is_read: boolean
}

interface PeerState {
  id: string
}

interface PeerWrapperState {
  id: string
  status: 'idle' | 'connecting' | 'connected' | 'incomming'
}
