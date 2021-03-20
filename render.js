const { ipcRenderer } = require('electron')

let array = []
window.resultsArray = []

ipcRenderer.on('wantLog', (event, data) => {
    array.forEach(child => child.remove())
    array = []

    window.resultsArray.push(data)
    data.forEach((cur) => {
        const div = document.getElementById('target')
        const myDiv1 = document.createElement('div')
        myDiv1.insertAdjacentHTML('afterbegin', `<b>${cur[0]}</b>`)
        cur[1].forEach(text => text.slice(0, 1) === '+'
            ? myDiv1.insertAdjacentHTML('beforeend', `<br><u>${text.slice(2)}</u>`)
            : myDiv1.insertAdjacentHTML('beforeend', `<br><span>${text}</span>`))
        //myDiv1.textContent = lastRes.translated
        //myDiv1.innerHTML = lastRes.translated
        div.after(myDiv1)
        array.push(myDiv1)
        //console.log(cur)
    })
})

ipcRenderer.on('wantErr', (event, data) => {
    window.errorsArray = data
    const lastErr = data[data.length - 1]
    if (lastErr.error === 'Nothing new') console.warn(lastErr.error)
    else console.error(lastErr.error)
})