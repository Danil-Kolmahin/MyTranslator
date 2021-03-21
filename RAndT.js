const {createWorker} = require('tesseract.js')
// const translate = require('@vitalets/google-translate-api')
const {takeQuestions} = require("./textWork")
const {searchAndColor} = require("./textWork")
const {search} = require("./textWork")

const translateFromText = (findStr) => {
    //const { text } = await translate(findStr, {to: 'uk'})
    //findStr = text
    //console.log(findStr)
    //const allQuestions = getQuestionsAfter()!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    findStr.toLowerCase().trim()
    if (!findStr) findStr = '___'
    findStr.slice(0, findStr.length - 1)
    let foundQuestions = search(takeQuestions(), findStr)
    foundQuestions = searchAndColor(foundQuestions, findStr)
    //console.log(foundQuestions)
    return foundQuestions
}

const getTextFromClipImg = async function (clipboard) {
    let img = clipboard.readImage().toJPEG(70)
    const worker = createWorker()
    await worker.load()
    await worker.loadLanguage('ukr')
    await worker.initialize('ukr')
    const res = await worker.recognize(img)
    return {text: res && res.data && res.data.text.slice(0, res.data.text.length - 1), error: ''}
}

const getTextFromClipText = function (clipboard) {
    return {text: clipboard.readText(), error: ''}
}

const getText = async (array, clipboard, textFromInput) => {
    let getTextFun
    let getBy
    if (textFromInput) {
        getTextFun = (clipboard) => {
            clipboard.writeText(textFromInput)
            return textFromInput
        }
        getBy = 'getTextFromInput ⌨️'
    } else if (clipboard.readText() === '') {
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

    const translated = translateFromText(text)
    return {
        text,
        translated,
        date: new Date(),
        getBy
    }
}

module.exports = {getText, getTextFromClipImg, getTextFromClipText}