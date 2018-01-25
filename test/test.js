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
   test.equal(mention.html.input.parentElement, mention.html.textWrapper, 'Input inside wrapper')
   test.equal(mention.html.display.parentElement, mention.html.textWrapper, 'Display inside wrapper')
   test.equal(mention.html.options.filter((e, i) => {
      return e.innerHTML == settings.options[i]
   }).length, 3, 'Options match settings')

   test.end()
})

tape('Read word at cursor', (test) => {
   //Create mention
   var mention = new Mention(settings)

   input = { value: '@awd', cursorPosition: 4 }
   output = { word: '@awd', index: 0 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Basic locate Input data')

   input = { value: '@awd @', cursorPosition: 4 }
   output = { word: '@awd', index: 0 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Basic locate input date with @ after')

   input = { value: '@awd\n', cursorPosition: 5 }
   output = { word: '', index: 5 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Locate input data with enter')

   input = { value: '@awd \n@', cursorPosition: 7 }
   output = { word: '@', index: 6 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Locate input data with space + enter and @ after')

   input = { value: '@awd @', cursorPosition: 6 }
   output = { word: '@', index: 5}
   test.deepEqual(mention.readWordAtCursor(input), output, 'Locate input data with space and @ after')

   input = { value: '@awd', cursorPosition: 3 }
   output = { word: '@awd', index:0 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Cursor within value. Moves to end of word ex. @a|wda')

   input = { value: '@awd@awd', cursorPosition: 8 }
   output = { word: '@awd@awd', index: 0 }
   test.deepEqual(mention.readWordAtCursor(input), output, 'Multiple @ symbols in the word')

   test.end()
})

tape('Cursor moves. Toggle options open/closed', (test) => {
   //Create mention
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


tape('Display and textarea expand to fit content', (test) => {
   var mention = new Mention(settings)

   mention.input.value = 'awdw'
   mention.updateDisplay()
   test.equal(mention.html.display.offsetHeight, 19, 'One line no breaks')

   mention.input.value = 'awdw \r'
   mention.updateDisplay()
   test.equal(mention.html.display.offsetHeight, 32, 'One line with line break no text after')

   mention.input.value = 'awdw \r\r'
   mention.updateDisplay()
   test.equal(mention.html.display.offsetHeight, 45, 'one lines with two linebreaks no spaces')

   test.end()
})

tape('Finding options that match', (test) => {
   var mention = new Mention(settings)
   mention.input.value = ''
   test.deepEqual(mention.findMatches(), [], 'No value gets empty array')

   mention.input.value = 'Nothing to find here'
   test.deepEqual(mention.findMatches(), [], 'Value without and matches')

   mention.input.value = '@one'
   var expected = [{ word: '@one', index: 0 }]
   test.deepEqual(mention.findMatches(), expected, 'One options no space after at index 0')

   mention.input.value = '@one @two'
   var expected = [{ word: '@two', index: 5 }, { word: '@one', index: 0 }]
   test.deepEqual(mention.findMatches(), expected, 'Two matches no space after last')
   test.end()
})

tape('replacing Input Value with HTML', (test) => {
   //Create mention
   var mention = new Mention(settings)
   mention.html.input.value = '@one'
   mention.updateDisplay()
   var expected = '<u mentiondata="&quot;one&quot;">@one</u>'
   test.equal(mention.html.display.innerHTML, expected, 'One match one <u> element with nbsp')

   mention.html.input.value = '@one @one'
   mention.updateDisplay()
   var expected = '<u mentiondata="&quot;one&quot;">@one</u> <u mentiondata="&quot;one&quot;">@one</u>'
   test.equal(mention.html.display.innerHTML, expected, 'Two matches two <u> element with nbsp')

   mention.html.input.value = '@one \n @two'
   mention.updateDisplay()
   var expected = '<u mentiondata="&quot;one&quot;">@one</u> \n <u mentiondata="&quot;two&quot;">@two</u>'
   test.equal(mention.html.display.innerHTML, expected, 'Two matches two <u> element with line break')

   test.end()
})
