const {createWorker} = require('tesseract.js')
const translate = require('@vitalets/google-translate-api')

const translateFromText = (findStr, allQuestions) => {
    const search = (questions, findStr) => questions.filter(cur => cur[0].search(new RegExp(findStr)) !== -1)

    const searchAndColor = (questions, findStr) => questions.map((cur, i, arr) => {
        const pos = cur[0].search(new RegExp(findStr))
        if (pos === -1) throw 'error in searchAndColor func'
        const current = cur
        current[0] = cur[0].slice(0, pos) + '<mark>' + cur[0].slice(pos, pos + findStr.length) + '</mark>' + cur[0].slice(pos + findStr.length)
        return current
    })

    //const { text } = await translate(findStr, {to: 'uk'})
    //findStr = text
    //console.log(findStr)
    findStr.toLowerCase().trim()
    if (!findStr) findStr = '___'
    findStr.slice(0, findStr.length - 1)
    let foundQuestions = search(allQuestions, findStr)
    foundQuestions = searchAndColor(foundQuestions, findStr)
    //console.log(foundQuestions)
    return foundQuestions
}

const getTextFromClipImg = async function (clipboard) {
    let img
    try {
        img = clipboard.readImage().toJPEG(70)
    } catch (e) {
        console.error(e)
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
        all = await worker.recognize(img)
    } finally {
        await worker.terminate()
    }
    return {text: all.data.text, error: ''}
}

const getTextFromClipText = function (clipboard) {
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
    } catch (e) {
        //throw {error: e, date: new Date(), getBy}
    }

    if (lastValue) if (lastValue.text === text) throw {error: 'Nothing new', date: new Date(), getBy}

    const translated = translateFromText(text, allQuestions)
    return {
        text,
        translated,
        date: new Date(),
        getBy
    }
}

module.exports = {getText, getTextFromClipImg, getTextFromClipText}