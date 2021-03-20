// const fs = require('fs')
//
// const filename = 'finalBig.txt'
// const findStr = 'Кабінету Міністрів'
//
// fs.readFile(filename, 'utf8', (err, data) => {
//     if (err) throw err
//     console.log('OK: ' + filename)
//     const allQuestions = data.trim().split('.\n')
//     allQuestions.forEach((cur, i, arr) => arr[i] = cur.split('?\n'))
//     allQuestions.forEach((cur, i, arr) => arr[i][1] = cur[1] ? cur[1].split(';\n') : 'ERROR')
//
//     let foundQuestions = search(allQuestions, findStr)
//     foundQuestions = searchAndColor(foundQuestions, findStr)
//     console.log(foundQuestions)
// })
//
// const search = (questions, findStr) => {
//     return questions.filter(cur => cur[0].search(new RegExp(findStr)) !== -1)
// }
//
// const searchAndColor = (questions, findStr) => {
//     return questions.map((cur, i, arr) => {
//         const pos = cur[0].search(new RegExp(findStr))
//         if (pos === -1) throw 'error in searchAndColor func'
//         cur[0] = arr[i][0].slice(0, pos) + '<mark>' + arr[i][0].slice(pos, pos + findStr.length) + '</mark>' + arr[i][0].slice(pos + findStr.length)
//         return cur
//     })
// }