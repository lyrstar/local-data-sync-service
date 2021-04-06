const {app, BrowserWindow} = require('electron')

function createWindow() {
    const win = new BrowserWindow({
        width: 1024,
        height: 626,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        devTools: true,
        titleBarStyle: 'hidden',
        title: '本地数据同步',
    })

    win.loadFile('index.html')
    win.removeMenu();
    // win.loadURL('https://author.itaotuo.com/editor/')
    win.webContents.openDevTools();


}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

require('./app');