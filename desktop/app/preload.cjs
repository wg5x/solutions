const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('dshDesktop', {
  getSettings: () => ipcRenderer.invoke('dsh:get-settings'),
  saveSettings: settings => ipcRenderer.invoke('dsh:save-settings', settings),
  sendChat: payload => ipcRenderer.invoke('dsh:send-chat', payload),
})
