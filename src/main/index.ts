import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { Key, Point, keyboard, mouse } from '@nut-tree/nut-js'
import { BrowserWindow, Menu, app, desktopCapturer, ipcMain, screen, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

let available_screens: Electron.DesktopCapturerSource[]
let mainWindow: BrowserWindow
let displays: Electron.Display[]
let selected_screeen: Electron.Size

function send_selected_screen(screen: Electron.DesktopCapturerSource) {
  selected_screeen =
    displays.find((display) => `${display.id}` === screen.display_id)?.size ?? displays[0].size
  mainWindow.webContents.send('SET_SOURCE_ID', {
    id: screen.id,
    selected_screeen
  })
}

function create_tray() {
  const screens_menu = available_screens.map((screen) => ({
    label: screen.name,
    click: () => {
      send_selected_screen(screen)
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
    displays = screen.getAllDisplays()
    mainWindow.webContents.openDevTools()
    mainWindow.show()
    desktopCapturer
      .getSources({
        types: ['screen']
      })
      .then((screens) => {
        send_selected_screen(screens[0])
        available_screens = screens
        create_tray()
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

  ipcMain.on('KEYBOARD_INPUT', (_e, keyboard_input: Key) => {
    keyboard.pressKey(keyboard_input)
  })

  ipcMain.on('MOUSE_CLICK', () => {
    // const { height, width } = selected_screeen
    // const ratioX = width / clientWidth
    // const ratioY = height / clientHeight
    // const x = clientX * ratioX
    // const y = clientY * ratioY
    // console.log('mouse click')
    // mouse.setPosition(new Point(x, y))
    mouse.leftClick()
  })

  ipcMain.on('MOUSE_MOVE', (_e, { clientX, clientY, clientHeight, clientWidth }: any) => {
    const { height, width } = selected_screeen
    const ratioX = width / clientWidth
    const ratioY = height / clientHeight
    const x = clientX * ratioX
    const y = clientY * ratioY
    console.log({ x, y })
    mouse.setPosition(new Point(x, y))
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
