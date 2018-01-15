class Mention {
   constructor(settings) {
      var that = this
      this.options = settings.options || []
      this.input = settings.input
      this.key = settings.key || '@'
      this.cursorPosition = 0
      this.hover = 0
      this.showingOptions = false
      this.upDownStay = 0
      this.update = settings.update || function(){}
      this.match = settings.match || this.defaultMatchFunction
      this.template = settings.template || this.defaultTemplate
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

   defaultMatchFunction(word, option) {
      return (!word.length || option.name.startsWith(word.replace('@', '')))
   }

   defaultTemplate(option) {
      return option.name || option
   }

   listen() {
      var that = this
      this.html.input.addEventListener('input', (e) => {
         this.updateDisplay()
         this.cursorPosition = this.html.input.selectionStart
         this.inputData = this.locateInputData({ cursorPosition: this.cursorPosition, value: this.input.value })
         this.optionsMatch()
         this.inputData.word.length ? this.showOptions() : this.hideOptions()
      })

      for(var optionElement of this.html.options) {
         optionElement.addEventListener('click', function(e) {
            that.selectOption(this)
         })
      }

      this.html.input.addEventListener('scroll', function(e) {
         that.html.display.scrollTop = that.html.input.scrollTop
      })

      this.html.input.addEventListener('keydown', function(e) {
         that.upDownStay = e.code == 'ArrowDown' ? 1 : e.code == 'ArrowUp' ? -1 : 0
         if(that.upDownStay && that.showingOptions) e.preventDefault()
         if(e.code == 'Enter' && that.showingOptions) {
            e.preventDefault()
            that.selectOption(that.html.options.find(function(e) { return e.classList.contains('hover') }))
         }
      })
      this.html.input.addEventListener('keyup', function(e) {
         that.setHoverOption()
      })
   }

   setupHTML() {
      this.html.input = this.input
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
         optionElement.innerHTML = this.template(option)
         optionElement.setAttribute('mentiondata', JSON.stringify(option))
         this.html.options.push(optionElement)
         this.html.optionsList.appendChild(optionElement)
      }
   }

   updateDisplay() {
      var storeText = this.html.input.value.replace(/\r?\n/g, '<br/>')
      var storeText = this.html.input.value.replace(' ', '&nbsp;')
      for(var option of this.options) {
         var optionHTML = document.createElement('u')
         optionHTML.innerHTML = this.key + option.name
         optionHTML.setAttribute('mentiondata', JSON.stringify(option))
         storeText = storeText.replace(new RegExp('@'+option.name, 'g'), optionHTML.outerHTML)
      }
      this.html.display.innerHTML = storeText
      this.update()
   }

   optionsMatch() {
      for(var option in this.options) {
         var word = this.inputData.word.replace('@', '')
         this.html.options[option].classList.toggle('show', this.match(word, this.options[option]))
      }
   }

   locateInputData(data) {
      var startPosition = data.cursorPosition
      var valueWithReplacedSpecial = data.value.replace(/\n/g, " ");

      while(startPosition--){
         var previousCharacter = valueWithReplacedSpecial[startPosition]
         if(previousCharacter == ' ' || previousCharacter == '@') break
      }

      if(previousCharacter != '@') return { start: data.cursorPosition, end: data.cursorPosition, word: ''}
      return {
         start: startPosition,
         end: data.cursorPosition,
         word: valueWithReplacedSpecial.substring(startPosition, data.cursorPosition)
      }
   }

   showOptions() {
      this.html.options[0].classList.add
      this.html.optionsList.classList.add('show')
      this.showingOptions = true
   }
   hideOptions() {
      this.html.optionsList.classList.remove('show')
      this.showingOptions = false
   }

   selectOption(optionHTML) {
      var data = JSON.parse(optionHTML.getAttribute('mentiondata')).name
      this.html.input.value =
         this.html.input.value.substring(0, this.inputData.start) +
         '@' + data +
         this.html.input.value.substring(this.inputData.end, this.html.input.value.length) + ' '
      this.updateDisplay()
      this.hideOptions()
      this.html.input.focus()
   }

   setHoverOption() {
      var viewableOptions = this.html.options.filter(function(e){ return e.classList.contains('show') })
      if(!viewableOptions.length) return
      for(var option of this.html.options) {
         option.classList.remove('hover')
      }
      this.hover = this.upDownStay ? this.hover + this.upDownStay : 0
      if(this.hover < 0){ this.hover = viewableOptions.length - 1 }
      if(this.hover == viewableOptions.length) { this.hover = 0}
      viewableOptions[this.hover].classList.add('hover')
   }

   collect() {
      var data = []
      var added = this.html.display.querySelectorAll('u')
      for(var add of added) {
         data.push(JSON.parse(add.getAttribute('mentiondata')))
      }
      return data
   }
}

if(typeof module != 'undefined') module.exports = Mention
