const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const https = require('https')

let mainWindow
let aboutWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      devTools: true,
    }
  })
  mainWindow.loadFile('templates/index.html') // TODO Use path.join
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createAboutWindow() {
  if (aboutWindow != null) {
    aboutWindow.focus()
    return
  }
  aboutWindow = new BrowserWindow({
    width: 400,
    height: 400,
    webPreferences: {
      nodeIntegration: false,
      devTools: false,
    },
    autoHideMenuBar: true
  })
  aboutWindow.loadFile('templates/about.html') // TODO Use path.join
  aboutWindow.on('closed', function () {
    aboutWindow = null
  })
}

app.on('ready', function () {
  var menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          click() {
            app.exit(0)
          },
          accelerator: 'Ctrl+Q',
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click() {
            createAboutWindow()
          },
          accelerator: 'F12'
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu);
  createMainWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') { app.quit() }
})

app.on('activate', function () {
  if (mainWindow === null) { createWindow() }
})


// IPC Events 
ipcMain.on('submit-request', (event, url) => {
  console.log("URL to fetch: " + url)
  https.get(url, (response) => {
    console.log('Reponse received.')
    let data = ''
    response.on('data', (chunk) => {
      data += chunk
    })
    response.on('end', () => {
      console.log("Response received: " + data)
      event.sender.send('response', data)
    })
  }).on("error", (err) => {
    console.log("Error: " + err.message)
  })
})

ipcMain.on('log', (event, arg) => {
  console.log(arg)
})
