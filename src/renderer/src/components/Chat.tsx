export enum MessageType {
  message,
  mouse_click,
  mouse_move,
  keyboard_input
}

export class Chat {
  #channel?: RTCDataChannel
  #message_list?: Message[]
  #subscribers = new Set<() => void>()
  on_input_events?: (data: { type: MessageType; payload: unknown[] }) => void
  can_send_event?: boolean = false

  get_message = () => {
    return this.#message_list
  }

  add_channel = (channel?: RTCDataChannel) => {
    this.#channel = channel
    this.#on_message()
  }

  send_event = (type: MessageType = MessageType.message, payload: unknown) => {
    this.#channel?.send(JSON.stringify({ type, payload }))
  }

  send_message = (message: string) => {
    const payload = {
      time_stamp: Date.now(),
      message
    }
    this.#add_message({ ...payload, is_self: true, is_read: true })
    console.log({ list: this.#message_list })
    this.#channel?.send(JSON.stringify(payload))
  }

  subscribe = (callback) => {
    this.#subscribers.add(callback)
    return () => this.#subscribers.delete(callback)
  }

  close() {
    this.#channel?.close()
  }

  #on_message = () => {
    if (!this.#channel) return
    this.#channel.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if (data.type === MessageType.message) {
        this.#handle_chat_message(data)
      } else {
        this.on_input_events?.(data)
      }
    }
  }

  #handle_chat_message = (data) => {
    const { time_stamp, message } = data
    const payload = {
      time_stamp,
      message,
      is_self: false,
      is_read: false
    }
    this.#add_message(payload)
  }

  #add_message = (payload) => {
    this.#message_list = [...(this.#message_list ?? []), payload]
    this.#subscribers.forEach((subscriber) => subscriber())
  }
}
