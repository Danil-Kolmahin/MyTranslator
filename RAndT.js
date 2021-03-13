const { createWorker } = require('tesseract.js')
const translate = require('@vitalets/google-translate-api')

const translateFromText = async (basicText) => {
    const { text } = await translate(basicText, {to: 'ru'})
    return text
}

let isWorkGetTextFromClipImg = false

const getTextFromClipImg = async function(clipboard) {
    if (!isWorkGetTextFromClipImg) {
        isWorkGetTextFromClipImg = true
        if (clipboard.readText() !== '') throw 'Clipboard isn\'t empty' // don't helped
        let img
        try {
            img = clipboard.readImage().toJPEG(70) // .toDataURL()
        } catch (e) {
            throw {text: '', error: e}
        }
        if (clipboard.readText() !== '') throw 'Clipboard isn\'t empty' // don't helped
        // try {
        //     img = clipboard.readImage()
        // } catch (e) {
        //     console.error(e)
        //     return getTextFromClipText(clipboard)
        // }
        const worker = createWorker()
        await worker.load()
        await worker.loadLanguage('eng')
        await worker.initialize('eng')
        let all = {
            data: {
                text: ''
            }
        }
        try {
            //console.info('\x1b[36m' + (await worker.detect(img))+ '\x1b[0m')
            all = await worker.recognize(img)
            if (all.data.text === '') throw 'Clipboard isn\'t empty 2'
        } catch (e) {
            throw {text: '', error: e}
        } finally {
            await worker.terminate()
            isWorkGetTextFromClipImg = false
            return {text: all.data.text, error: ''}
        }
    }
}

const getTextFromClipText = function(clipboard) {
    //if (clipboard.readText() === '') throw 'Clipboard is empty'
    return { text: clipboard.readText(), error: '' }
}

const getText = async (array, clipboard) => {
    let getTextFun
    let getBy
    if (clipboard.readText() === '') {
        getTextFun = getTextFromClipImg
        getBy = 'getTextFromClipImg 📷'
    } else {
        getTextFun = getTextFromClipText
        getBy = 'getTextFromClipText 📋'
    }

    let text
    const lastValue = array[array.length - 1]
    try {
        text = await getTextFun(clipboard).text
    } catch (e) {
        throw { error: e, date: new Date(), getBy }
    }

    let error
    if (lastValue !== undefined) {
        if (lastValue.text === text) error = 'Nothing new'
    } else if (text === undefined) error = 'Text is undefined'

    if (error) throw { error, date: new Date(), getBy }

    const translated = await translateFromText(text)
    return {
        text,
        translated,
        date: new Date(),
        getBy
    }
}

module.exports = { getText, getTextFromClipImg, getTextFromClipText }