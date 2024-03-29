import Peer, { MediaConnection, PeerError } from 'peerjs'
import { Chat } from './Chat'

const CHAT_LABEL = 'chat'

export class PeerWrapper {
  peer: Peer
  state: PeerWrapperState = {
    id: '',
    status: 'idle'
  }
  remote_video_element: HTMLVideoElement
  call: MediaConnection | null = null
  chat = new Chat()
  local_stream?: MediaStream | undefined
  remote_stream?: MediaStream | undefined
  on_error: (error: string) => void
  subscribe: (value: PeerWrapperState) => void
  on_end_call?: () => void

  constructor({
    subscribe,
    on_error,
    remote_video_element
  }: {
    subscribe: (value: PeerWrapperState) => void
    on_error: (error: string) => void
    remote_video_element: HTMLVideoElement
  }) {
    this.peer = new Peer()
    this.on_error = on_error
    this.subscribe = subscribe
    this.remote_video_element = remote_video_element
    this.peer.on('open', (id) => this.#update_state({ id }))
    this.peer.on('call', (call) => {
      this.call = call
      this.#update_state({ status: 'incomming' })
      this.answer_call()
    })
  }

  #update_state = (new_state: Partial<PeerWrapperState>) => {
    // if (!this.state) return
    this.state = {
      ...this.state,
      ...new_state
    }
    this.subscribe(this.state)
  }

  start_call = async (id: string) => {
    if (!id) return
    try {
      this.local_stream = await navigator.mediaDevices.getUserMedia(this.#get_constraint())
      this.#update_state({ status: 'connecting' })
      this.call = this.peer.call(id, this.local_stream)
      this.call.on('stream', this.#handle_remote_stream)
      this.call.on('error', this.#handle_error)
      this.call.on('close', this.#stop_call)
    } catch (error: unknown) {
      console.log({ error })
      this.on_error((error as string).toString())
    }
  }

  answer_call = async () => {
    if (!this.call) return
    try {
      this.local_stream = await navigator.mediaDevices.getUserMedia(this.#get_constraint())
      this.call.on('stream', () => {
        this.#update_state({ status: 'connected' })
        if (!this.call?.peerConnection) return
        this.call.peerConnection.ondatachannel = ({ channel }) => {
          if (channel.label === CHAT_LABEL) {
            this.chat.add_channel(channel)
            channel.onclose = this.#stop_call
          }
        }
      })
      this.call.on('error', this.#handle_error)
      this.call.on('close', this.#stop_call)
      this.call.answer(this.local_stream)
    } catch (error) {
      console.log({ error })
      this.on_error((error as string).toString())
    }
  }

  #stop_call = () => {
    if (!this.call) return
    this.#stop_video(this.local_stream)
    this.#stop_video(this.remote_stream)
    this?.on_end_call?.()
    this.chat?.close()
    this.#update_state({ status: 'idle' })
    this.remote_video_element.srcObject = null
    console.log('call closed')
  }

  #stop_video = (stream: MediaStream | undefined) => {
    if (!stream) return
    const tracks = stream.getTracks()
    for (const track of tracks) {
      track.stop()
    }
  }

  #handle_error = (error: PeerError<'negotiation-failed' | 'connection-closed'>) => {
    this.#stop_call()
    this.on_error(error.message)
  }

  #handle_remote_stream = (remote_stream: MediaStream) => {
    this.remote_stream = remote_stream
    this.#update_state({ status: 'connected' })
    this.remote_video_element.srcObject = remote_stream
    this.remote_video_element.onloadedmetadata = async () => {
      await this.remote_video_element.play()
    }
    if (!this.call) return
    const channel = this.call.peerConnection.createDataChannel(CHAT_LABEL)
    this.chat.add_channel(channel)
    this.chat.can_send_event = true
  }

  #get_constraint = () => {
    const constraint = (
      window.selected_screen
        ? {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: window.selected_screen.id
              }
            }
          }
        : { audio: false, video: true }
    ) as MediaStreamConstraints

    return constraint
  }
}
