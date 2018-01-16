class Mention {
	/**
	 * @class Mention
	 * @classdesc Allows using a symbol to display options
	 *
	 * @param {Object} settings - Options to initialize the component with
	 * @param {HTMLElement} settings.input - The textarea to watch {@link Component#input}
	 * @param {HTMLElement} settings.optionList - Element to display options when matched {@link Component#optionList}
	 * @param {Array} settings.options - Array of options. Options can have properties {@link Component#options}
	 * @param {String} [settings.symbol="@"] - The symbol that initials the option list {@link Component#symbol}
	 * @param {Function} [settings.match] - The function used to match options {@link Component#match}
	 * @param {Function} [settings.template] - The template function outputs the innerHTML of the optionlist {@link Component#template}
	 */
   constructor(settings) {
      var that = this
      this.options = settings.options || []
      this.input = settings.input
      this.symbol = settings.symbol || '@'
      this.cursorPosition = 0
      this.hover = 0
      this.showingOptions = false
      this.upDownStay = 0
      this.update = settings.update || function(){}
      this.match = settings.match || this.defaultMatchFunction
      this.template = settings.template || this.defaultTemplateFunction
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

	/**
	 * Function used to match options based on the word
	 * @param {String} [word] - The current word ex. @test
	 * @param {String} [option] - The options being looped
	 * @return {boolean} - If the word matches the option
	 */
   defaultMatchFunction(word, option) {
      return (!word.length || option.name.startsWith(word.replace('@', '')))
   }

	/**
	 * Function returns the template (innerHTML) that will be used for each option
	 * @param {String} [option] - The options being looped
	 * @return {String} - The innerHTM
	 */
   defaultTemplateFunction(option) {
      return option.name || option
   }

	/**
	 * Sets up the HTML. Wrapper, Display, OptionsList, Options
	 */
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

	/**
	 * Begins listening for events on the input and options
	 */
   listen() {
      var that = this
      this.html.input.addEventListener('input', (e) => { this.onInputEvent(e) })

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

	/**
	 * Called when  on input.addEventListener('input')
	 * @param {Event} e - the event passed
	 */
	onInputEvent(e) {
		this.updateDisplay()
		this.cursorPosition = this.html.input.selectionStart
		this.inputData = this.locateInputData({ cursorPosition: this.cursorPosition, value: this.input.value })
		this.optionsMatch()
		this.toggleOptions(this.inputData.word.length)
	}

	/**
	 * Updates the display (finds mentions and underlines/bolds them)
	 */
   updateDisplay() {
      var storeText = this.html.input.value.replace(/\r?\n/g, '<br/>').replace(' ', '&nbsp;')
      for(var option of this.options) {
         var optionHTML = document.createElement('u')
         optionHTML.innerHTML = this.key + option.name
         optionHTML.setAttribute('mentiondata', JSON.stringify(option))
         storeText = storeText.replace(new RegExp('@'+option.name, 'g'), optionHTML.outerHTML)
      }
      this.html.display.innerHTML = storeText
      this.update()
   }

	/**
	 * From the cursor positoin looks back to match the work and start/end position
	 * @param {Object} data - Options to initialize the component with
	 * @param {String} [data.value] - the string to search through
	 * @param {Number} [data.cusrorPosition] - The position of the cursor in the string
	 */
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

	/**
	 * Show/Hide the options list
	 * @param {Boolean} toggle - show or hide
	 */
	toggleOptions(toggle) {
      this.html.optionsList.classList.toggle('show', toggle)
      this.showingOptions = toggle
   }

	/**
	 * Loop the options and show/hide options based on match function
	 */
	optionsMatch() {
      for(var option in this.options) {
         var word = this.inputData.word.replace('@', '')
         this.html.options[option].classList.toggle('show', this.match(word, this.options[option]))
      }
   }

	/**
	 * When an option is selected. Replace the locationData and update display
	 */
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

	/**
	 * Using up/down arrow selects the next option
	 */
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

	/**
	 * Returns the mentions form the input. Returns the value of the option with its properties
	 */
   collect() {
      var data = []
      var added = this.html.display.querySelectorAll('u')
      for(var add of added) {
         data.push(JSON.parse(add.getAttribute('mentiondata')))
      }
      return data
   }

	/**
	 * Removes the HTML and listeners
	 */
   deconctruct() {
      var data = []
      var added = this.html.display.querySelectorAll('u')
      for(var add of added) {
         data.push(JSON.parse(add.getAttribute('mentiondata')))
      }
      return data
   }
}

if(typeof module != 'undefined') module.exports = Mention
