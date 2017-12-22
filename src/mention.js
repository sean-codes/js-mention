var myMention = new Mention({
   selector: 'textarea',
   options: ['one', 'two', 'three']
})

function Mention(settings) {
   this.listen = function() {
      this.html.input.addEventListener('keyup', function(e) {

         // Update carret Position
         that.updateDisplay()
         that.setCursorPosition()
         that.locateInputData()

         that.inputData.word.length ? that.showOptions() : that.hideOptions()

      })

      for(var optionElement of this.html.options) {
         optionElement.addEventListener('click', function(e) {
            that.selectOption(this.innerHTML)
         })
      }
   }

   this.setupHTML = function() {
      this.html.input = document.querySelector(settings.selector)
      this.html.wrapper = document.createElement('div')
      this.html.wrapper.classList.add('mention-wrapper')
      this.html.display = document.createElement('div')
      this.html.display.classList.add('mention-display')
      this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input)
      this.html.wrapper.appendChild(this.html.input)
      this.html.wrapper.appendChild(this.html.display)

      this.html.optionsList = document.createElement('div')
      this.html.optionsList.classList.add('mention-options')
      this.html.wrapper.appendChild(this.html.optionsList)

      for(var option of this.options) {
         var optionElement = document.createElement('div')
         optionElement.classList.add('mention-option')
         optionElement.innerHTML = option
         this.html.options.push(optionElement)
         this.html.optionsList.appendChild(optionElement)
      }
   }

   this.setCursorPosition = function() {
      this.cursorPosition = this.html.input.selectionStart
   }

   this.updateDisplay = function() {
      var storeText = this.html.input.value
      for(var option of this.options) {
         optionHTML = '<u>@'+option+'</u>'
         storeText = storeText.replace(new RegExp('@'+option, 'g'), optionHTML)
      }
      this.html.display.innerHTML = storeText
   }

   this.locateInputData = function() {
      var endPosition = this.cursorPosition
      var startPosition = this.cursorPosition
      while(endPosition--){
         startPosition = endPosition
         previousCharacter = that.html.input.value[endPosition]
         if(previousCharacter == ' ') break
         if((previousCharacter == '@')
         && (endPosition-1 <= 0 || that.html.input.value[endPosition-1] == ' ')) {
            break
         }
      }
      if(that.html.input.value[startPosition] != '@') startPosition = this.cursorPosition
      this.inputData = {
         start: startPosition,
         end: this.cursorPosition,
         word: this.html.input.value.substring(startPosition, this.cursorPositon)
      }
      console.log(this.inputData)
   }

   this.showOptions = function() {
      console.log('Show Options')
      this.html.optionsList.classList.add('show')
   }
   this.hideOptions = function() {
      console.log('Hide Options')
      this.html.optionsList.classList.remove('show')
   }
   this.selectOption = function(data) {
      console.log('Selecting Data')
      console.log(data)
      console.log(this.locateTag())
   }

   var that = this
   this.options = settings.options || []
   this.selector = settings.selector
   this.key = settings.key || '@'
   this.cursorPosition = 0
   this.html = {
      input: undefined,
      display: undefined,
      wrapper: undefined,
      optionsList: undefined,
      options: [],
      spans: [] }
   this.setupHTML()
   this.listen()
}
