import { app, shell, BrowserWindow, desktopCapturer, ipcMain, Menu, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { mouse, straightTo } from '@nut-tree/nut-js'

let available_screens: Electron.DesktopCapturerSource[]
let mainWindow: BrowserWindow

function send_selected_screen(id: string) {
  mainWindow.webContents.send('SET_SOURCE_ID', id)
}

function create_tray() {
  const screens_menu = available_screens.map((screen) => ({
    label: screen.name,
    click: () => {
      send_selected_screen(screen.id)
    }
  }))
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [{ role: 'quit' }]
    },
    {
      label: 'Screens',
      submenu: screens_menu
    }
  ])
  Menu.setApplicationMenu(menu)
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    desktopCapturer
      .getSources({
        types: ['screen']
      })
      .then((screens) => {
        send_selected_screen(screens[0].id)
        available_screens = screens
        create_tray()
        // for (const source of sources) {
        //   mainWindow.webContents.send('SET_SOURCE_ID', source.id)
        // }
      })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('SET_SIZE', (_event, size) => {
    const { height, width } = size
    try {
      mainWindow.setSize(height, width, true)
    } catch (error) {
      console.log({ error })
    }
  })

  ipcMain.on('MOUSE_MOVE', (_e, { clientX, clientY, clientHeight, clientWidth }: any) => {
    const {
      size: { height, width }
    } = screen.getPrimaryDisplay()
    const ratioX = width / clientWidth
    const ratioY = height / clientHeight
    mouse.move(straightTo({ x: clientX * ratioX, y: clientY * ratioY }))
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
