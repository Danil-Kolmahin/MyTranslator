const {clipboard} = require('electron')
const nativeImage = require('electron').nativeImage
const {createWorker} = require('tesseract.js')

const func = async () => {
    let img = clipboard.readImage().toJPEG(70)
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('ukr')
    await worker.initialize('ukr')
    return await worker.recognize(img)
}

clipboard.writeImage(nativeImage.createFromPath('./sources/testText.PNG'))
console.log(func().then(res => console.log(res)))