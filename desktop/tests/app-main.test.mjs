import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { createDesktopApp } from '../app/main.mjs'

async function tempRoot() {
  return mkdtemp(join(tmpdir(), 'dsh-desktop-app-'))
}

function makeElectronStubs() {
  const events = []
  const handlers = new Map()
  let window

  class BrowserWindow {
    constructor(options) {
      this.options = options
      this.visible = false
      this.loadedPath = undefined
      this.listeners = new Map()
      window = this
      events.push(['window', options])
    }

    once(event, handler) {
      this.listeners.set(event, handler)
    }

    on(event, handler) {
      this.listeners.set(event, handler)
    }

    async loadFile(path) {
      this.loadedPath = path
      events.push(['loadFile', path])
    }

    show() {
      this.visible = true
      events.push(['show'])
    }

    focus() {
      events.push(['focus'])
    }

    isMinimized() {
      return false
    }
  }

  const app = {
    getPath(name) {
      assert.equal(name, 'userData')
      return '/tmp/dsh-user-data'
    },
    isPackaged: false,
    whenReady: async () => undefined,
    requestSingleInstanceLock: () => true,
    on: () => undefined,
    quit: () => undefined,
    exit: () => undefined,
  }

  const ipcMain = {
    handle(name, handler) {
      handlers.set(name, handler)
    },
    removeHandler(name) {
      handlers.delete(name)
    },
  }

  return { app, BrowserWindow, ipcMain, handlers, events, getWindow: () => window }
}

test('createDesktopApp wires the desktop shell and IPC surface', async () => {
  const root = await tempRoot()
  const stubs = makeElectronStubs()
  const settingsPath = join(root, 'settings.json')
  const saveCalls = []
  let chatCalls

  const desktop = createDesktopApp({
    app: stubs.app,
    BrowserWindow: stubs.BrowserWindow,
    ipcMain: stubs.ipcMain,
    settingsPath,
    loadSettingsFn: async () => ({
      providerBaseUrl: 'https://api.deepseek.com',
      apiKey: 'secret-token',
      model: 'deepseek-chat',
      systemPrompt: '你是 DSH desktop 的基础对话助手。',
      temperature: 0.2,
    }),
    saveSettingsFn: async (filePath, settings) => {
      saveCalls.push([filePath, settings])
      return settings
    },
    sendChatCompletionFn: async ({ settings, messages }) => {
      chatCalls = { settings, messages }
      return '你好'
    },
  })

  await desktop.bootstrap()

  assert.equal(desktop.settingsPath, settingsPath)
  assert.match(stubs.events[0][1].title, /DSH Desktop/)
  assert.equal(stubs.events[0][1].webPreferences.contextIsolation, true)
  assert.equal(stubs.events[0][1].webPreferences.nodeIntegration, false)
  assert.equal(stubs.events[0][1].webPreferences.sandbox, true)
  assert.match(stubs.events[0][1].webPreferences.preload, /desktop[\/]app[\/]preload\.cjs$/)
  assert.match(stubs.getWindow().loadedPath, /desktop[\/]app[\/]renderer[\/]index\.html$/)
  assert.ok(stubs.handlers.has('dsh:get-settings'))
  assert.ok(stubs.handlers.has('dsh:save-settings'))
  assert.ok(stubs.handlers.has('dsh:send-chat'))

  const saved = await stubs.handlers.get('dsh:save-settings')({}, { model: 'deepseek-chat' })
  assert.equal(saveCalls[0][0], settingsPath)
  assert.equal(saved.model, 'deepseek-chat')

  const reply = await stubs.handlers.get('dsh:send-chat')({}, {
    settings: {
      providerBaseUrl: 'https://api.deepseek.com',
      apiKey: 'secret-token',
      model: 'deepseek-chat',
      systemPrompt: '你是 DSH desktop 的基础对话助手。',
      temperature: 0.2,
    },
    messages: [{ role: 'user', content: '你好' }],
  })

  assert.equal(reply, '你好')
  assert.equal(chatCalls.settings.model, 'deepseek-chat')
  assert.deepEqual(chatCalls.messages, [{ role: 'user', content: '你好' }])
})
