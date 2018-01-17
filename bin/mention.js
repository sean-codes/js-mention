'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mention = function () {
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
   function Mention(settings) {
      _classCallCheck(this, Mention);

      var that = this;
      this.options = settings.options || [];
      this.input = settings.input;
      this.symbol = settings.symbol || '@';
      this.cursorPosition = 0;
      this.hover = 0;
      this.showingOptions = false;
      this.upDownStay = 0;
      this.update = settings.update || function () {};
      this.match = settings.match || this.defaultMatchFunction;
      this.template = settings.template || this.defaultTemplateFunction;
      this.html = {
         input: undefined,
         display: undefined,
         wrapper: undefined,
         optionsList: undefined,
         options: [],
         spans: [] };
      this.setupHTML();
      this.listen();
   }

   /**
   * Function used to match options based on the word
   * @param {String} [word] - The current word ex. @test
   * @param {String} [option] - The options being looped
   * @return {boolean} - If the word matches the option
   */


   _createClass(Mention, [{
      key: 'defaultMatchFunction',
      value: function defaultMatchFunction(word, option) {
         var optionText = option.name || option;
         return !word.length || optionText.startsWith(word.replace('@', ''));
      }

      /**
      * Function returns the template (innerHTML) that will be used for each option
      * @param {String} [option] - The options being looped
      * @return {String} - The innerHTM
      */

   }, {
      key: 'defaultTemplateFunction',
      value: function defaultTemplateFunction(option) {
         return option.name || option;
      }

      /**
      * Sets up the HTML. Wrapper, Display, OptionsList, Options
      */

   }, {
      key: 'setupHTML',
      value: function setupHTML() {
         this.html.input = this.input;
         this.html.wrapper = document.createElement('div');
         this.html.wrapper.classList.add('mention-wrapper');
         this.html.wrapper.style.position = 'relative';
         this.html.wrapper.style.width = '100%';
         this.html.wrapper.style.height = '100%';
         this.html.display = document.createElement('div');
         this.html.display.classList.add('mention-display');
         this.html.input.parentElement.insertBefore(this.html.wrapper, this.html.input);
         this.html.wrapper.appendChild(this.html.input);
         this.html.wrapper.appendChild(this.html.display);

         // Duplicate the styles ( absolutly unacceptable )
         this.html.display.style.pointerEvents = "none";
         this.html.display.style.position = "absolute";
         this.html.display.style.overflow = "auto";
         var computedStyleInput = window.getComputedStyle(this.html.input, null);
         var borderWidth = parseInt(computedStyleInput.getPropertyValue('border-width'));
         var left = borderWidth + parseInt(computedStyleInput.getPropertyValue('padding-left'));
         var top = borderWidth + parseInt(computedStyleInput.getPropertyValue('padding-top'));
         if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            left += 3;
         } // Mobile safari hack
         this.html.display.style.color = computedStyleInput.getPropertyValue('color');
         this.html.display.style.fontSize = computedStyleInput.getPropertyValue('font-family');
         this.html.display.style.fontFamily = computedStyleInput.getPropertyValue('font-size');
         this.html.display.style.left = left + 'px';
         this.html.display.style.top = top + 'px';
         this.html.input.style.color = 'transparent';

         this.html.optionsList = document.createElement('div');
         this.html.optionsList.classList.add('mention-options');
         this.html.wrapper.appendChild(this.html.optionsList);

         var _iteratorNormalCompletion = true;
         var _didIteratorError = false;
         var _iteratorError = undefined;

         try {
            for (var _iterator = this.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
               var option = _step.value;

               var optionElement = document.createElement('div');
               optionElement.classList.add('mention-option');
               optionElement.innerHTML = this.template(option);
               optionElement.setAttribute('mentiondata', JSON.stringify(option));
               this.html.options.push(optionElement);
               this.html.optionsList.appendChild(optionElement);
            }
         } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
               }
            } finally {
               if (_didIteratorError) {
                  throw _iteratorError;
               }
            }
         }
      }

      /**
      * Begins listening for events on the input and options
      */

   }, {
      key: 'listen',
      value: function listen() {
         var _this = this;

         var that = this;
         this.html.input.addEventListener('input', function () {
            _this.onEventInput();
         });
         this.html.input.addEventListener('keydown', function (e) {
            _this.onEventKeyDown(e);
         });
         this.html.input.addEventListener('keyup', function (e) {
            _this.onEventKeyUp(e);
         });
         this.html.input.addEventListener('scroll', function () {
            _this.onEventScroll();
         });
         this.html.options.forEach(function (o) {
            o.addEventListener('click', function (e) {
               _this.onEventOptionClick(e.target);
            });
         });
      }

      /**
      * Called when  on input.addEventListener('input')
      * @param {Event} e - the event passed
      */

   }, {
      key: 'onEventInput',
      value: function onEventInput() {
         this.updateDisplay();
      }

      /**
      * Called when  on input.addEventListener('keyup')
      * @param {Event} e - the keyboard event passed
      */

   }, {
      key: 'onEventKeyDown',
      value: function onEventKeyDown(e) {
         this.upDownStay = e.code == 'ArrowDown' ? 1 : e.code == 'ArrowUp' ? -1 : 0;
         if (this.upDownStay && this.showingOptions) e.preventDefault();
         if (e.code == 'Enter' && this.showingOptions) {
            e.preventDefault();
            this.onEventOptionClick(this.html.options.find(function (e) {
               return e.classList.contains('hover');
            }));
         }
      }

      /**
      * Called when  on input.addEventListener('keydown')
      * @param {Event} e - the event passed
      */

   }, {
      key: 'onEventKeyUp',
      value: function onEventKeyUp() {
         this.setHoverOption();
         this.cursorPositionChanged();
      }

      /**
      * Called when option input.addEventListener('click')
      */

   }, {
      key: 'onEventOptionClick',
      value: function onEventOptionClick(optionEle) {
         var data = JSON.parse(optionEle.getAttribute('mentiondata')).name;
         this.html.input.value = this.html.input.value.substring(0, this.inputData.start) + '@' + data + this.html.input.value.substring(this.inputData.end, this.html.input.value.length) + ' ';
         this.html.input.focus();
         this.cursorPosition = this.html.input.selectionStart;
         this.updateDisplay();
         this.toggleOptions(false);
      }

      /**
      * Called when on input.addEventListener('scroll')
      */

   }, {
      key: 'onEventScroll',
      value: function onEventScroll() {
         this.html.display.scrollTop = this.html.input.scrollTop;
         //myMention.html.display.style.top = -myMention.html.input.scrollTop + 'px'
      }

      /**
      * Cursor position changed. Check for input data and toggle options
      */

   }, {
      key: 'cursorPositionChanged',
      value: function cursorPositionChanged() {
         this.cursorPosition = this.html.input.selectionStart;
         this.inputData = this.locateInputData({ cursorPosition: this.cursorPosition, value: this.input.value });
         this.toggleOptions(this.inputData.word.length);
         this.optionsMatch();
      }

      /**
      * Updates the display (finds mentions and underlines/bolds them)
      */

   }, {
      key: 'updateDisplay',
      value: function updateDisplay() {
         var storeText = this.html.input.value.replace(/\r?\n/g, '<br/>').replace(' ', '&nbsp;');
         var _iteratorNormalCompletion2 = true;
         var _didIteratorError2 = false;
         var _iteratorError2 = undefined;

         try {
            for (var _iterator2 = this.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
               var option = _step2.value;

               var optionHTML = document.createElement('u');
               optionHTML.innerHTML = this.symbol + (option.name || option);
               optionHTML.setAttribute('mentiondata', JSON.stringify(option));
               storeText = storeText.replace(new RegExp('@' + option.name, 'g'), optionHTML.outerHTML);
            }
         } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
               }
            } finally {
               if (_didIteratorError2) {
                  throw _iteratorError2;
               }
            }
         }

         this.html.display.innerHTML = storeText;
         this.update();
      }

      /**
      * From the cursor positoin looks back to match the work and start/end position
      * @param {Object} data - Options to initialize the component with
      * @param {String} [data.value] - the string to search through
      * @param {Number} [data.cusrorPosition] - The position of the cursor in the string
      */

   }, {
      key: 'locateInputData',
      value: function locateInputData(data) {
         var endPosition = data.cursorPosition;
         var startPosition = data.cursorPosition;
         var valueWithReplacedSpecial = data.value.replace(/\n/g, " ");

         while (startPosition--) {
            var previousCharacter = valueWithReplacedSpecial[startPosition];
            if (previousCharacter == ' ' || previousCharacter == '@') break;
         }

         while (endPosition < valueWithReplacedSpecial.length) {
            var nextCharacter = valueWithReplacedSpecial[endPosition];
            if (nextCharacter == ' ') break;
            endPosition++;
         }

         if (previousCharacter != '@') return { start: data.cursorPosition, end: data.cursorPosition, word: '' };
         return {
            start: startPosition,
            end: endPosition,
            word: valueWithReplacedSpecial.substring(startPosition, data.cursorPosition)
         };
      }

      /**
      * Show/Hide the options list
      * @param {Boolean} toggle - show or hide
      */

   }, {
      key: 'toggleOptions',
      value: function toggleOptions(toggle) {
         this.html.optionsList.classList.toggle('show', toggle);
         this.showingOptions = toggle;
      }

      /**
      * Loop the options and show/hide options based on match function
      */

   }, {
      key: 'optionsMatch',
      value: function optionsMatch() {
         for (var option in this.options) {
            var word = this.inputData.word.replace('@', '');
            this.html.options[option].classList.toggle('show', this.match(word, this.options[option]));
         }
      }

      /**
      * Using up/down arrow selects the next option
      */

   }, {
      key: 'setHoverOption',
      value: function setHoverOption() {
         var viewableOptions = this.html.options.filter(function (e) {
            return e.classList.contains('show');
         });
         if (!viewableOptions.length) return;
         var _iteratorNormalCompletion3 = true;
         var _didIteratorError3 = false;
         var _iteratorError3 = undefined;

         try {
            for (var _iterator3 = this.html.options[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
               var option = _step3.value;

               option.classList.remove('hover');
            }
         } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
               }
            } finally {
               if (_didIteratorError3) {
                  throw _iteratorError3;
               }
            }
         }

         this.hover = this.upDownStay ? this.hover + this.upDownStay : 0;
         if (this.hover < 0) {
            this.hover = viewableOptions.length - 1;
         }
         if (this.hover == viewableOptions.length) {
            this.hover = 0;
         }
         viewableOptions[this.hover].classList.add('hover');
      }

      /**
      * Returns the mentions form the input. Returns the value of the option with its properties
      */

   }, {
      key: 'collect',
      value: function collect() {
         var data = [];
         var added = this.html.display.querySelectorAll('u');
         var _iteratorNormalCompletion4 = true;
         var _didIteratorError4 = false;
         var _iteratorError4 = undefined;

         try {
            for (var _iterator4 = added[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
               var add = _step4.value;

               data.push(JSON.parse(add.getAttribute('mentiondata')));
            }
         } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
         } finally {
            try {
               if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
               }
            } finally {
               if (_didIteratorError4) {
                  throw _iteratorError4;
               }
            }
         }

         return data;
      }

      /**
      * Removes the HTML and listeners
      */

   }, {
      key: 'deconctruct',
      value: function deconctruct() {}
   }]);

   return Mention;
}();

if (typeof module != 'undefined') module.exports = Mention;