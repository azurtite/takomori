const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const fileStream = require('fs');

let settingJSON = {
	window: {
		position: {
			x:	0,
			y:	0
		}
	}
}
if(fileStream.existsSync('setting.json')) {
	let stringJSON = fileStream.readFileSync('setting.json');
	try {
		settingJSON = JSON.parse(stringJSON);
	} catch(err) {
		throw(err);
	}
}

function createWindow () {
	const mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		x:				settingJSON.window.position.x,
		y:				settingJSON.window.position.y,
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
	ipcMain.on('win-position-set', (_event, value) => {
		var arr;
		if(typeof(value) == 'string') {
			arr = value.split('/');
			var x, y;
			for(var i=0; i<arr.length; i++) {
				var arrPos = arr[i].split(':');
				if(arrPos[0] == 'x') x = Number(arrPos[1]);
				else if(arrPos[0] == 'y') y = Number(arrPos[1]);
			}
			win.setPosition(x, y, false);
			settingJSON.window.position.x = x;
			settingJSON.window.position.y = y;
			fileStream.writeFile('setting.json', JSON.stringify(settingJSON, '	', '	'), (err) => {
				if(err) throw(err);
			})
		}
	})
	win = createWindow()

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
