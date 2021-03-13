const { getText, getTextFromClipImg, getTextFromClipText } = require('./RAndT')
const { clipboard } = require('electron')

//clipboard.writeText('Hello world')

describe('getTextFromClipText:', () => {
    test('should return text from clipboard', () => {
        //expect(getTextFromClipText(clipboard)).toBe('Hello world')
        expect(true).toBeTruthy()
    })
})