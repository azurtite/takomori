const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: (callback) => ipcRenderer.send('minimize-window', callback),
  changeWindowPosition: (callback) => ipcRenderer.send('win-position-set', callback)
})
