const fs = require('fs')
const filename = 'finalBig.txt'

const takeQuestions = () => {
    const allQuestions = fs.readFileSync(filename, 'utf8').trim().toLowerCase().split('.\n')
    allQuestions.forEach((cur, i, arr) => arr[i] = cur.split('?\n'))
    allQuestions.forEach((cur, i, arr) => arr[i][1] = cur[1] ? cur[1].split(';\n') : 'ERROR')
    return allQuestions
}

const search = (questions, findStr) => questions.filter(cur => cur[0].search(new RegExp(findStr)) !== -1)

const searchAndColor = (questions, findStr) => questions.map(cur => {
    const pos = cur[0].search(new RegExp(findStr))
    if (pos === -1) throw 'error in searchAndColor func'
    const current = cur
    current[0] = cur[0].slice(0, pos) + '<mark>' + cur[0].slice(pos, pos + findStr.length) + '</mark>' + cur[0].slice(pos + findStr.length)
    return current
})

module.exports = {takeQuestions, search, searchAndColor}