import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

import { createDefaultSettings, loadSettings, saveSettings } from '../runtime/settings.mjs'
import { sendChatCompletion } from '../runtime/model.mjs'

const desktopRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const defaultRendererPath = join(desktopRoot, 'app', 'renderer', 'index.html')
const defaultPreloadPath = join(desktopRoot, 'app', 'preload.cjs')

export function resolveSettingsPath(app) {
  return join(app.getPath('userData'), 'settings.json')
}

export function createDesktopApp({
  app,
  BrowserWindow,
  ipcMain,
  settingsPath = resolveSettingsPath(app),
  rendererPath = defaultRendererPath,
  preloadPath = defaultPreloadPath,
  loadSettingsFn = loadSettings,
  saveSettingsFn = saveSettings,
  sendChatCompletionFn = sendChatCompletion,
} = {}) {
  if (!app) throw new TypeError('app is required')
  if (typeof BrowserWindow !== 'function') throw new TypeError('BrowserWindow is required')
  if (!ipcMain?.handle) throw new TypeError('ipcMain is required')

  let mainWindow

  async function createWindow() {
    mainWindow = new BrowserWindow({
      width: 1280,
      height: 900,
      minWidth: 1100,
      minHeight: 760,
      show: false,
      title: 'DSH Desktop',
      backgroundColor: '#f4f6f8',
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        preload: preloadPath,
      },
    })
    mainWindow.once('ready-to-show', () => mainWindow?.show())
    mainWindow.on('closed', () => {
      mainWindow = undefined
    })
    await mainWindow.loadFile(rendererPath)
    return mainWindow
  }

  async function bootstrap() {
    ipcMain.handle('dsh:get-settings', async () => loadSettingsFn(settingsPath))
    ipcMain.handle('dsh:save-settings', async (_event, nextSettings) => saveSettingsFn(settingsPath, nextSettings))
    ipcMain.handle('dsh:send-chat', async (_event, payload) => {
      const settings = payload?.settings ?? createDefaultSettings()
      const messages = Array.isArray(payload?.messages) ? payload.messages : []
      return sendChatCompletionFn({ settings, messages })
    })
    return createWindow()
  }

  async function close() {
    if (typeof ipcMain.removeHandler === 'function') {
      for (const channel of ['dsh:get-settings', 'dsh:save-settings', 'dsh:send-chat']) {
        ipcMain.removeHandler(channel)
      }
    }
    if (mainWindow?.destroy) {
      mainWindow.destroy()
    } else if (mainWindow?.close) {
      mainWindow.close()
    }
    mainWindow = undefined
  }

  function showMainWindow() {
    if (!mainWindow) return
    if (typeof mainWindow.isMinimized === 'function' && mainWindow.isMinimized()) {
      mainWindow.restore?.()
    }
    mainWindow.show?.()
    mainWindow.focus?.()
  }

  return {
    settingsPath,
    bootstrap,
    close,
    showMainWindow,
    get mainWindow() {
      return mainWindow
    },
  }
}

async function runElectronDesktop() {
  const { app, BrowserWindow, ipcMain, dialog } = await import('electron')
  const desktop = createDesktopApp({ app, BrowserWindow, ipcMain })

  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return
  }

  app.on('second-instance', () => {
    desktop.showMainWindow()
  })

  app.whenReady().then(() => desktop.bootstrap()).catch(async error => {
    const message = error instanceof Error ? error.message : String(error)
    await dialog.showErrorBox('DSH Desktop 启动失败', message)
    app.quit()
  })

  app.on('activate', async () => {
    if (desktop.mainWindow) {
      desktop.showMainWindow()
      return
    }
    await desktop.bootstrap()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}

if (process.versions?.electron) {
  void runElectronDesktop()
}
