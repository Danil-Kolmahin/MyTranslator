const { ipcRenderer } = require('electron')

let array = []
window.resultsArray = []

document.querySelector('input').oninput = () =>
    ipcRenderer.send('input', document.querySelector('input').value)

ipcRenderer.on('wantLog', (event, data) => {
    array.forEach(child => child.remove())
    array = []

    window.resultsArray.push(data)
    data.forEach((cur, i) => {
        const div = document.getElementById('target')
        const myDiv1 = document.createElement('div')
        i !== data.length - 1 && myDiv1.insertAdjacentHTML('afterbegin', '<hr/>')
        myDiv1.insertAdjacentHTML('beforeend', `<b>${cur[0]}</b>`)
        cur[1].forEach((text) => text.slice(0, 1) === '+'
            ? myDiv1.insertAdjacentHTML('beforeend', `<br><u>${text.slice(2)}</u>`)
            : myDiv1.insertAdjacentHTML('beforeend', `<br><span>${text}</span>`))
        div.after(myDiv1)
        array.push(myDiv1)
    })
})

ipcRenderer.on('wantErr', (event, data) => {
    window.errorsArray = data
    const lastErr = data[data.length - 1]
    if (lastErr.error === 'Nothing new') console.warn(lastErr.error)
    else console.error(lastErr.error)
})