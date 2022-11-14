
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

	const menu = Menu.buildFromTemplate([
		{
			label: app.name,
			submenu: [
			{
				click: () => mainWindow.webContents.send('update-counter', 1),
				label: 'Increment',
			},
			{
				click: () => mainWindow.webContents.send('update-counter', -1),
				label: 'Decrement',
			},
			{
				click: () => app.quit(),
				label: 'Close',
			}
			]
		}
	])

	Menu.setApplicationMenu(menu)
	mainWindow.loadFile('index.html')

	// Open the DevTools.
	mainWindow.webContents.openDevTools({mode: 'undocked'})
	return mainWindow
}

app.whenReady().then(() => {
	ipcMain.on('counter-value', (_event, value) => {
		console.log(value) // will print value to Node console
	})
	win = createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
