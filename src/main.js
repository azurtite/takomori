const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
	const mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		height:	240,
		width:	400,
		frame:	false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	mainWindow.loadFile('index.html')

	// Open the DevTools.
	mainWindow.webContents.openDevTools({mode: 'undocked'})
	return mainWindow
}

app.whenReady().then(() => {
	ipcMain.on('minimize-window', (_event, value) => {
		win.minimize();
	})
	win = createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
