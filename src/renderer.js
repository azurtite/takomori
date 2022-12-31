const minimize = document.getElementById('minimize-btn');
const positioning = document.getElementById('conf-set-ctrl');

minimize.addEventListener('click', () => {
	console.log('Click minimize button');
	window.electronAPI.minimizeWindow('minimize');
});

positioning.addEventListener(`click`, () => {
	console.log(`x = ${$('#win-pos-x').val()}px`);
	console.log(`y = ${$('#win-pos-y').val()}px`);
	window.electronAPI.changeWindowPosition(`x:${$('#win-pos-x').val()}/y:${$('#win-pos-y').val()}`);
});