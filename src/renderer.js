const counter = document.getElementById('counter')
const minimize = document.getElementById('minimize-btn');
console.log(minimize);

window.electronAPI.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})

minimize.addEventListener('click', () => {
	console.log('Click minimize button');
	window.electronAPI.minimizeWindow('minimize');
})