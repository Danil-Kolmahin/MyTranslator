app.commandLine.appendSwitch('switch1')
array.push(app.commandLine.hasSwitch('switch1'))

globalShortcut.register('S', () => {
    const sendkeys = require('sendkeys')
    sendkeys('^C').catch(err => console.log('NOT'))
    console.log(clipboard.readText())
})
globalShortcut.register('CommandOrControl+0', () => {
    console.log('CommandOrControl+0 is pressed')
    const { clipboard } = require('electron')
    clipboard.writeText('Example String', 'selection')
    console.log(clipboard.readText('selection'))
})

onsole.log('\x1b[36m%s\x1b[0m', array)

//process.stdin.setRawMode(true);
// process.stdin.on("keypress", function(chunk, key) {
//     console.log(process.argv);
//     if(key && key.name === "c" && key.ctrl) {
//         console.log("bye bye");
//         process.exit();
//     }
// });

// const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lh', '/usr']);
//
// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// document.body.insertBefore(myDiv, div)
// document.insertBefore(myDiv, div)

// function getSelectionText() {
//     // let selObj = window.getSelection();
//     // alert(selObj);
//     // let selRange = selObj.getRangeAt(0);
//     // console.log(selRange)
//     // return selRange;
// }

// const menuItemCreator = (label, accelerator) => {
//     let timeout
//     return new MenuItem({
//         label,
//         accelerator,
//         click: (menuItem) => {
//             timeout = null
//             let getTextFun
//             if (clipboard.readText() === '') {
//                 getTextFun = getTextFromClipImg
//             } else getTextFun = getTextFromClipText
//             const memoFunc = menuItem.click
//             menuItem.click = () => {}
//             getText(array, () => getTextFun(clipboard))
//                 .then(res => {
//                     array.push(res)
//                     win.webContents.send('wantLog', array)
//                 })
//                 .catch((err) => win.webContents.send('wantErr', err))
//                 .finally(() => {
//                     menuItem.click = memoFunc
//                     timeout = setTimeout(() => menuItem.click(menuItem), 300) // problem with less time
//                 })
//         }
//     })
// }

// const menuItemCreator = (label, accelerator, newFunc) => {
//     return new MenuItem({
//         label,
//         accelerator,
//         click: (menuItem) => getTextFun = newFunc
//     })
// }
//
// menu.append(menuItemCreator('📷', 'CommandOrControl+Shift+I', getTextFromClipImg))
// menu.append(menuItemCreator('📋', 'CommandOrControl+Shift+P', getTextFromClipText))