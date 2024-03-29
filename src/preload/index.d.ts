import { ElectronAPI } from '@electron-toolkit/preload'

interface DisplaySize {
  width: number
  height: number
}
interface Screen {
  id: string
  displaySize: DisplaySize
}

declare global {
  interface Window {
    selected_screen: Screen
    electron: ElectronAPI
    api: {
      getScreenId: (callback: (event: unknown, screeen: Screen) => void) => void
      set_size: ({
        height,
        width
      }: {
        height: number | undefined
        width: number | undefined
      }) => void
    }
  }
}
