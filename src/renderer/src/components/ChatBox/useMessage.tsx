import { PeerWrapper } from '../PeerWrapper'
import { useEffect, useState } from 'react'

interface Message {
  time_stamp: number
  message: string
  is_self: boolean
  is_read: boolean
}

export function useMessage({ peer }: { peer: PeerWrapper }) {
  const [message_list, set_message_list] = useState<Message[]>([])

  useEffect(() => {
    if (!peer.chat) return
    peer.chat.onmessage = (event) => {
      const data = event.data as string
      // console.log('message recieved', data)
      const { type, time_stamp, message } = JSON.parse(data)
      if (type === 'message') {
        set_message_list((prev) => [
          ...prev,
          {
            time_stamp,
            message,
            is_self: false,
            is_read: false
          }
        ])
      }
    }
  }, [])

  const send_message = (message: string) => {
    const payload = {
      message,
      time_stamp: Date.now()
    }
    set_message_list((prev) => [
      ...prev,
      {
        ...payload,
        is_self: true,
        is_read: true
      }
    ])
    peer.chat?.send(JSON.stringify({ ...payload, type: 'message' }))
  }
  return { message_list, send_message }
}
