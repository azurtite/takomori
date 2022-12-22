const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')

function createWindow () {
	const mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		x:				0,
		y:				0,
		height:			240,
		width:			400,
		frame:			false,
		maximizable:	false,
		resizable:		false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	})

	mainWindow.loadFile('index.html')

	// Open the DevTools.
	mainWindow.webContents.openDevTools({mode: 'undocked'})
	return mainWindow
}

const locked = app.requestSingleInstanceLock();
if(!locked) {
	console.log('Application is already running.');
	console.log('Quit application');
	app.quit();
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
