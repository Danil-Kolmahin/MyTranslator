const fs = require('fs')
const filename = 'finalBig.txt'

const takeQuestions = () => {
    const allQuestions = fs.readFileSync(filename, 'utf8').trim().toLowerCase().split('.\n')
    allQuestions.forEach((cur, i, arr) => arr[i] = cur.split('?\n'))
    allQuestions.forEach((cur, i, arr) => arr[i][1] = cur[1] ? cur[1].split(';\n') : 'ERROR')
    return allQuestions
}

module.exports = {takeQuestions}