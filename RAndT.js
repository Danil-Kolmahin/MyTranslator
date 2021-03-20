const {createWorker} = require('tesseract.js')
const translate = require('@vitalets/google-translate-api')

const translateFromText = async (findStr, allQuestions) => {
    const search = (questions, findStr) => {
        return questions.filter(cur => cur[0].search(new RegExp(findStr)) !== -1)
    }

    const searchAndColor = (questions, findStr) => {
        return questions.map((cur, i, arr) => {
            const pos = cur[0].search(new RegExp(findStr))
            if (pos === -1) throw 'error in searchAndColor func'
            cur[0] = arr[i][0].slice(0, pos) + '<mark>' + arr[i][0].slice(pos, pos + findStr.length) + '</mark>' + arr[i][0].slice(pos + findStr.length)
            return cur
        })
    }

    //const { text } = await translate(findStr, {to: 'uk'})
    //findStr = text
    //console.log(findStr)
    findStr.toLowerCase().trim()
    if (!findStr) findStr = '___'
    findStr.slice(0, findStr.length - 1)
    let foundQuestions = search(allQuestions, findStr)
    foundQuestions = searchAndColor(foundQuestions, findStr)
    return foundQuestions
}

let isWorkGetTextFromClipImg = false

const getTextFromClipImg = async function (clipboard) {
    // if (!isWorkGetTextFromClipImg) {
    // isWorkGetTextFromClipImg = true
    // if (clipboard.readText() !== '') throw 'Clipboard isn\'t empty' // don't helped
    let img
    // try {
    //     img = clipboard.readImage().toJPEG(70) // .toDataURL()
    // } catch (e) {
    //     throw {text: '', error: 'e'}
    // }
    // if (clipboard.readText() !== '') throw 'Clipboard isn\'t empty' // don't helped
    try {
        img = clipboard.readImage().toJPEG(70)
    } catch (e) {
        console.error(e)
        // return getTextFromClipText(clipboard)
    }
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('ukr')
    await worker.initialize('ukr')
    let all = {
        data: {
            text: ''
        }
    }
    try {
        //console.info('\x1b[36m' + (await worker.detect(img))+ '\x1b[0m')
        all = await worker.recognize(img)
        // if (all.data.text === '') throw 'Clipboard isn\'t empty 2'
    } catch (e) {
        // throw {text: '', error: 'e1'}
    } finally {
        await worker.terminate()
        // isWorkGetTextFromClipImg = false
    }
    // console.log('\x1b[36m%s\x1b[0m', all.data.text)
    return {text: all.data.text, error: ''}
    // }
}

const getTextFromClipText = function (clipboard) {
    //if (clipboard.readText() === '') throw 'Clipboard is empty'
    return {text: clipboard.readText(), error: ''}
}

const getText = async (array, clipboard, allQuestions) => {
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
        text = await getTextFun(clipboard)
        text = text.text.toLowerCase()
        // console.log(text)
    } catch (e) {
        //throw {error: e, date: new Date(), getBy}
    }

    let error
    // if (lastValue !== undefined) {
    // console.log(lastValue)
    if (lastValue) if (lastValue.text === text) throw 'Nothing new'
    // } else if (text === undefined) error = 'Text is undefined'

    //if (error) throw {error, date: new Date(), getBy}

    const translated = await translateFromText(text, allQuestions)
    return {
        text,
        translated,
        date: new Date(),
        getBy
    }
}

module.exports = {getText, getTextFromClipImg, getTextFromClipText}