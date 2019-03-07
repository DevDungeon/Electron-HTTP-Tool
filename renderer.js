const { ipcRenderer } = require('electron')


function log(message) {
    // Log in back end console
    ipcRenderer.send('log', message)
}

log('Starting renderer...')

// Handle response from HTTP request
ipcRenderer.on('response', (event, value) => {
    log("HTTP Response received: " + value)
    document.getElementById('main-text').innerText = value
})

document.getElementById("submit-button").addEventListener("click", function () {
    let url = document.getElementById('url').value
    log('Sending request to ' + url)
    ipcRenderer.send('submit-request', url)
    
})
