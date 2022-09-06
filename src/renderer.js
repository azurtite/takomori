const counter = document.getElementById('counter')
const sioData = document.getElementById('sio-message')

window.electronAPI.handleCounter((event, value) => {
    const oldValue = Number(counter.innerText)
    const newValue = oldValue + value
    counter.innerText = newValue
    event.sender.send('counter-value', newValue)
})
window.electronAPI.handleSIOMsg((event, value) => {
	sioData.innerText = value	
	event.sender.send('serial-data', value)
})