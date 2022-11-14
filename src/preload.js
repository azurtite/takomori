const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  handleCounter: (callback) => ipcRenderer.on('update-counter', callback),
  minimizeWindow: (callback) => ipcRenderer.send('minimize-window', callback)
})
