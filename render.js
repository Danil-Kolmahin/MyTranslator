const { ipcRenderer } = require('electron')

ipcRenderer.on('wantLog', (event, data) => {
    window.resultsArray = data
    const lastRes = data[data.length - 1]
    const div = document.getElementById('target')
    const myH1 = document.createElement('h1')
    myH1.textContent = lastRes.translated
    div.after(myH1)
    console.log(lastRes)
})

ipcRenderer.on('wantErr', (event, data) => {
    window.errorsArray = data
    const lastErr = data[data.length - 1]
    if (lastErr.error === 'Nothing new') console.warn(lastErr.error)
    else console.error(lastErr.error)
})