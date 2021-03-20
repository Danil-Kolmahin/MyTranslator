const {getQuestionsAfter} = require("./textWork")

const a = getQuestionsAfter().slice(0, 1)

const c = getQuestionsAfter().slice(0, 1)

c.push(5)

console.log(c)
console.log(a)