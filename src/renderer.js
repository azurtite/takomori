const minimize = document.getElementById('minimize-btn');

minimize.addEventListener('click', () => {
	console.log('Click minimize button');
	window.electronAPI.minimizeWindow('minimize');
})