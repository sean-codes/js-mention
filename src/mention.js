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
      var optionText = option.name || option
      return (!word.length || optionText.startsWith(word.replace('@', '')))
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
      var computedStyleInput = window.getComputedStyle(this.html.input, null)

      this.html.wrapper = document.createElement('div')
      this.html.wrapper.classList.add('mention-wrapper')
      this.html.wrapper.style.position = 'relative'
      this.html.wrapper.style.width = computedStyleInput.getPropertyValue('width')
      this.html.wrapper.style.height = '100%'


      this.html.display = document.createElement('div')
      this.html.display.classList.add('mention-display')
      this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input)
      this.html.wrapper.appendChild(this.html.input)
      this.html.wrapper.appendChild(this.html.display)

      // Duplicate the styles ( absolutly unacceptable )
		this.html.display.style.color = computedStyleInput.getPropertyValue('color')
		this.html.display.style.fontSize = computedStyleInput.getPropertyValue('font-family')
		this.html.display.style.fontFamily = computedStyleInput.getPropertyValue('font-size')
      this.html.display.style.padding = computedStyleInput.getPropertyValue('padding')
      this.html.display.style.border = computedStyleInput.getPropertyValue('border')
      if(/iPhone|iPad|iPod/i.test(navigator.userAgent)){
         //this.html.display.style.borderTopWidth = parseInt(computedStyleInput.getPropertyValue('border-top-width')) + 3 + 'px'
         this.html.display.style.paddingLeft = parseInt(computedStyleInput.getPropertyValue('padding-left')) + 3 + 'px'
      }
      this.html.display.style.boxSizing = computedStyleInput.getPropertyValue('box-sizing')
      this.html.display.style.pointerEvents = "none"
      this.html.display.style.position = "absolute"
      this.html.display.style.overflow = "hidden"
      this.html.display.style.left = '0px'
      this.html.display.style.top = '0px'
      this.html.display.style.width = '100%';
      this.html.display.style.height = '100%';
      this.html.input.style.width = '100%'

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
      this.html.input.addEventListener('input', () => { this.onEventInput() })
      this.html.input.addEventListener('keydown', (e) => { this.onEventKeyDown(e) })
      this.html.input.addEventListener('keyup', (e) => { this.onEventKeyUp(e) })
      this.html.input.addEventListener('scroll', () => { this.onEventScroll() })
      this.html.options.forEach((o) => { o.addEventListener('click', (e) => { this.onEventOptionClick(e.target) }) })
   }

	/**
	* Called when  on input.addEventListener('input')
	* @param {Event} e - the event passed
	*/
	onEventInput() {
		this.updateDisplay()
	}

   /**
	* Called when  on input.addEventListener('keyup')
	* @param {Event} e - the keyboard event passed
	*/
   onEventKeyDown(e) {
      this.upDownStay = e.code == 'ArrowDown' ? 1 : e.code == 'ArrowUp' ? -1 : 0
      if(this.upDownStay && this.showingOptions) e.preventDefault()
      if(e.code == 'Enter' && this.showingOptions) {
         e.preventDefault()
         this.onEventOptionClick(this.html.options.find(function(e) { return e.classList.contains('hover') }))
      }
   }

   /**
	* Called when  on input.addEventListener('keydown')
	* @param {Event} e - the event passed
	*/
   onEventKeyUp() {
      this.setHoverOption()
      this.cursorPositionChanged()
   }

   /**
	* Called when option input.addEventListener('click')
	*/
   onEventOptionClick(optionEle) {
      var word = JSON.parse(optionEle.getAttribute('mentiondata')).name
      this.html.input.value = this.html.input.value.substring(0, this.inputData.start) + '@' + word
         + this.html.input.value.substring(this.inputData.end, this.html.input.value.length) + ' '
      this.html.input.focus()
      this.setCursorPosition(this.html.input.value.length + word.length)
      this.updateDisplay()
      this.toggleOptions(false)
   }

   /**
   * Called when on input.addEventListener('scroll')
   */
   onEventScroll() {
      this.html.display.scrollTop = this.html.input.scrollTop
      //myMention.html.display.style.top = -myMention.html.input.scrollTop + 'px'
   }

   /**
   * Cursor position changed. Check for input data and toggle options
   */
   cursorPositionChanged() {
      this.cursorPosition = this.html.input.selectionStart
		this.inputData = this.locateInputData({ cursorPosition: this.cursorPosition, value: this.input.value })
      this.toggleOptions(this.inputData.word.length)
		this.optionsMatch()
   }

	/**
	* Updates the display (finds mentions and underlines/bolds them)
	*/
   updateDisplay() {
      var storeText = this.html.input.value.replace(/\r?\n/g, ' <br/>').replace(/ /g, '&nbsp;')
      if(storeText[storeText.length-1] == '>') { storeText+= '&nbsp;' } // Fixes scroll height
      for(var option of this.options) {
         var optionHTML = document.createElement('u')
         optionHTML.innerHTML = this.symbol + (option.name || option)
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
      var endPosition = data.cursorPosition
      var startPosition = data.cursorPosition
      var valueWithReplacedSpecial = data.value.replace(/\n/g, " ");

      while(startPosition--){
         var previousCharacter = valueWithReplacedSpecial[startPosition]
         if(previousCharacter == ' ' || previousCharacter == '@') break
      }

      while(endPosition < valueWithReplacedSpecial.length) {
         var nextCharacter = valueWithReplacedSpecial[endPosition]
         if(nextCharacter == ' ') break
         endPosition++
      }

      if(previousCharacter != '@') return { start: data.cursorPosition, end: data.cursorPosition, word: ''}
      return {
         start: startPosition,
         end: endPosition,
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

   }

   /**
   * Sets the cursor position in the text area
   * @param {Number} position - the position
   */
   setCursorPosition(position) {
      this.cursorPosition = position
      this.html.input.setSelectionRange(position, position);
   }
}

if(typeof module != 'undefined') module.exports = Mention
