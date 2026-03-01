import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { openDatabase, sessionQueries, messageQueries, settingQueries } from './db'

// ─── Window ───────────────────────────────────────────────────────────────────

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#FAFAF5',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  win.on('ready-to-show', () => win.show())
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// ─── App lifecycle ────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.luchao.batquai')
  app.on('browser-window-created', (_, win) => optimizer.watchWindowShortcuts(win))

  openDatabase()
  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC Handlers ─────────────────────────────────────────────────────────────

function registerIpcHandlers(): void {
  // Sessions
  ipcMain.handle('session:create', (_e, id: string, title: string, question: string) =>
    sessionQueries.create(id, title, question)
  )

  ipcMain.handle('session:update', (_e, id: string, patch: object) =>
    sessionQueries.update(id, patch as any)
  )

  ipcMain.handle('session:list', () => sessionQueries.findAll())

  ipcMain.handle('session:get', (_e, id: string) => sessionQueries.findById(id))

  ipcMain.handle('session:delete', (_e, id: string) => sessionQueries.delete(id))

  // Messages
  ipcMain.handle('message:add', (_e, row: object) => messageQueries.add(row as any))

  ipcMain.handle('message:list', (_e, sessionId: string) => messageQueries.findBySession(sessionId))

  ipcMain.handle('message:update', (_e, id: string, content: string) =>
    messageQueries.updateContent(id, content)
  )

  // Settings
  ipcMain.handle('setting:get', (_e, key: string) => settingQueries.get(key))

  ipcMain.handle('setting:set', (_e, key: string, value: string) => settingQueries.set(key, value))
}
