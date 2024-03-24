import Peer, { MediaConnection, PeerError } from 'peerjs'

export class PeerWrapper {
  peer: Peer
  state: PeerWrapperState = {
    id: '',
    status: 'idle'
  }
  remote_video_element: HTMLVideoElement
  call: MediaConnection | null = null
  chat: RTCDataChannel | undefined
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
    this.peer.on('open', (id) => this.update_state({ id }))
    this.peer.on('call', (call) => {
      this.call = call
      this.update_state({ status: 'incomming' })
      console.log('incomming call')
      this.answer_call()
    })
  }

  update_state(new_state: Partial<PeerWrapperState>) {
    // if (!this.state) return
    this.state = {
      ...this.state,
      ...new_state
    }
    this.subscribe(this.state)
  }

  async start_call(id: string) {
    if (!id) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.#get_constraint())
      this.update_state({ status: 'connecting' })
      const connection = this.peer.call(id, stream)
      this.call = connection
      connection.on('stream', (stream) => {
        console.log('stream recieved')
        this.#handle_remote_stream(stream)
      })
      connection.on('error', this.#handle_error)
      connection.on('close', this.stop_call)
    } catch (error: unknown) {
      console.log({ error })
      this.on_error((error as string).toString())
    }
  }

  async answer_call() {
    if (!this.call) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.#get_constraint())
      this.call.answer(stream)
      this.call.on('stream', () => {
        if (!this.call?.peerConnection) return
        this.call.peerConnection.ondatachannel = ({ channel }) => {
          if (channel.label === CHAT_LABEL) this.chat = channel
        }
      })
      this.call.on('error', this.#handle_error)
      this.call.on('close', this.stop_call)
    } catch (error) {
      console.log(error)
      this.on_error((error as string).toString())
    }
  }

  stop_call() {
    if (!this.call) return
    this.#stop_video(this.call?.localStream)
    this.#stop_video(this.call?.remoteStream)
    this?.on_end_call?.()
    this.update_state({ status: 'idle' })
    this.remote_video_element.srcObject = null
  }

  #stop_video(stream: MediaStream) {
    if (!stream) return
    const tracks = stream.getTracks()
    for (const track of tracks) {
      track.stop()
    }
  }

  #handle_error(error: PeerError<'negotiation-failed' | 'connection-closed'>) {
    this.stop_call()
    this.on_error(error.message)
  }

  #handle_remote_stream(remote_stream: MediaStream) {
    this.update_state({ status: 'connected' })
    this.remote_video_element.srcObject = remote_stream
    this.remote_video_element.onloadedmetadata = async () => {
      await this.remote_video_element.play()
    }
    if (!this.call) return
    this.chat = this.call.peerConnection.createDataChannel(CHAT_LABEL)
  }

  #get_constraint(): MediaStreamConstraints {
    const constraint = (
      window.screenId
        ? {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: window.screenId
              }
            }
          }
        : { audio: false, video: true }
    ) as MediaStreamConstraints

    return constraint
  }
}

const CHAT_LABEL = 'chat'
export interface PeerWrapperState {
  id: string
  status: 'idle' | 'connecting' | 'connected' | 'incomming'
}
