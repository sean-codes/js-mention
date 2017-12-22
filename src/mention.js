new Mention({
   selector: 'p',
   options: ['one', 'two', 'three']
})

function Mention(settings) {
   this.listen = function() {
      this.html.input.addEventListener('keyup', function(e) {
         if(e.key == that.key) that.showOptions()
         if(e.key == ' '){ that.hideOptions(); return }

         // Check if @ is behind
         var carretPosition = window.getSelection().getRangeAt(that.html.input).startOffset
         if(carretPosition == 0){ that.hideOptions(); return }

         while(carretPosition--){
            previousCharacter = that.html.input.innerHTML[carretPosition]
            if(previousCharacter == ' ') break
            if(previousCharacter == '@') {
               that.showOptions()
               break
            }
         }
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
      this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input)
      this.html.wrapper.appendChild(this.html.input)

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
   }

   var that = this
   this.options = settings.options || []
   this.selector = settings.selector
   this.key = settings.key || '@'
   this.html = {
      input: undefined,
      wrapper: undefined,
      optionsList: undefined,
      options: [],
      spans: [] }
   this.setupHTML()
   this.listen()
}
