import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    screenId: string
    electron: ElectronAPI
    api: {
      getScreenId: (callback: (event: unknown, screeenId: string) => void) => void
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
