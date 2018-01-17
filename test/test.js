var tape = require('tape')
var Mention = require('../src/mention.js')

// Create HTML
var textarea = document.createElement('textarea')
document.body.appendChild(textarea)

//Settings
var settings = {
   input: textarea,
   options: ['one', 'two', 'three']
}

tape('HTML is setup', (test) => {
   //Create mention
   var mention = new Mention(settings)

   test.ok(mention.html.input, 'Input exists')
   test.ok(mention.html.wrapper, 'Wrapper exists')
   test.ok(mention.html.display, 'Display exists')
   test.ok(mention.html.optionsList, 'Options exist')
   test.equal(mention.html.input.parentElement, mention.html.wrapper, 'Input inside wrapper')
   test.equal(mention.html.display.parentElement, mention.html.wrapper, 'Display inside wrapper')
   test.equal(mention.html.options.filter((e, i) => {
      return e.innerHTML == settings.options[i]
   }).length, 3, 'Options match settings')

   test.end()
})

tape('Input Data can be Located', (test) => {
   var mention = new Mention(settings)

   input = { value: '@awd', cursorPosition: 4 }
   output = { word: '@awd', start: 0, end: 4 }
   test.deepEqual(mention.locateInputData(input), output, 'Basic locate Input data')

   input = { value: '@awd @', cursorPosition: 4 }
   output = { word: '@awd', start: 0, end: 4 }
   test.deepEqual(mention.locateInputData(input), output, 'Basic locate input date with @ after')

   input = { value: '@awd\n', cursorPosition: 5 }
   output = { word: '', start: 5, end: 5 }
   test.deepEqual(mention.locateInputData(input), output, 'Locate input data with enter')

   input = { value: '@awd \n@', cursorPosition: 7 }
   output = { word: '@', start: 6, end: 7 }
   test.deepEqual(mention.locateInputData(input), output, 'Locate input data with enter and @ after')

   input = { value: '@awd @', cursorPosition: 6 }
   output = { word: '@', start: 5, end: 6 }
   test.deepEqual(mention.locateInp-utData(input), output, 'Locate input data with space and @ after')

   input = { value: '@awd', cursorPosition: 3 }
   output = { word: '@aw', start: 0, end: 4 }
   test.deepEqual(mention.locateInputData(input), output, 'Cursor within input value. Moves end around the word ex. @a|wda')

   test.end()
})

tape('Cursor moves. Toggle options open/closed', (test) => {
   var mention = new Mention(settings)

   mention.input.value = '@one'
   mention.input.focus()
   mention.cursorPositionChanged()

   test.equal(mention.cursorPosition, 4, 'cursor position is moved')
   test.ok(mention.showingOptions, '@ symbol in word. Options are shown')

   mention.input.value = 'one'
   mention.input.focus()
   mention.cursorPositionChanged()

   test.equal(mention.cursorPosition, 3, 'cursor position is moved')
   test.notOk(mention.showingOptions, 'no @ symbol in word. Options are shown')
   test.end()
})

tape('Display follows input on scroll', (test) => {

   test.end()
})
