const { app, BrowserWindow, clipboard, globalShortcut, ipcMain, Menu, MenuItem } = require('electron')
const { getText } = require('./RAndT')

//const v8 = require('v8')

const resultsArray = []
const errorsArray = []
let win

function createWindow () {
    win = new BrowserWindow({
        x: 1112,
        y: 3,
        width: 256,
        height: 1024,
        alwaysOnTop: true,
        //icon: './sources/small_icon_64.ico',
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('index.html').catch(e => console.error(e, '\x1b[31m' + 'index.html didn\'t load' + '\x1b[0m'))
}

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(() => {
    createWindow()

    const fs = require('fs')

    const filename = 'finalBig.txt'
    const findStr = 'Кабінету Міністрів'

    const fake = []

    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) throw err
        const allQuestions = data.trim().toLowerCase().split('.\n')
        allQuestions.forEach((cur, i, arr) => fake[i] = cur.split('?\n'))
        allQuestions.forEach((cur, i, arr) => fake[i][1] = cur[1] ? cur[1].split(';\n') : 'ERROR')
    })

    //v8.setFlagsFromString('--no-flush-bytecode');

    const { commandsMap } = Menu.getApplicationMenu()
    const template = []
    for (const prop in commandsMap) {
        if (commandsMap.hasOwnProperty(prop)) {
            template[+prop] = commandsMap[prop]
        }
    }
    const menu = Menu.buildFromTemplate(template)

    let timeout

    const recursive = () => {
        timeout = null
        getText(resultsArray, clipboard, fake)
            .then(res => {
                resultsArray.push(res)
                win.webContents.send('wantLog', resultsArray)
            })
            .catch(err => {
                errorsArray.push(err)
                win.webContents.send('wantErr', errorsArray)
            })
            .finally(() => {
                timeout = setTimeout(() => recursive(), 1500)
            })
    }

    recursive()

    Menu.setApplicationMenu(menu);
})

app.on('will-quit', () => {globalShortcut.unregisterAll()})