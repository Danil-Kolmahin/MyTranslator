const { ipcRenderer } = require('electron')

let array = []
window.resultsArray = []

document.querySelector('input').oninput = () =>
    ipcRenderer.send('input', document.querySelector('input').value)

ipcRenderer.on('wantLog', (event, data) => {
    array.forEach(child => child.remove())
    array = []

    console.clear()
    console.log(data)
    window.resultsArray.push(data)
    data.translated.forEach((cur, i) => {
        const div = document.getElementById('target')
        const myDiv1 = document.createElement('div')
        const condition = i === data.translated.length - 1
        !condition && myDiv1.insertAdjacentHTML('afterbegin', '<hr style="margin-top: 0.9em;margin-bottom: 0.6em;"/>')
        myDiv1.insertAdjacentHTML('beforeend', `<b>${cur[0]}</b>`)
        const pageLetters = ['А', 'Б', 'В', 'Г']
        cur[1].forEach((text, i) => text.slice(0, 1) === '+'
            ? myDiv1.insertAdjacentHTML('beforeend', `<br><br><u>${pageLetters[i]}) ${text.slice(2)}</u>`)
            : myDiv1.insertAdjacentHTML('beforeend', `<br><br><span>${pageLetters[i]}) ${text}</span>`))
        div.after(myDiv1)
        array.push(myDiv1)
    })
    document.querySelector('input').value = data.text
})

ipcRenderer.on('wantErr', (event, data) => {
    window.errorsArray = data
    const lastErr = data[data.length - 1]
    if (lastErr.error === 'Nothing new') console.warn(lastErr.error)
    else console.error(lastErr.error)
})